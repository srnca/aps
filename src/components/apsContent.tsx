import React from "react";
import { Label, Pivot, PivotItem } from "@fluentui/react";
import { APSTable } from "./apsTable";
import { ExecutorTable } from "./executorTable";
import { IData } from "./table.types";

export interface APSContentProps {
    data: IData;
}

export const APSContent: React.FC<APSContentProps> = ({data}) => {
    const {data2023, data2024} = data;
    return (
        <>
            <Label styles={{root: {fontSize: '32px'}}}>Služby APS Wesper Prešov</Label>
            <Pivot aria-label="Služby APS Wesper Prešov">
                <PivotItem headerText="Služby (2023)">
                    <APSTable data={data2023}/>    
                </PivotItem>
                <PivotItem headerText="SRO (2023)">
                    <ExecutorTable data={data2023}/>
                </PivotItem>
                <PivotItem headerText="Služby (2024)">
                    <APSTable data={data2024}/>    
                </PivotItem>
                <PivotItem headerText="SRO (2024)">
                    <ExecutorTable data={data2024}/>
                </PivotItem>
            </Pivot>
        </>
    )
}