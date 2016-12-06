# FindMeAFlat

Crawls Wg-Gesucht, Immoscout and eBay Kleinanzeigen for new listings.
Notifications are being sent via [Telegram](https://telegram.org).

## Installation

```
npm install
```

## Usage

The configuration file is located in `conf/`.

```
vim conf/config.json
```

```json
{
  "immoscout": {
    "url": "https://www.immobilienscout24.de/Suche/S-2/Wohnung-Miete/Berlin/Berlin/Wedding-Wedding_Schoeneberg-Schoeneberg/-/99,00-/EURO--9999,00/-/-/false"
  },
  "kleinanzeigen": {
      "url": "https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/berlin/anzeige:angebote/preis::9999/wohnung/k0c203l3331+wohnung_mieten.qm_i:99,"
  },
  "wggesucht": {
    "city": "Berlin",
    "cityKey": 8,
    "maxRent": 9999,
    "minSize": 99,
  },
  "telegram": {
    "chatId": "yourChatId",
    "token": "yourToken"
  },
  "blacklist": [
    "swap",
    "tausch",
    "wg"
  ],
  "wantedDistricts": [
    "Wedding",
    "Friedrichshain"
  ]
}
```

### Immoscout

Create your custom search query on the official website. Then just copy and
paste the whole URL.

**Important:** Make sure to sort by newest listings!

### Kleinanzeigen

Create your custom search query here as well.

### WgGesucht

The `cityKey` can be found in the URL of any listings page for the respective
city.

### Telegram

For the Telegram notification to work you need to create a [Telegram
bot](https://core.telegram.org/bots). Follow those
[instructions](https://core.telegram.org/bots#botfather) to create  one and get
the `token` for the bot. Since bots are not allowed to contact users you need
to send a message first. To retrieve your `chatId` you can then use `$ curl -X
GET https://api.telegram.org/botYOUR_API_TOKEN/getUpdates`.

### Blacklist

Listings which contain at least on of those words (ignoring case, only whole
words) are being blacklisted.
