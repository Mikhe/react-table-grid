import * as React from 'react';
import ReactPaginate from 'react-paginate';
import dotProp from 'dot-prop-immutable';
import objectAssign from 'object-assign';

import CollapseButton from './components/CollapseButton';

export default class TableGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: this.props.data,
          paginatedData: [],
          currentPage: props.initialPage ? props.initialPage - 1 : 0,
          renderChildTitle: typeof this.props.renderChildTitle === "boolean" ? this.props.renderChildTitle : true,
          renderChildHeaders: typeof this.props.renderChildHeaders === "boolean" ? this.props.renderChildTitle : true,
        }
        
        this.renderBody = this.renderBody.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.collapseRow = this.collapseRow.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getPaginatedData = this.getPaginatedData.bind(this);
        this.renderColumn = this.renderColumn.bind(this);
    }
    
    componentWillMount() {
      const { paginateBy, paginationSide, forcePage } = this.props;
      
      if (paginateBy) {
        this.setState({
          currentPage: forcePage || 0,
          paginatedData: this.getPaginatedData(this.state.data, paginateBy, paginationSide, forcePage || 0),
        });
      }
    }
    
    getColumns(data) {
      const { renderColumns } = this.props;
      
      if (renderColumns) {
        return Object.keys(renderColumns);
      }
      
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
        const state = this.state;
        
        if (this.props.paginateBy) {
          this.setState(dotProp.toggle(state, `paginatedData.${idx}.collapsed`));
        } else {
          this.setState(dotProp.toggle(state, `data.${idx}.collapsed`));
        }
      }
    }
    
    getPaginatedData(data, paginateBy, paginationSide, page) {
      const { currentPage } = this.state;
      page = page >= 0 ? page : currentPage;
      
      if (paginationSide === 'backend') {
          return data;
      }
      
      return data.slice(page * paginateBy, (page + 1) * paginateBy);
    }
    
    handlePageChange(page, paginateBy, paginationSide) {
      const chosenPage = page.selected || 0;
      
      if (this.props.onPageChange) {
          this.props.onPageChange(chosenPage + 1);
      }

      this.setState({
        currentPage: chosenPage,
        paginatedData: this.getPaginatedData(this.state.data, paginateBy, paginationSide, chosenPage),
      });
    }
    
    renderPagination(paginateBy, paginationSide, itemsCount, initialPage, forcePage) {
        const {currentPage, data} = this.state;
        let pageCount = 0;

        if (paginationSide && paginationSide === 'backend') {
            pageCount = itemsCount % paginateBy === 0
                ? itemsCount / paginateBy : parseInt(itemsCount / paginateBy) + 1;
        } else {
            pageCount = data.length % paginateBy === 0
                ? data.length / paginateBy : parseInt(data.length / paginateBy) + 1;
        }

        if (pageCount > 1) {
          return (
            <ReactPaginate previousLabel="prev"
             nextLabel="next"
             breakLabel="..."
             initialPage={initialPage}
             forcePage={paginationSide === 'backend' ? forcePage : currentPage}
             pageCount={pageCount}
             marginPagesDisplayed={2}
             pageRangeDisplayed={5}
             disableInitialCallback={paginationSide === 'backend'}
             onPageChange={page => this.handlePageChange(page, paginateBy, paginationSide)}
             containerClassName="pagination"
             subContainerClassName="pages pagination"
             activeClassName="active"/>
           );
        }
        return '';
    }
    
    renderColumn(name, value, idx, id) {
      const { renderColumns } = this.props;
      
      if (renderColumns && renderColumns[name] && renderColumns[name].value && renderColumns[name].value.call) {
        return renderColumns[name].value(value, idx, id);
      }
      
      return value;
    }
    
    renderBody(data, path, colLength, columns) {
      const { renderColumns, collapseRow, } = this.props;
      const { renderChildTitle, renderChildHeaders, } = this.state;
      let rows = [];
      
      data.forEach((row, rowIdx) => {
        const hasKids = this.hasKids(row);
        
        rows.push(
          <tr key={`row-column-${rowIdx}`}>
              {columns.map((column, idx) => {
                  const theFistWithChildren = hasKids && idx === 0;
                  const dataClassName = idx === 0 ? 'first-column-data' : '';
                  const className = `${renderColumns && renderColumns[column] && renderColumns[column].className || ''} ${column}` ;
                  
                  return <td key={`cell-column-${rowIdx}-${idx}`} className={className}>
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
                          {this.renderColumn(column, row.data[column], rowIdx, row.data.id)}
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
                          {renderChildTitle && <div className='title'>
                              {kid}
                          </div>}
                          <TableGrid 
                            isChild={true}  
                            data={row.kids[kid].records}
                            path={nextPath}
                            renderChildTitle={renderChildTitle}
                            renderChildHeaders={renderChildHeaders}
                            renderColumns={renderColumns}
                            collapseRow={collapseRow}/>
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
        const { data, renderChildHeaders } = this.state;
        const { paginateBy, itemsCount, page, forcePage, renderColumns, isChild, className, } = this.props;
        
        let paginatedData;

        if (paginateBy) {
            paginatedData = this.state.paginatedData;
        } else {
            paginatedData = data;
        }
        
        const columns = this.getColumns(paginatedData);
        const colLength = columns.length;
        const path = this.props.path ? this.props.path : '';
        const paginationSide = this.props.paginationSide ? this.props.paginationSide : 'client';
        
        return (
          <div className={`${className ? className : 'custom-table'}-wrap`}>
            <table className={`${className ? className : 'custom-table'}`}>
                {!(isChild && !renderChildHeaders) &&
                  <thead>
                      <tr>
                          {columns.map((column, idx) => {
                            const name = renderColumns && renderColumns[column].name || column;
                            return <th key={`header-column-${idx}`}>{name}</th>
                          })}
                      </tr>
                  </thead>
                }
                {this.renderBody(paginatedData, path, colLength, columns)}                    
            </table>
            {paginateBy &&
                <div className="text-center">
                    {this.renderPagination(paginateBy, paginationSide, itemsCount, page - 1, forcePage - 1)}
                </div>}
          </div>
        )
    };
};