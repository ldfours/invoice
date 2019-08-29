import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    try {
      app.initializeApp(config)
      // /* eslint no-unused-vars: "off" */
      //const features = ['auth', 'database', 'messaging', 'storage']
      //  .filter(feature => typeof app[feature] === 'function')
      //console.log("firebase SDK loaded with "  + features.join(', '))
      this.auth = app.auth();
      this.db = app.database();
    } catch (e) {
      console.error(e);
    }
  }

  // login
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  // logout
  doSignOut = () => this.auth.signOut();

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.db.ref(`user/${authUser.uid}`)
          .once('value', /*snap => console.log('from db ', snap)*/)
          .then(() => {
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  layout = () => this.db.ref('layout')

  invoice = id => this.db.ref(`invoice/${id}`)
  invoices = () => this.db.ref('invoice')
}

export default Firebase;
