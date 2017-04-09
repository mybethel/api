# Bethel API

A de-coupling of the API powering the Bethel platform.

### Development

Any sensitive variables including credentials and connection strings are
provided at runtime through environment variables. To specify these in your
local development instance, simply override the appropriate key/value pair in
`config/env/local.js`.

### Testing

To ensure that tests are not accidentally run against the Production database,
you must specify an environment variable ahead of the `npm test` command:

```
DB_TEST=mongodb://127.0.0.1:32768/bethel-test npm test
```
