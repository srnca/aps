import React from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, TextField } from "@fluentui/react";
import { IService } from "./table.types";
import { classNames, filterTextfieldStyles } from "./table.styles";

export type APSTableProps = {
    data: IService[];
}

interface APSTableState {
  items: IService[];
  columns: IColumn[];
}

export class APSTable extends React.Component<APSTableProps, APSTableState> {

  private allItems: IService[] = [];

  constructor(props: APSTableProps) {
    super(props);
    this.allItems = props.data;
    const columns = [
      {
        key: 'columnDate',
        name: 'Dátum',
        fieldName: 'date',
        data: 'Date',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        onRender: (item: IService) => {
          return <span>{item.date.toDateString()}</span>;
        }
      },
      {
        key: 'columnTime',
        name: 'Čas',
        fieldName: 'time',
        data: 'string',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick
      },
      {
        key: 'columnExecutor',
        name: 'Názov',
        fieldName: 'executor',
        data: 'string',
        minWidth: 250,
        maxWidth: 500,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Zoradené od A po Z',
        sortDescendingAriaLabel: 'Zoradené od Z po A',
        onColumnClick: this._onColumnClick
      }
    ];
    this.state = {
      items: this.allItems,
      columns: columns
    };
  }

  private _copyAndSort = (items: IService[], columnKey: string, isSortedDescending?: boolean): IService[] => {
    const key = columnKey as keyof IService;
    return items.slice(0).sort((a: IService, b: IService) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
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

  private _filterExecutor = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    if (text != null && text.trim().length > 0) {
      this.setState({items: this.allItems.filter(item => item.executor.toLowerCase().indexOf(text) > -1)});
    } else {
      this.setState({items: this.allItems});
    }
  }

  public render() {
    const { items, columns } = this.state;
    return (
      <div>
        <div className={classNames.controlWrapper}>
          <TextField label="Filtruj podľa názvu:" onChange={this._filterExecutor} styles={filterTextfieldStyles} />
        </div>
        <DetailsList 
          items={items}
          columns={columns}
          compact={true}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
        />
      </div>
    );
  }
}