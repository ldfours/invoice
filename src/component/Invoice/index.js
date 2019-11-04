import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'

import { withFirebase } from '../Firebase';
import { clone, sumArr, formatCurrency, now, range } from '../../constant/util'
import Line from './Line'

/*
* SCSS Modules for ensuring there are no naming conflicts in projects with multiple
* Components that might use the same class names.
* The ComponentName.modules.scss file looks and works just like any
* normal SCSS file except the classes are invoked in JSX slightly differently.
* Notice the import line: import styles from ...
* To apply a give .example style to a given component,
* you would refer to styles.example in the className prop:
*    <ExampleComponent className={styles.example}>
* For multiple and/or conditional styles,
* ES6 strings + interpolation can be used to add additional expressions:
     <ExampleComponent className={`${styles.example} ${styles.anotherExample}`} />
*/
import styles from './index.module.scss'

const lineItemsInitState = {
    date: '', description: '', quantity: '', price: 0.00
}

class InvoiceBase extends Component {

    state = {
        // initial invoice
        id: '',
        category: '',
        created: '',
        customer: '',
        payment: '',
        tag: '',
        notes: '',
        extraNote: '',
        lineItems: [lineItemsInitState],

        // selected invoice
        ...this.props.location.invoice,

        // layout
        title: '',
        caption: '',
        column: '',
        head: '',
        segment: '',
        text: '',
        categories: ''
    };

    // db
    // https://firebase.google.com/docs/database/web/read-and-write
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    queryLayout = () => {
        this.props.firebase
            .layout()
            .once('value', snapshot => {
                const obj = snapshot.val()
                if (obj) {
                    Object.keys(obj).map(key => {
                            this.setState({ [key]: obj[key] })
                            return key
                        }
                    )
                }
            })
    }

    saveInvoice = () => {
        const items =
            clone(this.state.lineItems)
                .map(item => {
                    delete item['priceFormat']
                    return item
                })

        const invoice = {
            created: now(),
            customer: this.state.customer,
            category: this.state.category,
            lineItems: items,
            payment: this.state.payment,
            tag: this.state.tag,
            notes: this.state.notes,
            extraNote: this.state.extraNote
        }

        const firebaseSave = (id, invoice, logInvoiceName) => {
            this.props.firebase
                .invoice(id)
                .set({ ...invoice })
                .catch(error => console.log(error + " in invoice " + logInvoiceName))
        }

        // validation
        if (!(this.state.customer.length > 0 &&
                this.state.lineItems.length > 0 &&
                this.state.category.length > 0)) {
            console.log("can not save empty invoice")
            return false
        }

        const logInvoiceName = this.state.id.substring(0, 6) + " " + invoice.customer
        if (window.confirm("save invoice " + logInvoiceName)) {
            const id = (this.state.id.length > 0) ? this.state.id : uuidv4()
            firebaseSave(id, invoice)
            console.log("saved " + logInvoiceName/* + " " + JSON.stringify(invoice)*/)
        }
    }

    removeInvoice = () => {
        const firebaseRemove = (id) => {
            this.props.firebase
                .invoice(id)
                .remove()
                .catch(error => console.log("cannot remove invoice " + id))
        }

        const id = this.state.id
        const logInvoiceName = id.substring(0, 6)
        if ((id.length > 0) &&
            window.confirm("remove invoice " + logInvoiceName)) {
            firebaseRemove(id)
            console.log("removed " + logInvoiceName)
        }
    }

    // lifecycle events
    componentDidMount() {
        const setStatePriceForm = () => {
            this.setState(state => {
                state.lineItems.map(item => {
                    //^[0-9]+$/.test(price)
                    item.priceFormat = formatCurrency(item.price)
                    return (item.priceFormat)
                })
                return state; // should return updated state
            });
        }

        this.queryLayout()
        setStatePriceForm()
    }

    componentWillUnmount() {
        this.props.firebase.invoices().off()
    }

    /*
    * Each form input element is created as a Controlled Component.
    * This means that React completely controls the element’s state
    * (including whatever value is currently being stored by the form element Component)
    * rather than leaving this to the element itself.
    * To accomplish this, each input specifies an onChange event handler whose job
    * is to update the component’s state every time a user changes the value of an input.
    * */

