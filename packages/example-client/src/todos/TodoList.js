import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { loader } from 'rematch-point-react';

const TodoList = ({ items, handleCreate }) => (
    <Fragment>
        <ul>
            {items.map((item, i) => <li key={i}>{item.text}</li>)}
        </ul>
        <button onClick={handleCreate}>Create a new item</button>
    </Fragment>
);

const Loading = () => (
    <span>Loading...</span>
);

const Error = ({ error }) => (
    <span>Something bad happened</span>
);

const enhanceLoading = (Component) => branch(
    props => props.isLoading,
    renderComponent(Loading)
);

const enhanceError = (Error) => branch(
    props => props.error,
    renderComponent(Error)
);

export default compose(
    loader(() => dispatch.todos.getAll),
    enhanceLoading(Loading),
    enhanceError(Error),
    connect(undefined, ({ todos: { createItem } }) => {
        return {
            handleCreate: () => createItem({ text: 'meeeewow!', type: 'dog' })
        };
    })
)(TodoList);
