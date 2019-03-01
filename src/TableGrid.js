import * as React from 'react';
import objectAssign from 'object-assign';
import dotProp from 'dot-prop-immutable';

import CollapseButton from './components/CollapseButton';

export default class TableGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: this.props.data,
        }
        
        this.renderBody = this.renderBody.bind(this);
    }
    
    getColumns(data) {
        let columns = {};
        
        data.forEach(row => {
            objectAssign(columns, row.data);
        });
        
        columns = Object.keys(columns);
        
        return columns;
    }
    
    hasKids(data) {
        let result = false;
        
        if (data && data.kids) {
            Object.keys(data.kids).some(key => {
                const kids = data.kids[key];
                return result = !!(kids && Array.isArray(kids.records) && kids.records.length);
            });
        }
        
        return result;
    }
    
    collapseRow(path, idx) {
      if (this.props.collapseRow) {
        this.props.collapseRow(path, idx);
      } else {
        this.setState(dotProp.toggle(this.state, `data.${idx}.collapsed`));
      }
    }
    
    renderBody(data, path, colLength, columns) {
      let rows = [];
      data.forEach((row, rowIdx) => {
        const hasKids = this.hasKids(row);
        
        rows.push(
          <tr key={`row-column-${rowIdx}`}>
              {columns.map((column, idx) => {
                  const theFistWithChildren = hasKids && idx === 0;
                  const dataClassName = idx === 0 ? 'first-column-data' : '';
                  
                  return <td key={`cell-column-${rowIdx}-${idx}`}>
                      {/* collapse button */}
                      {theFistWithChildren &&
                          <div className="collapse-button-wrap"> 
                              <CollapseButton collapsed={row.collapsed}
                                  onClick={() => {
                                      this.collapseRow(path, rowIdx);
                                  }}
                              />
                          </div>
                      }
                      <div className={dataClassName}>
                          {row.data[column]}
                      </div>
                  </td>
              })}
          </tr>
        );
                
        if (hasKids && row.collapsed) {
          Object.keys(row.kids).forEach((kid, kidIdx) => {
              const nextPath = `${path}${rowIdx}.kids.${kid}.records.`;
              
              rows.push(
                  <tr key={`table-column-${kidIdx}`}>
                      <td colSpan={colLength} className="child-table-td">
                          <div className='title'>
                              {kid}
                          </div>
                          <TableGrid 
                              data={row.kids[kid].records}
                              path={nextPath}
                              collapseRow={this.props.collapseRow}/>
                      </td>
                  </tr>
              )
          })
        }
      })
      
      return (
        <tbody>
          {rows}
        </tbody>
      )
    }
    
    render() {
        const { data } = this.state;
        const columns = this.getColumns(data);
        const colLength = columns.length;
        const path = this.props.path ? this.props.path : '';
        
        return (
            <table className="custom-table">
              <thead>
                  <tr>
                      {columns.map((column, idx) => {
                          return <th key={`header-column-${idx}`}>{column}</th>
                      })}
                  </tr>
              </thead>
              {this.renderBody(data, path, colLength, columns)}                    
          </table>
        )
    };
};