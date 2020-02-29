import React from 'react'
import { FiLogOut as LogoutIcon } from "react-icons/fi"

import { withFirebase } from '../Firebase'
import { withRouter } from "react-router-dom"
import { SEARCH } from '../../constant/route'
import { compose } from '../../constant/util'

const LogoutLink = (props) => {
    const logOut = () => {
        props.firebase.doSignOut()
        props.history.push({ pathname: SEARCH, })
    }

    return (
        <LogoutIcon className="logout no-print"
            // color={"white"}
            onClick={logOut} />
    )
}

export default compose(
    withRouter,
    withFirebase,
)(LogoutLink)
