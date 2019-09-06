import React from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from "react-router-dom";
import { compose } from '../../constant/util';

const SignOutButton = (props) => {
  const logOut = () => {
    props.firebase.doSignOut()
    props.history.push({ pathname: "/", })
  }

  return (
    <button type="button" className="logout no-print"
            onClick={logOut}>
      Logout
    </button>
  )
}

export default compose(
  withRouter,
  withFirebase,
)(SignOutButton)
