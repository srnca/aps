import React from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode, TextField } from "@fluentui/react";
import { IExecutor, IService } from "./table.types";
import { classNames, filterTextfieldStyles } from "./table.styles";

const WESPER: string = 'WESPER';

export type ExecutorTableProps = {
    data: IService[];
}

interface ExecutorTableState {
  items: IExecutor[];
  columns: IColumn[];
}

export class ExecutorTable extends React.Component<ExecutorTableProps, ExecutorTableState> {
    
  private allItems: IExecutor[] = [];

  constructor(props: ExecutorTableProps) {
    super(props);
    this.allItems = this.generateItems(props.data);
    const columns: IColumn[] = [
      {
        key: 'columnIco',
        name: 'IČO',
        fieldName: 'ico',
        data: 'string',
        minWidth: 70,
        maxWidth: 100,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        onColumnClick: this._onColumnClick
      },
      {
        key: 'columnName',
        name: 'Názov',
        fieldName: 'name',
        data: 'string',
        minWidth: 200,
        maxWidth: 400,
        isResizable: true,
        isSorted: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick
      },
      {
        key: 'columnServices',
        name: 'Služby',
        fieldName: 'services',
        data: 'number',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        isSorted: false,
        onColumnClick: this._onColumnClick
      }
    ];
    this.state = {
      items: this.allItems,
      columns: columns
    };
  }

  private generateItems = (data: IService[]) => {
    const executors = new Map<string, IExecutor>();      
    data.forEach(value => {
      const key = value.ico.length > 0 ? value.ico : WESPER;
      if (executors.has(key)) {
        executors.get(key)!.services++;
      } else {
        executors.set(key, {ico: key, name: key === WESPER ? 'Wesper a.s.' : value.sro, services: 1});
      }
    });
    return Array.from(executors.values());
  }

  private _copyAndSort = (items: IExecutor[], columnKey: string, isSortedDescending?: boolean): IExecutor[] => {
    const key = columnKey as keyof IExecutor;
    return items.slice(0).sort((a: IExecutor, b: IExecutor) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        // this.setState({
        //   announcedMessage: `${currColumn.name} is sorted ${
        //     currColumn.isSortedDescending ? 'descending' : 'ascending'
        //   }`,
        // });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = this._copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      items: newItems,
      columns: newColumns
    });
  }

  private _filterICO = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    if (text != null && text.trim().length > 0) {
      this.setState({items: this.allItems.filter(item => item.ico.toLowerCase().indexOf(text) > -1)});
    } else {
      this.setState({items: this.allItems});
    }
  }

  private _filterName = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    if (text != null && text.trim().length > 0) {
      this.setState({items: this.allItems.filter(item => item.name.toLowerCase().indexOf(text) > -1)});
    } else {
      this.setState({items: this.allItems});
    }
  }

  public render() {
    const { items, columns } = this.state;
    return (
      <div>
        <div className={classNames.controlWrapper}>
          <TextField label="Filtruj podľa IČO:" onChange={this._filterICO} styles={filterTextfieldStyles} />
          <TextField label="Filtruj podľa názvu:" onChange={this._filterName} styles={filterTextfieldStyles} />
          <Label>{`Počet poskytovateľov: ${items.length}`}</Label>
        </div>
        <DetailsList 
          items={items}
          columns={columns}
          compact={true}
          isHeaderVisible={true}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </div>
    );
  }
}