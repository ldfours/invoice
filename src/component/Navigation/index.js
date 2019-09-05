import React from 'react';
import { Link } from 'react-router-dom';

import Login from '../Login';
import { AuthUserContext } from '../Session';
import SignOutButton from '../Logout';
import * as ROUTES from '../../constant/route';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = (props) => (
  <nav className={"no-print"} id="page-nav">
    {/*{JSON.stringify(props, null, 2)}*/}
    <label htmlFor="hamburger">&#9776;</label>
    <input type="checkbox" id="hamburger" />
    <ul>
      <li><Link to={ROUTES.SEARCH}>Search</Link></li>

      <li><Link to={{
        pathname: ROUTES.INVOICE,
        invoice: { readOnly: false }
      }}>Create</Link></li>

      <li><SignOutButton /></li>
    </ul>
  </nav>
);

const NavigationNonAuth = () => (
  <div className={"ui container"}>
    <Login />
  </div>
);

export default Navigation;
