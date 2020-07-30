# Changelog

## [Unreleased]

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

[unreleased]: https://github.com/adriankumpf/findmeaflat/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/adriankumpf/findmeaflat/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/adriankumpf/findmeaflat/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/adriankumpf/findmeaflat/compare/v0.0.0...v1.0.0
