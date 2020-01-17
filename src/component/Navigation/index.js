import React from 'react'
import { Link } from 'react-router-dom'

import Login from '../Login'
import { AuthUserContext } from '../Session'
import LogoutButton from '../Logout'
import { SEARCH, INVOICE } from '../../constant/route'

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
)

const NavigationAuth = (props) => (
    <nav className={"no-print"} id="page-nav">
        {/*{JSON.stringify(props, null, 2)}*/}
        <label htmlFor="hamburger">&#9776;</label>
        <input type="checkbox" id="hamburger" />
        <ul>
            <li><Link to={SEARCH}>Search</Link></li>

            <li><Link to={{
                pathname: INVOICE,
                invoice: { readOnly: false }
            }}>Create</Link></li>

            <li><span style={{color: "LightGrey"}}>{props.authUser.email} </span>
                <LogoutButton />
            </li>
        </ul>
    </nav>
)

const NavigationNonAuth = () => (
    <div className={"ui container"}>
        <Login />
    </div>
)

export default Navigation
