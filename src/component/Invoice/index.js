import { withFirebase } from '../Firebase'
import Payment from './Payment'

export const lineItemInitState = {
    date: '',
    description: '',
    quantity: '',
    price: 0.00,
    note: '',
}

export const invoiceInitState = {
    id: '',
    category: '',
    customer: '',
    payment: '',
    tag: '',
    notes: '',
    extraNote: '',
    mainHeader: '',
    lineItems: [lineItemInitState],
}

export const layoutInitState = {
    title: '',
    caption: '',
    column: '',
    head: '',
    segment: '',
    text: '',
    categories: ''
}

export const onChangeEvent = (obj, event) => {
    //console.log(event.target.name + " = " + event.target.value)
    obj.setState({ [event.target.name]: event.target.value })
}

// db
// https://firebase.google.com/docs/database/web/read-and-write
// https://firebase.google.com/docs/firestore/manage-data/add-data
export const queryLayout = (obj) => {
    obj.props.firebase
        .queryMany('layout')
        .once('value', snapshot => {
            const snap = snapshot.val()
            if (snap) {
                Object.keys(snap).map(key => {
                    obj.setState({ [key]: snap[key] })
                    return key
                })
            }
        })
}

export const resetPayment = (obj, e) => {
    obj.setState({ payment: '' })
}

export default withFirebase(Payment)
