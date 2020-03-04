// import { Link } from 'react-router-dom'
import React from 'react'

// import { SEARCH, INVOICE } from '../../constant/route'
import Login from '../Login'
import { AuthUserContext } from '../Session'
import LogoutButton from '../Logout'

const NavigationAuth = (props) => (
    <span style={{ position: "absolute", top: "0", right: "0" }}>
        <LogoutButton label={props.authUser.email} />
    </span>)

const NavigationNonAuth = () => <Login />

export default () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ?
                <NavigationAuth authUser={authUser} /> :
                <NavigationNonAuth />}
    </AuthUserContext.Consumer>)
