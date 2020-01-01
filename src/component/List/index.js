import React, { Component } from 'react'

import { compose } from '../../constant/util'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import Table from './Table'
import Daily from './Daily'

class InvoicesBase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invoices: null,
            query_key: this.props.location.state.query_key,
            query_val: this.props.location.state.query_val,
            query_category: this.props.location.state.query_category,
            isDaily: this.props.location.state.isDaily,
            loading: false,
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
                query_key: query_key,
                query_val: query_val,
                query_category: query_category,
                loading: false,
            })
        } else {
            this.setState({
                invoices: null,
                loading: false
            })
        }
    }

    queryInvoices = (query_key, query_val, query_category, limit = 25) => {
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
        //this.setState(state => ({ limit: state.limit + 1000 }))
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            this.state.query_category,
            1000)
    };

    filterInvoices = (invoices, query_category) =>
        Object.keys(invoices)
            .filter(id => {
                //console.log(JSON.stringify(id, null, 2))
                if (!query_category
                    || invoices[id].category.startsWith(query_category)) {
                    return true
                } else {
                    return false
                }
            })
            .map(id => {
                const invoice = invoices[id]
                invoice.id = id
                return invoice
            })

    render() {
        const { invoices, loading,
            query_key, query_val, query_category, isDaily } = this.state
        const Layout = isDaily ? Daily : Table
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>loading..</div>}
                        {!loading && invoices &&
                            <div>
                                {query_key && query_key}<span> </span>
                                <label>{query_val && query_val}
                                    {query_category && ` category ${query_category}`}
                                </label>
                                <Layout invoices={this.filterInvoices(
                                    invoices,
                                    query_category)} />
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
