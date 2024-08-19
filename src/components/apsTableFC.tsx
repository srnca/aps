import React, { useEffect, useMemo, useState } from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, Label, TextField, Toggle } from "@fluentui/react";
import { useAPSTableStyles } from "./tableFC.styles";
import { IService } from "./table.types";

export type APSTableFCProps = {
    data: IService[];
}

export const APSTableFC: React.FC<APSTableFCProps> = ({data}) => {
    
    const { classNames, compactToggleStyles, filterTextfieldStyles } = useAPSTableStyles();

    const [ isCompactMode, setIsCompactMode] = useState<boolean>(false);
    const [ allItems, setAllItems ] = useState<IService[]>(data);
    const [ items, setItems ] = useState<IService[]>(allItems);

    const _copyAndSort = (items: IService[], columnKey: string, isSortedDescending?: boolean): IService[] => {
        const key = columnKey as keyof IService;
        return items.slice(0).sort((a: IService, b: IService) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }

    const _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
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
        const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        // this.setState({
        //   columns: newColumns,
        //   items: newItems,
        // });
    };

    const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
        if (text != null && text.trim().length > 0) {
            setItems(allItems.filter(item => item.executor.toLowerCase().indexOf(text) > -1));    
        } else {
            setItems(allItems);
        }
    };

    const columns = useMemo<IColumn[]>(() => {
        return [
            {
              key: 'columnDate',
              name: 'Dátum',
              fieldName: 'date',
              data: 'Date',
              minWidth: 70,
              maxWidth: 90,
              isResizable: true,
              onColumnClick: _onColumnClick,
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
              onColumnClick: _onColumnClick
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
              onColumnClick: _onColumnClick
            }
          ];
    }, []);

    return (
        <div>
            <div className={classNames.controlWrapper}>
                <TextField label="Filtruj podľa názvu:" onChange={_onChangeText} styles={filterTextfieldStyles} />
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
};