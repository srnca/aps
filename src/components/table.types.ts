export interface IData {
    data2023: IService[];
    data2024: IService[];
}

export interface IService {
    date: Date;
    time: string;
    ico: string;
    sro: string;
    mudr: string;
    executor: string;
}

export interface IExecutor {
    ico: string;
    name: string;
    services: number;
}
