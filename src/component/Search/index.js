import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { DiJqueryLogo as LoadingIcon } from 'react-icons/di'
import { FiFileText as InvoiceIcon } from 'react-icons/fi'
import {
    MdAccountBalance as ChequeIcon,
    MdAccountCircle as CashIcon,
    MdSearch as SearchIcon
} from 'react-icons/md'

import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import { INVOICE } from '../../constant/route'

import Table from './Table'
import Daily from './Daily'
import Customer from './Customers'

import { onChangeEvent } from '../Invoice'

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
        const {
            invoices, layout, category, payment,
            tableType, loading, query_key, query_val,
        } = this.props
        //console.log(layout)

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
            })(tableType)

        const filteredInvoices = this.filterInvoices(invoices, category, payment)
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <React.Fragment>
                        {loading ? <div><LoadingIcon /></div> :
                            <React.Fragment>
                                {authUser && filteredInvoices &&
                                    <Layout
                                        invoices={filteredInvoices}
                                        layout={layout}
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

const layoutInitState = {
    title: '',
    caption: '',
    column: '',
    head: '',
    segment: '',
    categories: ''
}

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            layout: this.getLocationStateParam(props, "layout") || layoutInitState,
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

    // db
    // https://firebase.google.com/docs/database/web/read-and-write
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    queryLayout = () => {
        this.props.firebase
            .queryMany('layout')
            .once('value', snapshot => {
                const snap = snapshot.val()
                if (snap) {
                    Object.keys(snap).map(key => {
                        //console.log(key)
                        this.setState({ [key]: snap[key] })
                        return key
                    })
                }
            })
    }

    query = (limit) => {
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            limit)
        this.queryLayout()
    }

    onSubmit(event) {
        event.preventDefault()
        this.query(pageLimit)
    }

    componentWillUnmount() {
        this.props.firebase.queryMany('layout').off()
    }

    componentDidMount() {
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val)
    }

    render() {
        const {
            invoices, category, customer,
            payment, tableType, loading, query_key, query_val
        } = this.state

        //console.log(this.state.layout)
        const layout = {
            title: this.state.title || this.state.layout.title,
            caption: this.state.caption || this.state.layout.caption,
            column: this.state.column || this.state.layout.title,
            head: this.state.head || this.state.layout.head,
            segment: this.state.segment || this.state.layout.segment,
            categories: this.state.categories || this.state.layout.categories,
        }

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    authUser &&
                    <React.Fragment>
                        <form onSubmit={this.onSubmit}>
                            <table style={{ border: 0, padding: 0 }}>
                                <tbody>
                                    <tr><td>
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
                                            }} type="text" />
                                        <span> </span>
                                        <SearchIcon size={20}
                                            onClick={e => this.query(pageLimit)} />
                                    </td>
                                        <td>{layout && layout.categories &&
                                            <Link to={{
                                                pathname: INVOICE,
                                                layout,
                                                invoice: {}
                                            }}><InvoiceIcon size={32} />
                                            </Link>}
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
                                                {layout.categories &&
                                                    Object.keys(layout.categories)
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
                                                {layout.segment.radio &&
                                                    layout.segment.radio.map(
                                                        function (payment) {
                                                            return (
                                                                <option key={payment}
                                                                    value={payment}>
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
                                            <SearchIcon size={24}
                                                onClick={e => this.query(1000)} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        {invoices && Object.keys(invoices).length &&
                            <Format {...{
                                invoices: invoices,
                                layout: layout,
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
