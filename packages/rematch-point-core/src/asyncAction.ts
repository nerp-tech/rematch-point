import { normalize, querify } from '@rematch-point/queries';
import { QueryString } from '@rematch-point/queries/dist/types/QueryString';

import { ERROR, LOADED } from './constants';
import createRequestOptions from './createRequestOptions';
import getBeforeQueryState from './getBeforeQueryState';
import { AsyncActionOptions } from './types/AsyncActionOptions';
import { HttpMethod } from './types/HttpMethod';
import { OptimisticQuery } from './types/OptimisticQuery';
import { RematchPoint } from './types/RematchPoint';
import { RequestLibrary } from './types/RequestLibrary';

let request: RequestLibrary = null;

export const setRequestLibrary = (r: RequestLibrary) => {
    request = r;
};

const before = (context: RematchPoint, { queryString, method, optimisticQuery }: {
    queryString: string,
    method: HttpMethod,
    optimisticQuery?: OptimisticQuery,
}): void => {
    context.updateQuery({
        optimisticQuery,
        queryState: getBeforeQueryState(method),
        queryString,
    });
};

const after = (context: RematchPoint, {
    data,
    method,
    normalized,
    queryString,
    relatedQueries,
}: {
    data: any,
    method: HttpMethod,
    normalized: string[],
    queryString: string,
    relatedQueries?: string[],
}) => {
    switch (method) {
        case 'DELETE': {
            context.removeItems({
                data,
                normalized,
            });
            context.updateQuery({
                queryState: LOADED,
                queryString,
            });
            break;
        }
        case 'POST': {
            context.addItems({
                data,
                normalized,
                queries: [queryString, ...(relatedQueries || [])],
            });
            context.updateQuery({
                queryState: LOADED,
                queryString,
            });
            break;
        }
        case 'PUT': {
            context.updateItems({
                data,
                normalized,
            });
            context.updateQuery({
                normalized,
                queryState: LOADED,
                queryString,
            });
            break;
        }
        case 'GET':
        default: {
            context.setItems({
                data,
                normalized,
            });
            context.updateQuery({
                normalized,
                queryState: LOADED,
                queryString,
            });
        }
    }
};

export default (context: RematchPoint, options: AsyncActionOptions): QueryString => {
    const {
        body,
        collection,
        getResponseData,
        json = true,
        key = 'id',
        method = HttpMethod.Get,
        optimisticQuery,
        relatedQueries,
        url,
    } = options;

    // XXX check that context has an updateQuery function

    const queryString = querify(collection, url);

    before(context, {
        method,
        optimisticQuery,
        queryString,
    });

    const requestOptions = createRequestOptions({
        body,
        json,
        method,
        // TODO allow custom options
    });

    request(url, requestOptions).then((raw: any) => {
        let data = getResponseData(raw);
        let normalized = normalize(data, key);

        if (!(data instanceof Array)) {
            data = [data];
        }

        if (!(normalized instanceof Array)) {
            normalized = [normalized];
        }

        after(context, { method, queryString, normalized, data, relatedQueries });

        return {
            data,
            queryString,
        };
    }).catch((err: Error) => {
        context.error({
            error: err,
            queryState: ERROR,
            queryString,
        });

        return {
            error: err,
        };
    });

    return queryString;
};
