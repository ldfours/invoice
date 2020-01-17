import React from 'react'

import { withFirebase } from '../Firebase'
import { Link, withRouter } from "react-router-dom"
import { SEARCH } from '../../constant/route'
import { compose } from '../../constant/util'

const LogoutLink = (props) => {
    const logOut = () => {
        props.firebase.doSignOut()
        props.history.push({ pathname: SEARCH, })
    }

    return (
        <Link to={""} className="logout no-print"
              onClick={logOut}>
            Logout
        </Link>
    )
}

export default compose(
    withRouter,
    withFirebase,
)(LogoutLink)
