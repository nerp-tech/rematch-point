import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { init } from '@rematch/core'

import { todos } from './todos/model.ts';
import TodoList from './todos/TodoList';
import TodoItem from './todos/TodoItem';
import TodoDogList from './todos/TodoDogList';

const store = init({
	models: {
		todos,
	},
});

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Fragment>
					<TodoList />
					<hr/>
					<TodoDogList />
					<hr/>
					<TodoItem />
				</Fragment>
			</Provider>
		);
	}
}

var mountNode = document.getElementById('app');
render(<App />, mountNode);
