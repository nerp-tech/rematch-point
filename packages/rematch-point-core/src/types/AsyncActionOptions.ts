import { HttpMethod } from './HttpMethod';

export interface AsyncActionOptions {
    collection: string,
    url: string,
    key?: string,
    body?: any,
    json?: boolean,
    method?: HttpMethod,
    relatedQueries?: string[],
    optimisticQuery?: Function,
    getResponseData: Function,
};
