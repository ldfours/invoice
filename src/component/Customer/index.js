import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown/with-html'

import { withFirebase } from '../Firebase'
import { DateComparator, arraySpan } from '../../constant/util'

class Customer extends Component { //export default (props) => {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {
            customer: props.location.customer,
            dob: "",
            company: "",
            note: "",
        }
    }

    queryCustomer = (name) => {
        this.props.firebase
            .queryOne('customer', name)
            .once('value', snapshot => {
                const snap = snapshot.val()
                if (snap) {
                    Object.keys(snap).map(key => {
                        // console.log(`${key} -> ${snap[key]}`)
                        this.setState({ [key]: snap[key] })
                        return key
                    })
                }
            })
    }

    firebaseSave = (name, obj) => {
        this.props.firebase
            .queryOne('customer', name)
            .set(obj)
            .catch(error => {
                const errorMessage = error + " saving " +
                    name + " " + obj
                window.alert(errorMessage)
                console.log(errorMessage)
            })
        console.log(`saved customer ${name}`)
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault()
        const obj = {
            dob: this.state.dob,
            company: this.state.company,
            note: this.state.note
        }
        const customer = this.state.customer
        if (customer && (this.state.dob || this.state.company
            || this.state.note)) {
            this.firebaseSave(customer, obj)
        }
    }

    componentDidMount() {
        this.queryCustomer(this.state.customer)
    }

    componentWillUnmount() {
        this.props.firebase.queryOne('customer').off()
    }

    render() {
        const customer = this.props.location.customer
        const layoutCategory = this.props.location.layoutCategory
        const visits = this.props.location.visits
        const visitsKeys = visits && Object.keys(visits)
        const lastIndex = visits && Object.keys(visits).slice(-1)[0]
        const description = visits && visits[lastIndex].description
        const visitsArray = visitsKeys &&
            visitsKeys.map(key => [
                visits[key].date,
                visits[key].note,
            ])
        const headDate = visitsArray && visitsArray[0][0]

        const provider = layoutCategory &&
            arraySpan(layoutCategory.note.slice(1, 3),
                { fontStyle: "oblique", fontSize: "0.7em" })

        return (
            customer ? (
                <React.Fragment>
                    <div style={{ fontStyle: "oblique", padding: "0.6em" }}>
                        {layoutCategory &&
                            <span>
                                {arraySpan(layoutCategory.note.slice(1))}
                                <span style={{ fontWeight: "bold" }}>- {description}</span>
                            </span>}
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div style={{ fontWeight: "bold" }}>
                            <span style={{ fontSize: "1.1em" }}>{customer}</span>
                            <span style={{
                                width: "15em",
                                float: "right",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}>DOB:<span> </span>
                                <input type="text"
                                    style={{ border: "1px solid grey" }}
                                    name="dob"
                                    onChange={this.onChange}
                                    value={this.state.dob ? `${this.state.dob}` : ""} />
                                <button type="submit" className="no-print">submit</button>
                            </span>
                        </div>
                        <div style={{ padding: "8px" }}>{headDate && `Date: ${headDate}`}</div>
                        {visits &&
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    {visitsArray
                                        .sort(DateComparator)
                                        .map((element, i) => {
                                            const date = element[0]
                                            const text = element[1]
                                            return (
                                                <tr key={i}>
                                                    <td style={{
                                                        width: "8em",
                                                        border: "1px solid grey"
                                                    }}>{date}
                                                        <div>{provider}</div>
                                                        <div>
                                                            <img style={{ height: "1.4em", }}
                                                                src={`/images/${
                                                                    layoutCategory.signature
                                                                    }`}
                                                                alt="signature" />
                                                        </div>
                                                    </td>
                                                    <td style={{ border: "1px solid grey" }}>
                                                        <ReactMarkdown
                                                            source={text}
                                                            escapeHtml={false} />
                                                    </td>
                                                </tr>)
                                        })}
                                </tbody>
                            </table>}
                        {!visits &&
                            <div className={"no-print"}>
                                <input type="text"
                                    style={{ border: "1px solid grey" }}
                                    name="company"
                                    onChange={this.onChange}
                                    value={this.state.company} />
                                <textarea
                                    style={{ border: "1px solid grey" }}
                                    name="note"
                                    onChange={this.onChange}
                                    value={this.state.note} />
                            </div>}
                    </form>
                </React.Fragment>) : ""
        )
    }
}

export default withFirebase(Customer)
