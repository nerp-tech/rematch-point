export interface Query {
    normalized: string[],
    queryState: string,
    queryString: string,
    optimisticQuery?: Function,
};