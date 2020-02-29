import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import { SEARCH } from '../../constant/route'
import { compose } from '../../constant/util'
import Site from './Site.js'

const initialLoginState = {
  email: '',
  password: '',
  error: null,
}

class WebSite extends Component {
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
    const isValid = password !== '' && email !== ''
    return (
      <Site
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        email={email}
        password={password}
        isValid={isValid}
        error={error} />
    )
  }
}

const Login = compose(
  withRouter,
  withFirebase,
)(WebSite)

export default () => ( <Login /> )
