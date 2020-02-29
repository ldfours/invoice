import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from '../Navigation'
import Search from '../Search'
import Login from '../Login'
import Invoice from '../Invoice'
import Customer from '../Customer'

import { SEARCH, LOGIN, INVOICE, CUSTOMER } from '../../constant/route'
import { withAuthentication } from '../Session'

const App = (props) => (
  <Router>
    <div>
      <Navigation />

      <Route exact path={SEARCH} component={Search} />
      <Route path={LOGIN} component={Login} />
      <Route path={INVOICE} component={Invoice} />
      <Route path={CUSTOMER} component={Customer} />
    </div>
  </Router>
)

export default withAuthentication(App)
