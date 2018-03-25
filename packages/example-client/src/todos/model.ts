import * as request from 'request-promise-native';
import { reducers, asyncAction, setRequestLibrary } from 'rematch-point';
import { querify } from 'rematch-point-queries';

type Todo = {
    uuid: string,
    text: string,
    type: string,
};

const TODOS = 'http://localhost:8999/todos';

setRequestLibrary(request);

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
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}`,
                optimisticQuery: (state) => {
                    return Object.values(state.items);
                },
                getResponseData(response) {
                    return response.items;
                }
            });
        },
        getAllByType(type: String) {
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}?type=${type}`,
                relatedQueries: [
                    querify('todos', TODOS),
                ],
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.type === type;
                    });
                },
                getResponseData(response) {
                    return response.items;
                },
            });
        },
        getItem(uuid: String) {
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}/${uuid}`,
                relatedQueries: [
                    querify('todos', TODOS),
                ],
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.uuid === uuid;
                    });
                },
                getResponseData(response) {
                    return response;
                },
            });
        },
        deleteItem(uuid: String) {
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}/${uuid}`,
                method: 'DELETE',
                getResponseData() {
                    return {
                        uuid,
                    };
                },
            });
        },
        createItem({ text, type }) {
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}`,
                method: 'POST',
                body: {
                    text,
                },
                relatedQueries: [
                    querify('todos', `${TODOS}?type=${type}`),
                ],
                optimisticQuery: (_, current) => {
                    return [...current, {
                        uuid: 'fake-uuid',
                        text,
                    }];
                },
                getResponseData(response) {
                    return response;
                }
            });
        },
        updateItem({ uuid, text }) {
            return asyncAction(this, {
                collection: 'todos',
                key: 'uuid',
                url: `${TODOS}/${uuid}`,
                method: 'PUT',
                body: {
                    text,
                },
                optimisticQuery: (state) => {
                    return Object.values(state.items).filter((item: Todo) => {
                        return item.uuid === uuid;
                    }).map((item: Todo) => {
                        return {
                            ...item,
                            text,
                        };
                    });
                },
                getResponseData(response) {
                    return response;
                }
            });
        },
    },
};
