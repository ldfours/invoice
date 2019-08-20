import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <button type="button" className="ui right floated button"
          onClick={firebase.doSignOut}>
    Logout
  </button>
);

export default withFirebase(SignOutButton);
