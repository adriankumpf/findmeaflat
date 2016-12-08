# FindMeAFlat

Crawls popular german real estate portals for new listings. Notifications are
being sent via [Telegram](https://telegram.org).

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
  "immonet": {
    "url": "http://www.immonet.de/immobiliensuche/sel.do?sroot=wohnung-mieten&marketingtype=2&parentcat=1&pageoffset=1&listsize=25&objecttype=1&locationname=Berlin&acid=&actype=&district=7605&district=7876&district=7879&district=7889&district=7899&district=7930&ajaxIsRadiusActive=false&sortby=19&suchart=1&radius=0&pcatmtypes=1_2&pCatMTypeStoragefield=1_2&parentcat=1&marketingtype=2&fromprice=&toprice=9999&fromarea=99&toarea=&fromplotarea=&toplotarea=&fromrooms=&torooms=&objectcat=-1&wbs=0&fromyear=&toyear=&fulltext=&absenden=Ergebnisse+anzeigen"
  },
  "immowelt": {
      "url": "https://www.immowelt.de/liste/berlin-alt-treptow/wohnungen/mieten?geoid=10811002000022%2C10811002000203%2C10811011000300%2C10811008000313%2C10811003000320%2C10811001000353&prima=510&eqid=-205&sort=createdate%2Bdesc"
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

### Immoscout, Immonet & Immowelt

Create your custom search queries. If you're looking for specific districts
choose the corresponding filter options. Then just copy and paste the whole
URL.

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
