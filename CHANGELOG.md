# Changelog

## [Unreleased]

## [1.2.0] - 2021-03-26

### Enhancements

- Add max radius filter setting (useful for Immonet) ([#25](https://github.com/adriankumpf/findmeaflat/pull/25) by [creichel](https://github.com/creichel))
- Publish docker image to GitHub container registry
  - ⚠️ If you're using the Docker image, change the image from `docker.pkg.github.com/adriankumpf/findmeaflat/findmeaflat:latest` to `ghcr.io/adriankumpf/findmeaflat:latest`
  - The latest development version is available under the `edge` tag

### Bug Fixes

- Fix crawler issues with Immowelt, Kleinanzeigen and Immonet ([#25](https://github.com/adriankumpf/findmeaflat/pull/25) by [creichel](https://github.com/creichel))
- Add number of rooms, property size to Telegram messages ([#25](https://github.com/adriankumpf/findmeaflat/pull/25) by [creichel](https://github.com/creichel))

## [1.1.0] - 2020-07-30

### Enhancements

- Tweak timeouts and delays between requests
- Improve image build times
- Retry to send message to Telegram if request was rate limited
- Reduce scrape interval to 5 minutes
- Perform a full page crawl at every 10th round

### Bug Fixes

- Fix example configuration
- Update scraper rules
- Persist listing ID right after sending the notification to avoid duplicate messages

## [1.0.1] - 2019-01-09

### Fixed

- Add default parameter to `utils.isOneOf`
- Fix pagination of immoscout
- Increase pagination limit

## [1.0.0] - 2018-12-08

[unreleased]: https://github.com/adriankumpf/findmeaflat/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/adriankumpf/findmeaflat/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/adriankumpf/findmeaflat/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/adriankumpf/findmeaflat/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/adriankumpf/findmeaflat/compare/v0.0.0...v1.0.0
