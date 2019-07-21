import React from 'react';
import TableGrid from 'react-table-grid';
import data from './data';

export default class App extends React.Component {
    render() {
        return <div className="container">
            <TableGrid
              renderChildTitle={false}
              renderChildHeaders={false}
              className="custom-table"
              paginateBy={5}
              data={data}/>
        </div>
    }
}
