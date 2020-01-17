import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import { SEARCH } from '../../constant/route'
import { compose } from '../../constant/util'
import styles from './form.module.scss'

const LoginForm =
  ({ onSubmit, onChange, email, password, isInvalid, error }) => {
    return (
      <>
        <form className={styles.form} onSubmit={onSubmit}>
          <div>
            <input
              className={styles.field}
              name="email"
              value={email}
              onChange={onChange}
              placeholder='email'
              autoComplete="username"
            />
            <input
              className={styles.field}
              name="password"
              value={password}
              onChange={onChange}
              placeholder='password'
              type='password'
              autoComplete="current-password"
            />

            <button
              className={styles.button}
              disabled={isInvalid}
              type="submit"
              color='teal' size='large'>
              Login
          </button>
          </div>
        </form>
        <div>
          {error && <label>{error.message}</label>}
        </div>
      </>
    )
  }

const initialLoginState = {
  email: '',
  password: '',
  error: null,
}

class LoginFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...initialLoginState }
  }

  onSubmit = event => {
    const { email, password } = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((_authUser) => {
        this.setState({ ...initialLoginState })
        this.props.history.push(SEARCH)
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { email, password, error } = this.state

    const isInvalid = password === '' || email === ''

    return (
      <LoginForm
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        email={email}
        password={password}
        isInvalid={isInvalid}
        error={error}
      />
    )
  }
}

const Login = compose(
  withRouter,
  withFirebase,
)(LoginFormBase)

export default () => (
  <div>
    <Login />
  </div>
)
