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

const NavigationAuth = ({ authUser }) => (
  <div>
    <Link to={ROUTES.SEARCH}>Search</Link>
    <span> </span>
    <Link to={{
      pathname: ROUTES.INVOICE,
      invoice: { readOnly: false }
    }}>Create</Link>

    <SignOutButton />
  </div>
);

const NavigationNonAuth = () => (
  <div className={"ui container"}>
    <Login />
  </div>
);

export default Navigation;
