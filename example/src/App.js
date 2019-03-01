import React from 'react';
import TableGrid from 'react-grid-table';
import data from './data';

export default class App extends React.Component {
    render() {
        return <div className="container">
            <TableGrid
              paginateBy={5}
              data={data}/>
        </div>
    }
}