import React from 'react';
import TableGrid from 'react-grid-table';
import data from './data';

export default class App extends React.Component {
    renderName(value){
        return `Name: ${value}`;
    }
  
    render() {
        return <div className="container">
            <TableGrid
              renderColumns={{
                "Name": this.renderName,
              }}
              paginateBy={5}
              data={data}/>
        </div>
    }
}