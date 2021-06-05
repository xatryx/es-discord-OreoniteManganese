import config from 'dotenv/config'
import { BertWordPieceTokenizer } from "tokenizers"
import vertexAi, { helpers } from "@google-cloud/aiplatform"
import fs from 'fs'


export async function abusivePrediction(message) {
  const { attention_mask, input_ids } = await encoding({ message })

  const { normal, abusive, hate_speech } = await predictFromVertexAI({
    attention_mask,
    input_ids,
  })

  return {
    normal,
    abusive,
    hate_speech,
  }
}

export async function encoding({ message }) {
  const listOfToken = await BertWordPieceTokenizer.fromOptions({
    vocabFile: "vocab.txt",
  })

  const tokenizer = await listOfToken.encode(message)

  const attention_mask = tokenizer.attentionMask
  const input_ids = tokenizer.ids

  while (attention_mask.length < 256) {
    attention_mask.push(0)
    input_ids.push(0)
  }
  return {
    attention_mask,
    input_ids,
  }
}

export async function predictFromVertexAI({
  attention_mask,
  input_ids,
}) {

  const endpoint = process.env.ENDPOINT

  const credentials = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_DIR, 'utf8'));

  const clientOptions = {
    apiEndpoint: process.env.API_ENDPOINT,
    credentials: credentials,
  }

  const { PredictionServiceClient } = vertexAi.v1

  const parameters = helpers.toValue({})

  const predictionServiceClient = new PredictionServiceClient(clientOptions)

  const instance = helpers.toValue({
    input_ids: input_ids,
    attention_mask: attention_mask,
  })

  const instances = [instance]
  const request = {
    endpoint,
    instances,
    parameters,
  }

  const [response] = await predictionServiceClient.predict(request)
  const predictions = response.predictions

  for (const prediction of predictions) {
    const predict = prediction.listValue.values

    const normal = predict[0].numberValue
    const abusive = predict[1].numberValue
    const hate_speech = predict[2].numberValue

    return {
      normal,
      abusive,
      hate_speech,
    }
  }
}
