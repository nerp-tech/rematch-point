import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import { branch, compose, renderComponent } from 'recompose';

import { loader } from '@rematch-point/react';

const TodoList = ({ items }) => (
    <ul>
        {items.map((item) => <li key={item.uuid}>{item.text}</li>)}
    </ul>
);

const Loading = () => (
    <span>Loading...</span>
);

const enhanceLoading = (Component) => branch(
    props => props.isLoading && props.items.length === 0,
    renderComponent(Loading)
);

export default compose(
    loader(() => dispatch.todos.getAllByType, ['dog']),
    enhanceLoading(Loading),
)(TodoList);