    /*
    * When a user types a value into an input, the onChange event fires
    * and the handleLineItemChange(elementIndex) function is called.
    * The Invoice’s state is updated to reflect the input’s latest value.
    *
    * The handleLineItemChange() handler accepts an elementIndex param
    * that corresponds to the line item’s position in the lineItems array.
    * As an event handler, the function is also passed an event object.
    *
    * The Invoice’s state is updated by creating a new version of the lineItems array.
    * The new version features a line item object and
    * its property (date, description, quantity, price)
    * modified to correspond to the changed input’s new value.
    * The this.setState() function is then called to update
    * the Invoice component with the updated state.
    *
    * The implementation works because the name of each form input input
    * (available as event.target.name)
    * corresponds to a the property name of the line item.
    */
    onChangeInvoice = (event) => {
        //console.log(event.target.name + " = " + event.target.value)
        this.setState({ [event.target.name]: event.target.value })
    }

    resetPayment = (event) => {
        this.setState({ payment: '' })
    }

    onChangeLine = (elementIndex) => (event) => {
        const hook = (item, target) => {
            if (target.name === "priceFormat") {
                //target.value = parseFloat(target.value)
                const match = target.value.match(/^\$([0-9]+\.[0-9][0-9])$/)
                if (match) {
                    const newPrice = match[1]
                    item.price = newPrice
                }
            }
        }

        let lineItems = this.state.lineItems.map((item, i) => {
            // if its not the current index, means some other element changed
            if (elementIndex !== i) return item
            hook(item, event.target)
            // merge changed element with the current line
            return { ...item, [event.target.name]: event.target.value }
        })
        this.setState({ lineItems })
    }

    // It is sometimes convenient for users to have an input automatically
    // select its entire value whenever it receives focus.
    /*
    onInputFocus = (event) => {
      event.target.select()
    }
    */

    /*
    * When the "Add Line Item" button is clicked,
    * the onClick() event calls the handleAddLineItem() function.
    * A new line item is added to the Invoice
    * by adding a new line item object to the component state’s lineItems array.
    * The Array concat() method is used to create a new array
    * based on the current lineItems array.
    * It concatenates a second array containing a new blank line item object.
    * setState() is then called to update the state.
    * */
    onAddLine = (event) => {
        let quantity = ''
        this.setState({
            lineItems: this.state.lineItems.concat([{
                ...lineItemsInitState,
                category: this.state.category,
                quantity: quantity
            }])
        })
    }

    /*
    * The Array filter() method is used to return a new array
    * that omits the object at the i‘th position of the original array.
    * this.setState() updates the component state.
    * */
    onDeleteLine = (elementIndex) => (event) => {
        this.setState({
            lineItems: this.state.lineItems.filter((item, i) => {
                return elementIndex !== i
            })
        })
    }

    onSave = (event) => {
        event.preventDefault()
        this.saveInvoice()
    }

    onRemove = (event) => {
        event.preventDefault()
        this.removeInvoice()
    }

