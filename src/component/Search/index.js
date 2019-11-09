import React from 'react';

import { LIST } from '../../constant/route';
import { range } from '../../constant/util';
import { AuthUserContext } from '../Session';
import styles from '../../style/form.module.scss'

const now_year = new Date().getFullYear();
const years = range(2015, now_year + 1).reverse();

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { created: now_year, customer: "" };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        let key, val;
        if (this.state.customer) {
            key = "customer";
            val = this.state[key]
        } else {
            key = "created";
            val = this.state[key]
        }
        this.props.history.push(
            {
                pathname: LIST,
                state: { query_key: key, query_val: val }
            });
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    authUser && (
                        <>
                        <form className={styles.form} onSubmit={this.onSubmit}>
                            <div>
                                <label>Client</label>
                                <input className={styles.field}
                                       name="customer"
                                       value={this.state.customer}
                                       onChange={this.onChange}
                                       type="text" />
                            </div>
                            <div>
                                <label>Year</label>
                                <select className={styles.field}
                                        name="created"
                                        value={this.state.created || ""}
                                        onChange={this.onChange}>
                                    {years.map(
                                        (year) =>
                                            <option key={year}
                                                    value={year}>{year}</option>
                                    )}
                                </select>
                            </div>
                            <button className={styles.button} type="submit">Submit
                            </button>
                        </form>
                        </>
                    ) )}
            </AuthUserContext.Consumer>
        );
    };
}
