import React, { Component } from 'react'
import { IoMdSend as MoreIcon } from 'react-icons/io'
import { DiJqueryLogo as LoadingIcon } from 'react-icons/di'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import { MdAccountBalance as ChequeIcon } from 'react-icons/md'
import { MdAccountCircle as CashIcon } from 'react-icons/md'

import Table from './Table'
import Daily from './Daily'

import {
    //layoutInitState,
    queryLayout,
    onChangeEvent
} from '../Invoice'

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
                if ((!category || invoices[id].category.startsWith(category)) &&
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
            invoices, category, payment, isDaily, loading
        } = this.props
        const Layout = isDaily ? Daily : Table
        const filteredInvoices = this.filterInvoices(invoices, category, payment)
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <React.Fragment>
                        {loading ? <div><LoadingIcon /></div> :
                            <React.Fragment>
                                {authUser && filteredInvoices &&
                                    <Layout invoices={filteredInvoices} />
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
            customer: "",
            category: "",
            payment: "",
            isDaily: false,
            query_key: "",
            query_val: "",
            loading: false,
        }

        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.queryLayout = queryLayout.bind(this)
    }

    queryInvoices = (query_key, query_val,
        category, payment, limit = 15) => {
        this.setState({ loading: true })

        if (query_key) {
            this.props.firebase.invoices()
                .orderByChild(query_key)
                .limitToLast(limit)
                // filter query results to substring of a child node
                .startAt(query_val)
                .endAt(`${query_val}\uf8ff`)
                .once('value', snapshot => {
                    this.setInvoiceState(snapshot.val(), query_key, query_val,
                        category, payment)
                })
        } else {
            this.props.firebase.invoices()
                .limitToLast(limit)
                .once('value', snapshot => {
                    //console.log(snapshot.val())
                    this.setInvoiceState(
                        snapshot.val(),
                        query_key, query_val,
                        category, payment)
                })
        }
    }

    setInvoiceState = (invoiceObject, query_key, query_val,
        category, payment) => {
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
                category: category,
                payment: payment,
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
            this.state.query_val,
            this.state.category,
            this.state.payment)
    }

    loadMore = () => {
        //this.setState(state => ({ limit: state.limit + 1000 }))
        this.queryInvoices(
            this.state.query_key,
            this.state.query_val,
            this.state.category,
            this.state.payment,
            1000)
    }

    onCheckboxChange = event =>
        this.setState({ isDaily: event.target.checked })

    query = () => {
        this.queryInvoices(
            this.state.query_key && "customer",
            this.state.query_val,
            this.state.category,
            this.state.payment
        )
    }

    onSubmit(event) {
        event.preventDefault()
        this.query()
    }

    render() {
        const {
            invoices, categories, category, customer,
            payment, isDaily, loading
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
                                            <span>customer </span>
                                            <input autoFocus
                                                style={{
                                                    border: "1px solid grey", width: "360px"
                                                }}
                                                name="customer"
                                                value={customer}
                                                onFocus={this.query}
                                                onChange={(e) => {
                                                    onChangeEvent(this, e)
                                                    //console.log(e.target.value)
                                                    this.queryInvoices(
                                                        e.target.value && "customer",
                                                        e.target.value,
                                                        this.state.category,
                                                        this.state.payment
                                                    )
                                                }}
                                                type="text" />
                                        </td>
                                        <td>
                                            <span>category </span>
                                            <select
                                                name="category"
                                                value={category}
                                                onChange={(e) => { onChangeEvent(this, e) }}>
                                                <option />
                                                {categories && Object.keys(categories)
                                                    .map(function (c) {
                                                        return (
                                                            <option key={c} value={c}>{c}</option>)
                                                    })}
                                            </select>
                                        </td>
                                        <td>
                                            <span>payment </span>
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
                                            daily
                                            <input style={{ width: "40px" }}
                                                type="checkbox"
                                                defaultChecked={isDaily}
                                                onChange={this.onCheckboxChange} />
                                        </td>
                                        <td>
                                            <MoreIcon onClick={this.loadMore} />
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
                                isDaily: isDaily,
                                loading: loading
                            }} />
                        }
                    </React.Fragment>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

export default withFirebase(Search)
