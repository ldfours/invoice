import React, { Component } from 'react'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'

import { DiJqueryLogo as LoadingIcon } from 'react-icons/di'
import {
    MdAccountBalance as ChequeIcon,
    MdAccountCircle as CashIcon,
    MdSearch as SearchIcon
} from 'react-icons/md'

import Table from './Table'
import Daily from './Daily'
import Customer from './Customers'

import {
    //layoutInitState,
    queryLayout,
    onChangeEvent
} from '../Invoice'

const pageLimit = 15

export const getPaymentIcon = (payment) => {
    let PaymentIcon = React.Fragment
    if (payment) {
        if (payment === "Cheque") {
            PaymentIcon = ChequeIcon
        } else if (payment === "Cash") {
            PaymentIcon = CashIcon
        }
    }
    return PaymentIcon
}

class Format extends Component {

    filterInvoices = (invoices, category, payment) =>
        Object.keys(invoices)
            .filter(id => {
                // console.log(JSON.stringify(invoices[id].payment))
                if ((!category || invoices[id].category === category) &&
                    (!payment || invoices[id].payment === payment)) {
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
        const { invoices, category, payment, tableType, loading,
            query_key, query_val } = this.props
        const Layout = (
            function (t) {
                switch (t) {
                    case 'daily':
                        return Daily
                    case 'customer':
                        return Customer
                    default:
                        return Table
                }
            }
        )(tableType)

        const filteredInvoices = this.filterInvoices(invoices, category, payment)
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <React.Fragment>
                        {loading ? <div><LoadingIcon /></div> :
                            <React.Fragment>
                                {authUser && filteredInvoices &&
                                    <Layout invoices={filteredInvoices}
                                        query_key={query_key}
                                        query_val={query_val}
                                    />
                                }
                            </React.Fragment>}
                    </React.Fragment>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //...layoutInitState,
            segment: { radio: ["Cheque", "Cash"] },
            categories: { slp: "", ac: "", mt: "", osteo: "", sw: "", device: "" },
            customer: this.getLocationStateParam(props, "query_key") === "customer" ?
                this.getLocationStateParam(props, "query_val") : "",
            category: this.getLocationStateParam(props, "query_key") === "category" ?
                this.getLocationStateParam(props, "query_val") : "",
            payment: "",
            tableType: "",
            query_key: this.getLocationStateParam(props, "query_key"),
            query_val: this.getLocationStateParam(props, "query_val"),
            loading: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.queryLayout = queryLayout.bind(this)
    }

    getLocationStateParam = (props, param) => {
        if (props.location.state && props.location.state[param]) {
            return props.location.state[param]
        } else {
            return ""
        }
    }

    queryInvoices = (query_key, query_val, limit = pageLimit) => {
        this.setState({ loading: true })

        if (query_key) {
            this.props.firebase.queryMany('invoice')
                .orderByChild(query_key)
                .limitToLast(limit)
                // filter query results to substring of a child node
                .startAt(query_val)
                .endAt(`${query_val}\uf8ff`)
                .once('value', snapshot => {
                    this.setInvoiceState(snapshot.val(), query_key, query_val)
                })
        } else {
            this.props.firebase.queryMany('invoice')
                .limitToLast(limit)
                .once('value', snapshot => {
                    //console.log(snapshot.val())
                    this.setInvoiceState(
                        snapshot.val(), "", "")
                })
        }
    }

    setInvoiceState = (invoiceObject, query_key, query_val) => {
        if (invoiceObject) {
            //     const invoiceList =
            //       Object.keys(invoiceObject).map(key => ({
            //         ...invoiceObject[key]
            //       }))
            //       console.log(invoiceList)
            this.setState({
                invoices: invoiceObject,
                query_key: query_key,
                query_val: query_val,
                loading: false,
            })
        } else {
            //console.log("no invoices")
            this.setState({
                invoices: null,
                loading: false,
            })
        }
    }

    componentDidMount() {
        //queryLayout(this)
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val)
    }

    loadMore = () => {
        //this.setState(state => ({ limit: state.limit + 1000 }))
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            1000)
    }

    query = () => {
        this.queryInvoices(
            this.state.query_key && "customer",
            this.state.query_val)
    }

    onSubmit(event) {
        event.preventDefault()
        this.query()
    }

    render() {
        const {
            invoices, categories, category, customer,
            payment, tableType, loading, query_key, query_val
        } = this.state

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    authUser &&
                    <React.Fragment>
                        <form onSubmit={this.onSubmit}>
                            <table style={{ border: 0, padding: 0 }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input autoFocus
                                                style={{
                                                    border: "1px solid grey", width: "360px"
                                                }}
                                                name="customer"
                                                value={customer}
                                                onChange={(e) => {
                                                    onChangeEvent(this, e)
                                                    this.setState({
                                                        query_key: "customer",
                                                        query_val: e.target.value
                                                    })
                                                }}
                                                type="text" />
                                            <span> </span>
                                            <SearchIcon size={20} onClick={this.query} />
                                        </td>
                                        <td>
                                            <span style={{ fontStyle: "italic" }}>category </span>
                                            <select
                                                name="category"
                                                value={category}
                                                onChange={(e) => {
                                                    onChangeEvent(this, e)
                                                }}>
                                                <option />
                                                {categories && Object.keys(categories)
                                                    .map(function (c) {
                                                        return (
                                                            <option key={c} value={c}>{c}</option>)
                                                    })}
                                            </select>
                                        </td>
                                        <td>
                                            <span style={{ fontStyle: "italic" }}>payment </span>
                                            <select
                                                name="payment"
                                                value={payment}
                                                onChange={(e) => { onChangeEvent(this, e) }}>
                                                <option />
                                                {this.state.segment.radio &&
                                                    this.state.segment.radio.map(function (payment) {
                                                        return (
                                                            <option key={payment} value={payment}>
                                                                {payment}
                                                            </option>)
                                                    })}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="tableType"
                                                value={this.state.tableType}
                                                onChange={(e) => { onChangeEvent(this, e) }}>
                                                <option />
                                                <option>customer</option>
                                                <option>daily</option>
                                            </select>
                                        </td>
                                        <td>
                                            <SearchIcon size={24} onClick={this.loadMore} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        {invoices && Object.keys(invoices).length &&
                            <Format {...{
                                invoices: invoices,
                                category: category,
                                payment: payment,
                                tableType: tableType,
                                loading: loading,
                                query_key: query_key,
                                query_val: query_val
                            }} />
                        }
                    </React.Fragment>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

export default withFirebase(Search)
