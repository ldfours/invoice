import React from 'react';

import { LIST } from '../../constant/route';
import { AuthUserContext } from '../Session';
import styles from '../../style/form.module.scss'

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { customer: "" };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault()
        const key = this.state.customer && "customer"
        const val = key && this.state[key]
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
                        <form className={styles.form} onSubmit={this.onSubmit}>
                            <input className={styles.field}
                                name="customer"
                                value={this.state.customer}
                                onChange={this.onChange}
                                type="text" />
                            <button className={styles.button}
                                type="submit">Submit
                            </button>
                        </form>
                    ))}
            </AuthUserContext.Consumer>
        );
    };
}
