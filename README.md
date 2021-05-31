# Oreonite Manganese
This is just a another simple Discord Bot that awaits to be developed into something fancy. It uses [Eris](https://github.com/abalabahaha/eris) and [Supabase-js](https://github.com/supabase/supabase-js).

### DB Requirements

Please define these tables along with it's properties and datatypes below on your Supabase instance to allow this Bot to communicate properly.

#### guilds
| Collumn Name | type | Primary | Foreign |
|-|-|-|-|
| guild_id | `text` | yes | no |

#### channels
| Collumn Name | type | Primary | Foreign |
|-|-|-|-|
| channel_id | `text` | yes | no |
| guild_id | `varchar` | no | yes |

#### messages
| Collumn Name | type | Primary | Foreign |
|-|-|-|-|
| message_id | `text` | yes | no |
| channel_id | `varchar` | yes | yes |
| created | `date` | no | no |
| message_neutral_score | `float4` | no | no |
| message_abusive_score | `float4` | no | no |
| message_hate_score | `float4` | no | no |

### How-to-use-this

NOTE: For the sake of long-term maintability, we would highly recommend you to use Node v14 LTS.

-----

#### 1. Classic Node Deployment

First, clone this repo somewhere into your deployment machine

```bash
git clone https://github.com/xatryx/es-discord-OreoniteManganese.git
```

Then open `es-discord-OreoniteManganese` folder and create a `.env` file
```bash
cd es-discord-OreoniteManganese
cp .env.example .env
```

Open the `.env` file with any text editors and here, define this below with your own Discord Bot Token, Supabase URL, and Supabase Service Token.
```bash
DISCORD_BOT_TOKEN=Your_Token_String
SUPABASE_URL=Your_URL_String
SUPABASE_KEY=Your_KEY_String
```

Now, fly with the wind !!!
```bash
npm run start
```

-----

#### 2. Google Cloud AppEngine

We've included a `app.yaml` file that you can use to deploy this into AppEngine.

### License
This project is licensed under **GNU General Public License v2.0 only**. Please have a look at `COPYING` for futher details.