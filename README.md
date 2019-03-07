# react-table-grid

> external library

[![NPM](https://img.shields.io/npm/v/react-table-grid.svg)](https://www.npmjs.com/package/react-table-grid) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-table-grid
```

## Usage

```jsx
import React, { Component } from 'react'

import TableGrid from 'react-table-grid'

const mockData = [
  { data: { foo: 'bar' } },
];

class Example extends Component {
  render () {
    return (
      <TableGrid
            data={mockData}
            renderColumns={{
                index: {
                   value: (value, idx, row) => { return idx + 1 },
                   name: '#',
                },
                foo: {
                   value: null, //if it's null then value from data will be taken
                   name: 'Value',
                },                
            }}
            renderChildTitle={false}
            renderChildHeaders={false}            
            paginateBy={15}
          />
    )
  }
}
```
## Props

Common props you may want to specify include:

* `data` - data Array
* `className` - apply a className to the control
* `renderColumns` - an object with render methods for every column; columns will be rendered according to order of keys
* `renderChildTitle` - to render a title for child tables
* `renderChildHeaders` - to render column headers for child tables
* `collapseRow` - subscribe to collapse events

** pagination props according to https://github.com/AdeleD/react-paginate#readme

## License

MIT © [Mikhe](https://github.com/Mikhe)
