# FindMeAFlat

Crawls popular German real estate portals for new listings. Notifications are
sent via [Telegram](https://telegram.org).

## Prerequisites

* Docker / Node 8

## Usage

First, create a configuration file as described below.

Then you can either run the application inside a Docker Container via

```
make
```

Or just install the dependencies with `npm install`, then start the application
with `npm start`.

## Configuration

Before running the application for the first time, the configuration file needs
to be created and modified to meet your needs:

```
cp conf/config.json.example conf/config.json
```

### 1. Create a Telegram Bot

```json
"telegram": {
  "chatId": "yourChatId",
  "token": "yourToken"
}
```

For the Telegram notification to work you need to create a [Telegram
bot](https://core.telegram.org/bots). Follow the [instructions
here](https://core.telegram.org/bots#botfather) to create one and to get the
`token` for the bot. Since bots are not allowed to contact users, you need to
send a message first. Afterwards, retrieve your `chatId` by running `$ curl -X
GET https://api.telegram.org/botYOUR_API_TOKEN/getUpdates`.

### 2. Configure the providers

Configure the providers like described below. To disable a provider just remove
its entry from the configuration or set it to `false`.

#### Ebay Kleinanzeigen, Immoscout, Immowelt and Immonet

```json
"kleinanzeigen": {
    "url": "https://www.ebay-kleinanzeigen.de/..."
}
"immoscout": {
  "url": "https://www.immobilienscout24.de/..."
},
"immowelt": {
  "url": "https://www.immowelt.de/..."
},
"immonet": {
  "url": "http://www.immonet.de/..."
},
```

Go to the respective provider page and create your custom search queries by
using the provided filter options. Then just copy and paste the whole URL of
the resulting listings page.

**IMPORTANT:** Make sure to always sort by newest listings!

#### WgGesucht

```json
"wggesucht": {
  "city": "Berlin",
  "cityKey": 8,
  "minSize": 99,
  "maxRent": 9999,
}
```

Modify the four attributes. The `cityKey` can be found in the URL of any
listings page for the respective city.

#### Custom provider

You can easily add a new provider by adding a new file under `lib/sources` or
just open an issue :)

### 3. Add Filters (optional)

#### Districts

```json
"wantedDistricts": [
  "Friedrichshain",
  "Kreuzberg",
  "Neukölln"
]
```

Since `ebay Kleinanzeigen` and `WgGesucht` offer a very limited filtering of
districts, the results of those providers can be filtered via this setting.

#### Blacklist

```json
"blacklist": [
  "swap",
  "tausch",
  "wg"
]
```

Listings which contain at least on of the given terms (ignoring case, only
whole words) are removed.
