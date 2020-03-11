import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import { AiOutlineDollar as CashIcon, } from 'react-icons/ai'
import {
    FaFileInvoice //FaFileInvoiceDollar
        as InvoiceIcon,
    FaMoneyCheckAlt as ChequeIcon,
    FaNotesMedical as MedicalIcon
} from 'react-icons/fa'
import {
    FiDollarSign as DollarIcon,
    FiChevronUp as MoreIcon,
    FiChevronDown as LessIcon,
} from 'react-icons/fi'
import {
    MdToday as DailyIcon,
    MdPerson as CustomerIcon,
    MdAccessTime as ClockIcon,
    MdSearch as SearchIcon,
} from 'react-icons/md'

import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'
import { INVOICE } from '../../constant/route'

import Table from './Table'
import Daily from './Daily'
import Customer from './Customers'

import { onChangeEvent } from '../Invoice'

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

const tableTypeOptions = [
    { value: 'invoice', label: <InvoiceIcon /> },
    { value: 'customer', label: <CustomerIcon /> },
    { value: 'daily', label: <DailyIcon /> },
]

const paymentOptions = [ //layout.segment.radio.map()
    { value: '', label: <DollarIcon style={{ color: "blue" }} /> },
    { value: 'Cash', label: <CashIcon /> },
    { value: 'Cheque', label: <ChequeIcon /> },
]

const categoryInitOption = { value: "", label: <MedicalIcon style={{ color: "blue" }} /> }

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
            }).map(id => {
                const invoice = invoices[id]
                invoice.id = id
                return invoice
            })

    render() {
        const {
            invoices, layout, category, payment,
            tableType, loading, queryKey, queryVal,
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
                        {loading ?
                            <div><ClockIcon /></div> :
                            <React.Fragment>
                                {authUser && filteredInvoices &&
                                    <Layout
                                        invoices={filteredInvoices}
                                        layout={layout}
                                        queryKey={queryKey}
                                        queryVal={queryVal}
                                    />}
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
            customer: this.getLocationStateParam(props, "queryKey") === "customer" ?
                this.getLocationStateParam(props, "queryVal") : "",
            category: this.getLocationStateParam(props, "queryKey") === "category" ?
                this.getLocationStateParam(props, "queryVal") : "",
            paymentOption: paymentOptions[0],
            tableTypeOption: tableTypeOptions[0],
            categoryOption: categoryInitOption,
            queryKey: this.getLocationStateParam(props, "queryKey"),
            queryVal: this.getLocationStateParam(props, "queryVal"),
            pageLimit: 10,
            loading: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    queryUpdateLimit = (fun) => {
        this.setState({ pageLimit: fun(this.state.pageLimit) },
            () => { this.query() })
    }

    getLocationStateParam = (props, param) => {
        if (props.location.state && props.location.state[param]) {
            return props.location.state[param]
        } else {
            return ""
        }
    }

    queryInvoices = (queryKey, queryVal, limit) => {
        this.setState({ loading: true })

        if (queryKey && queryVal) {
            this.props.firebase.queryMany('invoice')
                .orderByChild(queryKey)
                .limitToLast(limit)
                // filter query results to substring of a child node
                .startAt(queryVal)
                .endAt(`${queryVal}\uf8ff`)
                .once('value', snapshot => {
                    this.setInvoiceState(snapshot.val(), queryKey, queryVal)
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

    setInvoiceState = (invoiceObject, queryKey, queryVal) => {
        if (invoiceObject) {
            this.setState({
                invoices: invoiceObject,
                queryKey: queryKey,
                queryVal: queryVal,
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

    onOptionChange = (key, selectedOption) => {
        this.setState({ [key]: selectedOption },
            //() => console.log(`Option selected:`, this.state.tableType.value)
        )
    }

    query = () => {
        this.queryInvoices(
            this.state.queryKey,
            this.state.queryVal,
            this.state.pageLimit)
        if (!this.state.layout.categories) {
            this.queryLayout()
        }
    }

    onSubmit(event) {
        event.preventDefault()
        this.query()
    }

    componentWillUnmount() {
        this.props.firebase.queryMany('layout').off()
    }

    componentDidMount() {
        this.query()
    }

    render() {
        const { invoices, customer, loading, queryKey, queryVal } = this.state
        const tableType = this.state.tableTypeOption.value
        const payment = this.state.paymentOption.value
        const category = this.state.categoryOption.value

        //console.log(this.state.layout)
        const layout = {
            title: this.state.title || this.state.layout.title,
            caption: this.state.caption || this.state.layout.caption,
            column: this.state.column || this.state.layout.title,
            head: this.state.head || this.state.layout.head,
            segment: this.state.segment || this.state.layout.segment,
            categories: this.state.categories || this.state.layout.categories,
        }

        const categoryOptions = layout.categories &&
            Object.keys(layout.categories)
                .map(function (c) {
                    return ({ value: c, label: c })
                })

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    authUser &&
                    <React.Fragment>
                        <form onSubmit={this.onSubmit}>
                            <table style={{ width: "100%" }} className="no-print">
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
                                                        queryKey: "customer",
                                                        queryVal: e.target.value
                                                    })
                                                }} type="text" />
                                            <span> </span>
                                            <SearchIcon size={24}
                                                style={{ color: "blue" }}
                                                onClick={e => this.query()} />
                                        </td>
                                        <td>
                                            <div>
                                                <MoreIcon
                                                    style={{ color: "blue", }}
                                                    onClick={e =>
                                                        this.queryUpdateLimit(
                                                            function (x) {
                                                                return Math.ceil(x * 2)
                                                            })}
                                                    size={24} />
                                            </div>
                                            <div style={{ color: "#444444", }}>
                                                {this.state.pageLimit}
                                            </div>
                                            <div>
                                                <LessIcon
                                                    style={{ color: "blue", }}
                                                    onClick={e =>
                                                        this.queryUpdateLimit(
                                                            function (x) {
                                                                return Math.ceil(x / 2)
                                                            })}
                                                    size={24} />
                                            </div>
                                        </td>
                                        <td>{layout && layout.categories &&
                                            <Link to={{
                                                pathname: INVOICE,
                                                layout,
                                                invoice: {}
                                            }}><InvoiceIcon size={32} />
                                            </Link>}
                                        </td>
                                        <td style={{ width: "40px" }}>
                                            {layout && layout.categories &&
                                                <Select
                                                    value={this.state.paymentOption}
                                                    onChange={e =>
                                                        this.onOptionChange("paymentOption", e)}
                                                    options={paymentOptions} />}
                                        </td>
                                        <td style={{ width: "50px" }}>
                                            {layout && layout.categories &&
                                            <Select
                                                value={this.state.categoryOption}
                                                onChange={e =>
                                                    this.onOptionChange("categoryOption", e)}
                                                options={[categoryInitOption,
                                                    ...categoryOptions]} />}
                                        </td>
                                        <td style={{ width: "40px" }}>
                                            {layout &&
                                                layout.categories &&
                                                <Select menuIsOpen={true}
                                                    value={this.state.tableTypeOption}
                                                    onChange={e =>
                                                        this.onOptionChange("tableTypeOption", e)}
                                                    options={tableTypeOptions} />}
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
                                queryKey: queryKey,
                                queryVal: queryVal
                            }} />
                        }
                    </React.Fragment>
                )}
            </AuthUserContext.Consumer>
        )
    }
}

export default withFirebase(Search)
