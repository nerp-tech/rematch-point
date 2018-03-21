import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { loader } from '../async-rematch/hocs';

const TodoList = ({ isDeleting, items, handleDelete, handleUpdate }) => (
    <ul>
        <li key={items[0].uuid}>
            {items[0].text}
            {' '}

            <button onClick={handleUpdate(items[0].uuid)}>Change</button>
            {
                isDeleting ?
                    <span>Deleting...</span> :
                    <button onClick={handleDelete(items[0].uuid)}>Delete</button>
            }
        </li>
    </ul>
);

const Loading = () => (
    <span>Loading...</span>
);

const Error = ({ error, handleReload }) => (
    <span>{error.error} <button onClick={handleReload}>Reload</button></span>
);

const NotFound = () => (
    <span>Not found</span>
);

const enhanceLoading = (Component) => branch(
    props => props.isLoading,
    renderComponent(Loading)
);

const enhanceError = (Error) => branch(
    props => props.error,
    renderComponent(Error)
);

const enhanceNotFound = branch(
    props => !props.isLoading && props.items.length === 0,
    renderComponent(NotFound) 
);

export default compose(
    loader(() => dispatch.todos.getItem, ['4']),
    enhanceLoading(Loading),
    enhanceError(
        connect(undefined, ({ todos: { getItem } }) => ({
            handleReload: () => getItem('4'),
        }))(Error)
    ),
    enhanceNotFound,
    connect(undefined, ({ todos: { deleteItem, updateItem } }) => ({
        handleDelete: (uuid) => () => deleteItem(uuid),
        handleUpdate: (uuid) => () => updateItem({ uuid, text: 'meeewow!' }),
    }))
)(TodoList);
