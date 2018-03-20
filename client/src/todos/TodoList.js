import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import { branch, compose, mapProps, renderComponent } from 'recompose';

import { loader } from '../async-rematch/hocs';

const TodoList = ({ items }) => (
    <ul>
        {items.map((item, i) => <li key={i}>{item.text}</li>)}
    </ul>
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
    mapProps(props => {
        return Object.assign({}, props, {
            allItems: props.items,
            allLoading: props.isLoading
        });
    }),
    loader(() => dispatch.todos.getAllByType, ['dog']),
    mapProps(props => {
        return Object.assign({}, props, {
            items: [...props.items, ...props.allItems],
            isLoading: props.isLoading || props.allLoading,
        });
    }),
    enhanceLoading(Loading),
    enhanceError(Error),
)(TodoList);
