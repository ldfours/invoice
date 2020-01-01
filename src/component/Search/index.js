import React, { Component } from 'react';

import { LIST } from '../../constant/route'
import { AuthUserContext } from '../Session'
import styles from '../../style/form.module.scss'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: "",
            category: "",
            categories: ["slp", "ac", "mt", "osteo", "sw", "device"]
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault()
        let key = ""
        let category = ""
        if (this.state.customer) {
            key = "customer"
            category = this.state.category
        } else if (this.state.category) {
            key = "category"
        }
        const val = key && this.state[key]
        this.props.history.push(
            {
                pathname: LIST,
                state: {
                    query_key: key,
                    query_val: val,
                    query_category: category
                }
            })
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    authUser && (
                        <form className={styles.form} onSubmit={this.onSubmit}>
                            <label>customer</label>
                            <input className={styles.field}
                                name="customer"
                                value={this.state.customer}
                                onChange={this.onChange}
                                type="text" />
                            <label>category</label>
                            <select style={{ width: "368px" }}
                                name="category"
                                value={this.state.category}
                                onChange={this.onChange}>
                                <option />
                                {this.state.categories
                                    .map(function (category) {
                                        return (
                                            <option key={category} value={category}>{category}
                                            </option>)
                                    })}
                            </select>
                            <button className={styles.button}
                                type="submit">Submit
                            </button>
                        </form>
                    ))}
            </AuthUserContext.Consumer>
        );
    };
}
