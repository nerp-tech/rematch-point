export type Query = {
    query: string,
    queryState: Symbol,
    normalized: string | string[],
    optimisticQuery: Function,
};

export type Items = {
    normalized: string[],
    data: any,
};

export type Item = {
    normalized: string,
    data: any,
};
