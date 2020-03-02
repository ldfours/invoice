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
        <span style={{color: "rgb(0,72,186)"}} className="no-print"
            onClick={logOut}>
            {/* {props.label} */}
            <LogoutIcon size={24} />
        </span>
    )
}

export default compose(
    withRouter,
    withFirebase,
)(LogoutLink)
