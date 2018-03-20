import * as request from 'request-promise-native';
import reducers from '../async-rematch/reducers';
import { queryBuilder } from '../async-rematch/actions';

type Todo = {
    id: string,
    type: string,
};

const TODOS = 'http://localhost:8999/todos';
const qb = queryBuilder(request);

export const todos = {
    state: {
        error: null,
        items: {},
        queries: {},
    },
    reducers: {
        ...reducers,
    },
    effects: {
        getAll() {
            return qb(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}`,
                optimisticQuery: (state) => {
                    return state.items;
                },
                getResponseData(response) {
                    return JSON.parse(response).items;
                }
            });
        },
        getAllByType(type: String) {
            return qb(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}?type=${type}`,
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.type === type;
                    });
                },
                getResponseData(response) {
                    return JSON.parse(response).items;
                },
            });
        },
        getItem(uuid: String) {
            return qb(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}/${uuid}`,
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.uuid === uuid;
                    });
                },
                getResponseData(response) {
                    return JSON.parse(response);
                },
            });
        },
        deleteItem(uuid: String) {
            return qb(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}/${uuid}`,
                method: 'DELETE',
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.uuid !== uuid;
                    });
                },
                getResponseData(response) {
                    return {
                        uuid,
                    };
                },
            });
        },
    },
};