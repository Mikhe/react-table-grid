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
    
    render() {
        const { data } = this.state;
        const columns = this.getColumns(data);
        const colLength = columns.length;
        const path = this.props.path ? this.props.path : '';
        
        return data.length ?
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, idx) => {
                            return <th key={`header-column-${idx}`}>{column}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => {
                        const hasKids = this.hasKids(row);
                        
                        return (
                            <React.Fragment key={`parent-row-${rowIdx}`}>
                                <tr>
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
                                
                                {hasKids && row.collapsed &&
                                    Object.keys(row.kids).map((kid, kidIdx) => {
                                        const nextPath = `${path}${rowIdx}.kids.${kid}.records.`;
                                        
                                        return (
                                            <tr key={`table-column-${kid}-${kidIdx}`}>
                                                <td colSpan={colLength} className="child-table-td">
                                                    <div className='title'>
                                                        {kid}
                                                    </div>
                                                    <TableGrid 
                                                        data={row.kids[kid].records}
                                                        path={nextPath}
                                                        removeRow={this.props.removeRow}
                                                        collapseRow={this.props.collapseRow}/>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        : ''
    };
};