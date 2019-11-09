import React, { Component } from 'react'

import { capitalWords, compose } from '../../constant/util'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import Table from './Table';

class InvoicesBase extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            invoices: null,
            query_key: this.props.location.state.query_key,
            query_val: this.props.location.state.query_val
        };
    }

    queryInvoices = (query_key, query_val, limit = 20) => {
        this.setState({ loading: true })
        const capital_query_val = capitalWords(query_val)

        this.props.firebase.invoices()
            .orderByChild(query_key)
            .limitToLast(limit)

            // filter query results to substring of a child node
            .startAt(capital_query_val)
            .endAt(`${capital_query_val}\uf8ff`)
            .once('value', snapshot => {
                const invoiceObject = snapshot.val()
                if (invoiceObject) {
                    //const invoiceList =
                    //  Object.keys(invoiceObject).map(key => ({
                    //    ...invoiceObject[key]
                    //  }));
                    this.setState({
                        invoices: invoiceObject,
                        loading: false,
                        query_key: query_key,
                        query_val: query_val,
                    })
                } else {
                    this.setState({
                        invoices: null,
                        loading: false
                    })
                }
            })
    }

    componentDidMount() {
        this.queryInvoices(this.state.query_key,
            this.state.query_val);
    }

    componentWillUnmount() {
        this.props.firebase.invoices().off()
    }

    loadMore = () => {
        //this.setState(state => ({ limit: state.limit + 1000 }));
        this.queryInvoices(this.state.query_key,
            this.state.query_val, 1000);
    };

    render() {
        const { invoices, loading, query_key, query_val } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>loading..</div>}
                        {!loading && invoices &&
                        <div>
                            <Table query_key={query_key}
                                   query_val={query_val}
                                   invoices={invoices} />
                            <button onClick={this.loadMore}>
                                more&raquo;
                            </button>
                        </div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

export default compose(
    withFirebase,
)(InvoicesBase);
