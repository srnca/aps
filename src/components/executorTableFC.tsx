import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, Label, SelectionMode, TextField } from "@fluentui/react";
import { useAPSTableStyles } from "./tableFC.styles";
import { IExecutor, IService } from "./table.types";

const WESPER: string = 'WESPER';

export type ExecutorTableFCProps = {
    data: IService[];
}

export const ExecutorTableFC: React.FC<ExecutorTableFCProps> = ({data}) => {
    
    const { classNames, filterTextfieldStyles } = useAPSTableStyles();
    const [ items, setItems ] = useState<IExecutor[]>([]);
    const [ columns, setColumns ] = useState<IColumn[]>([]);

    const allItems = useMemo<IExecutor[]>(() => {
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
    } ,[data]);

    useEffect(() => {
      console.debug('setItems');
      setItems(allItems);
    }, [allItems]);

    const _copyAndSort = (items: IExecutor[], columnKey: string, isSortedDescending?: boolean): IExecutor[] => {
        const key = columnKey as keyof IExecutor;
        return items.slice(0).sort((a: IExecutor, b: IExecutor) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }

    const _onColumnClick = useCallback((ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
        console.debug('_onColumnClick');
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
        setItems(newItems);
        setColumns(newColumns);
    }, [columns]);

    const _filterICO = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
        if (text != null && text.trim().length > 0) {
            setItems(allItems.filter(item => item.ico.toLowerCase().indexOf(text) > -1));
        } else {
            setItems(allItems);
        }
    };

    const _filterName = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
      if (text != null && text.trim().length > 0) {
          setItems(allItems.filter(item => item.name.toLowerCase().indexOf(text) > -1));
      } else {
          setItems(allItems);
      }
    };

    setColumns([
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
          onColumnClick: _onColumnClick
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
          onColumnClick: _onColumnClick
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
          onColumnClick: _onColumnClick
        }
      ]);

    return (
        <div>
            <div className={classNames.controlWrapper}>
                <TextField label="Filtruj podľa IČO:" onChange={_filterICO} styles={filterTextfieldStyles} />
                <TextField label="Filtruj podľa mena:" onChange={_filterName} styles={filterTextfieldStyles} />
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
};