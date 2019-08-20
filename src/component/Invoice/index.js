import React, { Component } from 'react'
import { MdAddCircle as AddIcon } from 'react-icons/md'

import Header from './Form'
/*
* SCSS Modules are great
* for ensuring there are no naming conflicts in projects with multiple
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

/*
const invoice Text =
  process.env.REACT_APP_INVOICE_TEXT ?
    stringToObject(process.env.REACT_APP_INVOICE_TEXT, 6) : {}
*/
import invoiceText from '../../invoiceText'

export default class Invoice extends Component {

  /*
   * Set the current state
   * using:
   * 1) readOnly flag
   * 2) properties of the selected invoice
   * 3) values of the initial state -
   * (defined in .env config file)
   * */
  state = {
    readOnly: false,
    description: '',
    created: '',
    customer: '',
    lineItems: [
      {
        date: '',
        description: '',
        quantity: 0,
        price: 0.00
      }
    ],
    total: 0.00,
    id: '',

    ...this.props.location.invoice,

    heading1: process.env.REACT_APP_HEADING1,
    heading2: process.env.REACT_APP_HEADING2,
    heading3: process.env.REACT_APP_HEADING3,
    heading4: process.env.REACT_APP_HEADING4,
    customerAttribution: process.env.REACT_APP_CUSTOMER_ATTRIBUTION,
    invoiceText: invoiceText,
  };

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

  /* TODO
  // It is sometimes convenient for users to have an input automatically
  // select its entire value whenever it receives focus.
  handleFocusSelect = (event) => {
    event.target.select()
  }
  handleInvoiceChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  */

  handleLineItemChange = (elementIndex) => (event) => {
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return { ...item, [event.target.name]: event.target.value }
    })
    this.setState({ lineItems })
  }


  /*
  * When the “Add Line Item” button is clicked,
  * the onClick() event calls the handleAddLineItem() function.
  * A new line item is added to the Invoice
  * by adding a new line item object to the component state’s lineItems array.
  * The Array concat() method is used to create a new array
  * based on the current lineItems array.
  * It concatenates a second array containing a new blank line item object.
  * setState() is then called to update the state.
  * */
  handleAddLineItem = (event) => {
    this.setState({
      lineItems: this.state.lineItems.concat(
        [{
          date: '', description: '', quantity: 0, price: 0
        }]
      )
    })
  }

  /*
  * The Array filter() method is used to return a new array
  * that omits the object at the i‘th position of the original array.
  * this.setState() updates the component state.
  * */
  handleRemoveLineItem = (elementIndex) => (event) => {
    this.setState({
      lineItems: this.state.lineItems.filter((item, i) => {
        return elementIndex !== i
      })
    })
  }

  handleSubmit = () => {
    alert('Not implemented')
  }

  render() {
    const date = this.state.lineItems.length > 0 &&
      this.state.lineItems[this.state.lineItems.length - 1].date

    const text = this.state.invoiceText &&
      this.state.description &&
      this.state.invoiceText[this.state.description]

    return (
      <div className={styles.invoice}>
        <div className={styles.addresses}>
          <div className={styles.major}>{this.state.heading1}</div>
          <div className={styles.label}>{this.state.heading2}</div>
          <div>{this.state.heading3}</div>
          <div>{this.state.heading4}</div>
        </div>

        <h2>Invoice</h2>
        <div className={styles.rule} />

        <div className={styles.description}>
          <div className={styles.key}>Date:
            <span className={styles.value}> {date}</span>
          </div>
          <div className={`${styles.value}`} />
          <div className={styles.key}>
            {this.state.customerAttribution &&
            `${this.state.customerAttribution}:`}
            <span className={`${styles.value} ${styles.name}`}><span>  </span>
              {this.state.customer}</span>
          </div>
          <div className={styles.value} />
        </div>

        <Header
          lineItems={this.state.lineItems}
          total={this.state.total}
          text={text}
          readOnly={this.state.readOnly}
          changeHandler={this.handleLineItemChange}
          //focusHandler={this.handleFocusSelect}
          deleteHandler={this.handleRemoveLineItem} />

        {this.state.readOnly || (
          <div>
            <div className={styles.lineItems}>
              <div className={styles.addItem}>
                <button type="button" onClick={this.handleAddLineItem}>
                  <AddIcon size="1.25em" className={styles.addIcon} />Add
                </button>
              </div>
            </div>
            <div className={styles.major}>
              <button className={styles.submit}
                      onClick={this.handleSubmit}>Submit
              </button>
            </div>
          </div>)}

        <div className={styles.footer}>
        </div>
      </div>
    )
  }
}
