import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Search from '../Search';
import Login from '../Login';
import List from '../List';
import Invoice from '../Invoice';

import * as ROUTES from '../../constant/route';
import { withAuthentication } from '../Session';

const App = (props) => (
  <Router>
    <div>
      <Navigation />

      <Route exact path={ROUTES.SEARCH} component={Search} />
      <Route path={ROUTES.LOGIN} component={Login} />
      <Route path={ROUTES.LIST} component={List} />
      <Route path={ROUTES.INVOICE} component={Invoice} />
    </div>
  </Router>
);

export default withAuthentication(App);
