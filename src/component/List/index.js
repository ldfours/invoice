import React, { Component } from 'react'

import { compose } from '../../constant/util'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import Table from './Table'

class InvoicesBase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            invoices: null,
            query_key: this.props.location.state.query_key,
            query_val: this.props.location.state.query_val,
            query_category: this.props.location.state.query_category
        }
    }

    setInvoiceState = (invoiceObject, query_key, query_val, query_category) => {
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
                query_category: query_category,
            })
        } else {
            this.setState({
                invoices: null,
                loading: false
            })
        }
    }

    queryInvoices = (query_key, query_val, query_category, limit = 40) => {
        this.setState({ loading: true })

        if (query_key) {
            this.props.firebase.invoices()
                .orderByChild(query_key)
                .limitToLast(limit)

                // filter query results to substring of a child node
                .startAt(query_val)
                .endAt(`${query_val}\uf8ff`)
                .once('value', snapshot => {
                    this.setInvoiceState(snapshot.val(), query_key, query_val, query_category)
                })
        } else {
            this.props.firebase.invoices()
                .limitToLast(limit)
                .once('value', snapshot => {
                    this.setInvoiceState(snapshot.val(), query_key, query_val, query_category)
                })
        }
    }

    componentDidMount() {
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            this.state.query_category)
    }

    componentWillUnmount() {
        this.props.firebase.invoices().off()
    }

    loadMore = () => {
        //this.setState(state => ({ limit: state.limit + 1000 }));
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            this.state.query_category,
            1000)
    };

    render() {
        const { invoices, loading, query_key, query_val, query_category } = this.state
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>loading..</div>}
                        {!loading && invoices &&
                            <div>
                                <Table
                                    query_key={query_key}
                                    query_val={query_val}
                                    query_category={query_category}
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