    render() {
        const first = this.state.category === " " ?
            this.state.tag :
            this.state.lineItems.length > 0 &&
            this.state.caption[0] + " " +
            this.state.lineItems[this.state.lineItems.length - 1].date

        const note =
            this.state.categories && this.state.category &&
            this.state.categories[this.state.category] &&
            this.state.categories[this.state.category].note

        const column =
            this.state.categories && this.state.category &&
            this.state.categories[this.state.category] &&
            this.state.categories[this.state.category].column

        const total = formatCurrency(
            sumArr(
                this.state.lineItems.map(item => {
                    return parseFloat(item.price)
                })))

        const totalRows = 11

        const completeInvoice =
            this.state.customer.length > 0 &&
            this.state.lineItems.length > 0

        return (
            <div className={styles.invoice}>
                <div className={styles.addresses}>
                    {/*{JSON.stringify(this.state.lineItems)}*/}
                    {this.state.head &&
                    this.state.head.map((r, i) =>
                        /*
                        * Conditional tag attribute
                        *   <Button {...(condition ? { bsStyle: 'success' } : {})} />
                        * */
                        <div {...
                            (i === 0 ? { className: styles.major } :
                                (i === 1 ? { className: styles.label } :
                                    {}))}
                             key={r}>{r}
                        </div>)}

                </div>
                {/* "Invoice" title */}
                <div className={styles.mainTitle}>
                    {this.state.title && this.state.title}
                </div>
                <div className={styles.rule} />
                <div className={"no-print"}
                     style={{ textAlign: "center", border: 1 }}>
                    <select name="category"
                            value={this.state.category}
                            onChange={this.onChangeInvoice}>
                        {Object.keys(this.state.categories)
                            .map(function (categories) {
                                return (
                                    <option key={categories} value={categories}>
                                        {categories}</option>)
                            })}
                    </select>
                </div>

                {/* table caption */}
                <div className={styles.description}>
                    <div className={styles.key}>
                        {this.state.caption && `${this.state.caption[0]}` &&
                        <span className={styles.value}>{first}</span>}
                    </div>
                    <div className={styles.value} />
                    <div className={styles.key}>
                        {this.state.caption && `${this.state.caption[1]}`}
                        <span>  </span>
                        <input name="customer" value={this.state.customer}
                               className={`${styles.value} ${styles.name}`}
                               style={{ width: "21em" }}
                               onChange={this.onChangeInvoice} />

                    </div>
                    <div className={styles.value} />
                </div>

                <form>
                    {/* table header */}
                    <div className={`${styles.lineItem}`}>
                        {column && column.map &&
                        column.map(col =>
                            <div className={styles.header} key={col}
                                 name={"col"}>{col}</div>)}
                        <div />
                        <div />
                    </div>
                    <div>
                        {/* table rows */}
                        {this.state.lineItems.map((item, i) => (
                            <Line key={i} index={i}
                                  {...item}
                                  category={this.state.category}
                                  categories={Object.keys(this.state.categories)}
                                  last={this.state.lineItems.length}
                                // focusHandler={this.onInputFocus}
                                  addHandler={this.onAddLine}
                                  changeLine={this.onChangeLine}
                                  changeInvoice={this.onChangeInvoice}
                                  deleteHandler={this.onDeleteLine} />
                        ))}
                        {/* read-only rows */}
                        {range(0, totalRows - this.state.lineItems.length)
                            .map(n =>
                                <Line key={n} readOnly={true}
                                      category={''}
                                      categories={[]}
                                      addHandler={f => f}
                                      changeLine={this.onChangeLine}
                                      changeInvoice={f => f}
                                      deleteHandler={f => f} />)}
                        {/* total row */}
                        <div className={styles.totalLine}>
                            <div />
                            <div />
                            <div style={{ textAlign: "center" }}>
                                <strong>Total</strong>
                            </div>
                            <div className={styles.text}
                                 style={{ textAlign: "left" }}>{total}</div>
                        </div>
                    </div>

                    {/* bottom notes */}
                    <div className={`${styles.note} ${styles.text}`}>
                        {note &&
                        <div className={`${styles.hangingIndent}`}>
                            {note.map((line, i) =>
                                <span key={i}>{line} </span>)}
                        </div>}
                        <input type="text" name="extraNote"
                               value={this.state.extraNote}
                               onChange={this.onChangeInvoice} />
                    </div>

                    {/* payment */}
                    {this.state.segment.radio &&
                    <div className={styles.valueTable}>
                        <div className={styles.title}
                             onClick={this.resetPayment}>
                            {this.state.segment.title && `${this.state.segment.title}:`}
                        </div>
                        {this.state.segment.radio.map(r =>
                            <React.Fragment key={r}>
                                <div className={`${styles.label}`}>
                                    <input className={`${styles.radio}`}
                                           type="radio"
                                           name="payment"
                                           value={r}
                                           checked={this.state.payment === r}
                                           onChange={this.onChangeInvoice} />
                                </div>
                                <div className={styles.label}>
                                    {r === "Cheque" ? "Cheque/email transfer" : r}
                                </div>
                            </React.Fragment>
                        )}
                    </div>}
                    <div className={`no-print ${styles.row}`}>
                        tag:
                        <input type="text" name="tag" value={this.state.tag}
                               onChange={this.onChangeInvoice} />
                        notes:
                        <textarea rows="1" name="notes" value={this.state.notes}
                                  onChange={this.onChangeInvoice} />
                    </div>
                </form>

                <div className={"no-print"}>
                    {/* submit buttons */}
                    <div className={styles.major}>
                        {completeInvoice &&
                        <button className={styles.submit} onClick={this.onSave}>
                            Save
                        </button>}
                        {this.state.id &&
                        <button className={styles.submit}
                                onClick={this.onRemove}>
                            Remove {this.state.id.substring(0, 6)}
                        </button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default withFirebase(InvoiceBase)
