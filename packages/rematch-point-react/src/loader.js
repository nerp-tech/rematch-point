import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LOADING, DELETING, UPDATING, getQuery, getItems } from '@rematch-point/core';

const queryWrapper = (queryString, Comp) => {
    return connect(
        (state) => {
            if (!queryString) {
                return { isLoading: true, items: [] };
            }

            const q = getQuery(state, queryString);

            return {
                isLoading: q.queryState === LOADING,
                isUpdating: q.queryState === UPDATING,
                isDeleting: q.queryState === DELETING,
                items: getItems(state, queryString),
                error: q.error,
            };
        }
    )(Comp);
};

export default (func, args = []) => (Comp) => {
    return class Loader extends Component {
        state = {
            queryString: null,
        }

        action = null

        componentDidMount() {
            this.action = func().apply(this, args);
            this.action.then((queryString) => {
                this.setState({
                    queryString,
                });
            });
        }

        render() {
            // Don't really like this, but eh
            if (!this.state.queryString) {
                return null;
            }

            const QueryComponent = queryWrapper(this.state.queryString, Comp);

            return <QueryComponent {...this.props} />;
        }
    }
};
