import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

class Firebase {
  constructor() {
    try {
      app.initializeApp(config)
      // /* eslint no-unused-vars: "off" */
      //const features = ['auth', 'database', 'messaging', 'storage']
      //  .filter(feature => typeof app[feature] === 'function')
      //console.log("firebase SDK loaded with "  + features.join(', '))
      this.auth = app.auth()
      this.db = app.database()
    } catch (e) {
      console.error(e)
    }
  }

  // login
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  // logout
  doSignOut = () => this.auth.signOut()

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.db.ref(`user/${authUser.uid}`)
          .once('value')
          .then(() => {
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
            }
            this.auth.userKey = `user/${authUser.uid}`
            next(authUser)
          })
      } else {
        fallback()
      }
    })

  layout = () => {
    //console.log(this.auth.userKey)
    return this.db.ref(`${this.auth.userKey}/layout`)
  }
  invoices = () => this.db.ref(`${this.auth.userKey}/invoice`)
  invoice = id => this.db.ref(`${this.auth.userKey}/invoice/${id}`)
}

export default Firebase
