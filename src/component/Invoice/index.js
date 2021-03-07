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
    head: ['', '', '', ''],
    lineItems: [lineItemInitState],
}

export const onChangeEvent = (obj, event) => {
    //console.log(event.target.name + " = " + event.target.value)
    obj.setState({ [event.target.name]: event.target.value })
}

export const resetPayment = (obj, e) => {
    obj.setState({ payment: '' })
}

export default withFirebase(Payment)
