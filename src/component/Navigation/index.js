// import { Link } from 'react-router-dom'
import React from 'react'

// import { SEARCH, INVOICE } from '../../constant/route'
import Login from '../Login'
import { AuthUserContext } from '../Session'
import LogoutButton from '../Logout'

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
    <span style={{ position: "absolute", top: "0", right: "0" }}>
        <LogoutButton label={props.authUser.email} />
    </span>
)

const NavigationNonAuth = () => (
    <div>
        <Login />
    </div>
)

export default Navigation
