import React from 'react';
import TableGrid from 'react-grid-table';
import data from './data';

class NoDataMessage extends React.Component {
    render() {
        return (
            <div className="info-box">
                <div className="no-data-message">No data found</div>
            </div>
        );
    }
}

export default class App extends React.Component {
    renderName(value){
        return `Name: ${value}`;
    }
  
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