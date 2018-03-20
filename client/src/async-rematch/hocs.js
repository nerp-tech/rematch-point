import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LOADING, DELETING } from './constants';
import { getQuery, getItems } from './connectHelpers';

const queryWrapper = (query, Comp) => {
    return connect(
        (state) => {
            if (!query) {
                return { isLoading: true, items: [] };
            }

            const q = getQuery(state, query);

            return {
                isLoading: q.queryState === LOADING,
                isDeleting: q.queryState === DELETING,
                items: getItems(state, query),
                error: q.error,
            };
        }
    )(Comp);
};

export const loader = (func, args = []) => (Comp) => {
    return class Loader extends Component {
        state = {
            query: null,
        }

        gen = null

        componentDidMount() {
            this.gen = func().apply(this, args);
            this.gen.then((query) => {
                this.setState({
                    query,
                });
            });
        }

        render() {
            // Don't really like this, but eh
            if (!this.state.query) {
                return null;
            }

            const QueryComponent = queryWrapper(this.state.query, Comp);

            return <QueryComponent {...this.props} />;
        }
    }
};
