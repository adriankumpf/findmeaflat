# FindMeAFlat

Crawls wg-gesucht.de and notifies you of new listings via Telegram.

## Installation

```
npm install
```

## Usage

The configuration file is located in `conf/`.

### Create default configuration file

```
vim conf/config.json
```

```json
{
  "blacklist": [
    "swap",
    "tausch",
    "wg"
  ],
  "city": "Berlin",
  "cityKey": 8,
  "maxRent": 9999,
  "minSize": 99,
  "telegram": {
    "chatId": "yourChatId",
    "token": "yourToken"
  },
  "wantedDistricts": [
    "Wedding",
  ]
}
```

The `cityKey` can be found in the URL of any listings page for the respective
city

For the Telegram notification to work you need to create a [Telegram
bot](https://core.telegram.org/bots). Please follow those
[instructions](https://core.telegram.org/bots#botfather) to create  one and get
the token for the bot. Since bots are not allowed to contact users you need to
send a message first. To retrieve your chat_id you can then use `$ curl -X GET
https://api.telegram.org/botYOUR_API_TOKEN/getUpdates`.
