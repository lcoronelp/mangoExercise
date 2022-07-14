# Mango Exercise

Last updated: 14/07/2022

## Building and running

### Install dependencies:

```sh
yarn install
```

### Run in development mode:

```sh
make dev
```

### Run all tests:

```sh
make test
```

### To create a production build TODO:

```sh
yarn run build-prod
```

## Implementation documentation

The component `<Range />` have one configurable attribute called `initialData` that is a React object with these properties:

| Property           | Required | Type       | Default Value | Description                                                                                       |
|--------------------|----------|------------|---------------|---------------------------------------------------------------------------------------------------|
| `rangeItems`       | `true`   | `number[]` | `null`        | The array with the items to show in the range, can be in order or not (the component reorder it)  |
| `decimalPositions` | `false`  | `int`      | `2`           | Quantity of maximum decimals to show                                                              |
| `currency`         | `false`  | `string`   | `"€"`         | Currency to show                                                                                  |
| `currencyOnLeft`   | `false`  | `boolean`  | `false`       | Define if currency is on left (true) or right (false), also modifies the text alignment of inputs |
| `locale`           | `false`  | `string`   | `"en"`        | (Not implemented yet) Define the locale of inputs                                                 |

Notes:
- The component have a small approach to satisfy the AA WCAG
- The component respect the user preference of color theme
- At the lateral inputs, probably we need do more work with the carets (specially when the introduced data isn't valid)
- The solution of solve cross selection maybe need to change to block (this is business decision)
- When the user introduce invalid data in the inputs, probably we can show the error somehow, for example a toast or a message below the input
