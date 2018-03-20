import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { loader } from '../async-rematch/hocs';

const TodoList = ({ isDeleting, items, handleDelete }) => (
    <ul>
        <li key={items[0].uuid}>
            {items[0].text}
            {' '}
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
    <span>{JSON.parse(error).error} <button onClick={handleReload}>Reload</button></span>
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
    enhanceNotFound,
    enhanceError(
        connect(undefined, ({ todos: { getItem } }) => ({
            handleReload: () => getItem('4'),
        }))(Error)
    ),
    connect(undefined, ({ todos: { deleteItem } }) => ({
        handleDelete: (id) => () => deleteItem(id),
    }))
)(TodoList);
