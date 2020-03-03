import React, { Component } from 'react'
import Markdown from 'react-markdown'

import { withFirebase } from '../Firebase'
import { DateComparator } from '../../constant/util'

//export default (props) => {
class Customer extends Component {
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
        return (
            customer ? (
                <React.Fragment>
                    <div style={{ fontStyle: "oblique" }}>
                        {layoutCategory &&
                            layoutCategory.note.slice(1)
                                .map((line, i) =>
                                    <span key={i}>{line} </span>)}
                    </div>
                    <div style={{ fontWeight: "bold", textAlign: "center" }}>
                        {description} {visits && " - NOTES"}
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div style={{ fontWeight: "bold" }}>
                            Client:<span> </span>
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
                                <button type="submit" className="no-print">update</button>
                            </span>
                        </div>
                        {visits &&
                            <table>
                                <thead><tr><th>Date</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {visitsArray
                                        .sort(DateComparator)
                                        .map((element, i) => {
                                            const date = element[0]
                                            const text = element[1]
                                            return (<tr key={i}>
                                                <td style={{ width: "8em" }}>{date}</td>
                                                <td><Markdown source={text} />
                                                    {layoutCategory && layoutCategory.note
                                                        .slice(1, 3) // slice(fromIndex, toIndex)
                                                        .map((line, i) =>
                                                            <span key={i}
                                                                style={{
                                                                    fontStyle: "oblique",
                                                                    fontSize: "0.7em"
                                                                }}>{line} </span>)}
                                                    <img style={{ height: "1.1em", }}
                                                        src={`/images/${layoutCategory.signature}`}
                                                        alt="signature" />
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
