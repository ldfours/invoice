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
  <nav className={"no-print"}>
    {/*{JSON.stringify(props, null, 2)}*/}
    <Link to={ROUTES.SEARCH}>Search</Link>

    <Link to={{
      pathname: ROUTES.INVOICE,
      invoice: { readOnly: false }
    }}>New</Link>

    <SignOutButton />
  </nav>
);

const NavigationNonAuth = () => (
  <div className={"ui container"}>
    <Login />
  </div>
);

export default Navigation;
