import React, { Component } from 'react'

import { withFirebase } from '../Firebase'

//export default (props) => {
class Customer extends Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {
            customer: props.location.customer,
            company: "",
            dob: "",
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
        //console.log(event.target.name + " = " + event.target.value)
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
        const visits = this.props.location.visits
        const customer = this.props.location.customer
        const keys = visits && Object.keys(visits)
        const lastIndex = visits && Object.keys(visits).slice(-1)[0]
        const description = visits && visits[lastIndex].description
        return (
            customer ? (
                <React.Fragment>
                    <div style={{ fontWeight: "bold", textAlign: "center" }}>
                        {description} {visits && " - NOTES"}
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div style={{ fontWeight: "bold" }}>
                            Client's Name:<span> </span>
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
                                    {keys.map(key => {
                                        const date = visits[key].date
                                        const note = visits[key].note
                                        return (<tr key={key}>
                                            <td style={{ width: "8em" }}>{date}</td>
                                            <td>{note}</td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>}
                        <div className={"no-print"}>
                            Company: <input type="text"
                                style={{ border: "1px solid grey" }}
                                name="company"
                                onChange={this.onChange}
                                value={this.state.company} />
                            Note: <textarea
                                style={{ border: "1px solid grey" }}
                                name="note"
                                onChange={this.onChange}
                                value={this.state.note} />
                        </div>
                    </form>
                </React.Fragment>) : ""
        )
    }
}

export default withFirebase(Customer)
