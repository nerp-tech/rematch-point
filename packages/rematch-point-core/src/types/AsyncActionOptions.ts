import { HttpMethod } from './HttpMethod';
import { OptimisticQuery } from './OptimisticQuery';

export interface AsyncActionOptions {
    collection: string,
    url: string,
    key?: string,
    body?: any,
    json?: boolean,
    method?: HttpMethod,
    relatedQueries?: string[],
    optimisticQuery?: OptimisticQuery,
    getResponseData: Function,
};
