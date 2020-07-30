# FindMeAFlat

Crawls popular German real estate portals for new listings. Notifications are sent via [Telegram](https://telegram.org).

**Note**: This project is not in active use anymore. However, the crawled pages continue to change regularly. So please open an issue or create a PR if a page does not get crawled correctly anymore.

## Usage

First create a configuration file as described below.

### Docker

You can run the application as a Docker container with the following command:

```bash
docker run -it --rm --name findmeaflat --init \
           -v $(pwd)/config.json:/app/conf/config.json \
           -v findmeaflat_db:/app/db \
           docker.pkg.github.com/adriankumpf/findmeaflat/findmeaflat:latest
```

### Manual

To run the bot directly, clone the repository, install the dependencies and start the application:

```
git clone https://github.com/adriankumpf/findmeaflat.git
npm ci
npm start
```

## Configuration

Create a configuration file `config.json` with the following contents:

```json
{
  "providers": {
    "immoscout": {
      "url": "https://www.immobilienscout24.de/Suche/..."
    },
    "immonet": {
      "url": "http://www.immonet.de/immobiliensuche/..."
    },
    "immowelt": {
      "url": "https://www.immowelt.de/liste/..."
    },
    "kleinanzeigen": {
      "url": "https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/berlin/..."
    },
    "wggesucht": {
      "city": "Berlin",
      "cityKey": 8,
      "maxRent": 9999,
      "minSize": 99
    }
  },
  "telegram": {
    "chatId": "yourChatId",
    "token": "yourToken"
  },
  "wantedDistricts": ["Wedding", "Friedrichshain"],
  "blacklist": ["swap", "tausch", "wg"],
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
}
```

Then visit the pages of the real estate portals and put together your search. You will also need a Telegram Bot. The individual steps are explained in more detail below.

### 1. Create a Telegram Bot

```json
"telegram": {
  "chatId": "yourChatId",
  "token": "yourToken"
}
```

For the Telegram notification to work you need to create a [Telegram bot](https://core.telegram.org/bots). Follow the [instructions here](https://core.telegram.org/bots#botfather) to create one and to get the `token` for the bot. Since bots are not allowed to contact users, you need to send a message first. Afterwards, retrieve your `chatId` by running `$ curl -X GET https://api.telegram.org/botYOUR_API_TOKEN/getUpdates`.

### 2. Configure the providers

Configure the providers like described below. To disable a provider just remove its entry from the configuration or set it to `false`.

#### Ebay Kleinanzeigen, Immoscout, Immowelt and Immonet

```json
"providers": {
  "kleinanzeigen": {
      "url": "https://www.ebay-kleinanzeigen.de/..."
  },
  "immoscout": {
    "url": "https://www.immobilienscout24.de/..."
  },
  "immowelt": {
    "url": "https://www.immowelt.de/..."
  },
  "immonet": {
    "url": "http://www.immonet.de/..."
  }
}
```

Go to the respective provider page and create your custom search queries by using the provided filter options. Then just copy and paste the whole URL of the resulting listings page.

**IMPORTANT:** Make sure to always sort by newest listings!

#### WgGesucht

```json
"providers": {
  "wggesucht": {
    "city": "Berlin",
    "cityKey": 8,
    "minSize": 99,
    "maxRent": 9999
  }
}
```

Modify the four attributes. The `cityKey` can be found in the URL of any listings page for the respective city.

#### Custom provider

You can easily add a new provider by adding a new file under `lib/sources` or just open an issue :)

### 3. Add Filters (optional)

#### Districts

```json
"wantedDistricts": [
  "Friedrichshain",
  "Kreuzberg",
  "Neukölln"
]
```

Since `ebay Kleinanzeigen` and `WgGesucht` offer a very limited filtering of districts, the results of those providers can be filtered via this setting.

#### Blacklist

```json
"blacklist": [
  "swap",
  "tausch",
  "wg"
]
```

Listings which contain at least on of the given terms (ignoring case, only whole words) are removed.
