import React, { Component } from 'react'
import { MdAddCircle as AddIcon } from 'react-icons/md'
import uuidv4 from 'uuid/v4'

import { withFirebase } from '../Firebase';
import { clone, sumArr, formatCurrency, now } from '../../constant/util'
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
  date: '', quantity: '', price: 0.00
}

class InvoiceBase extends Component {

  state = {
    // initial invoice
    id: '',
    description: '',
    created: '',
    customer: '',
    payment: '',
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
    category: ''
  };

  // db
  queryLayout = () => {
    this.props
      .firebase.layout()
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
          delete item['description']
          return item
        })

    const invoice = {
      created: now(),
      customer: this.state.customer,
      description: this.state.description,
      id: uuidv4(),
      lineItems: items,
      payment: "",
      notes: "",
      treatment: ""
    }
    //console.log(invoice)

    if (this.state.id === ''
      && this.state.customer.length > 0
      && this.state.lineItems.length > 0
      && this.state.description.length > 0) {
      console.log("push")
    }

    /*
        event.preventDefault()
        this.props.firebase.invoice()
          .push({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
          })
          .catch(error => console.log(error))
    */
  }

  // lifecycle events
  componentDidMount() {
    const setStatePriceForm = () => {
      this.setState(state => {
        state.lineItems.map(item =>
          //^[0-9]+$/.test(price)
          item.priceFormat = formatCurrency(item.price))
        return state; // should return updated state
      });
    }

    this.queryLayout()
    setStatePriceForm()
  }

  componentWillUnmount() {
    this.props.firebase.invoice().off()
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
    this.setState({ [event.target.name]: event.target.value })
  }

  onChangeLine = (elementIndex) => (event) => {
    const hook = (item, target) => {
      if (target.name === "priceFormat") {
        //target.value = parseFloat(target.value)
        const match = target.value.match(/^\$([0-9]+)\.00$/)
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
  onInputFocus = (event) => {
    event.target.select()
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
  onAddLine = (event) => {
    const quantity =
      (this.state.description === Object.keys(this.state.category)[4]) ? "min" : "hr" //slp

    this.setState({
      lineItems: this.state.lineItems.concat([{
        ...lineItemsInitState,
        description: this.state.description,
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
    this.saveInvoice()
  }

  render() {
    const date = this.state.lineItems.length > 0 &&
      this.state.lineItems[this.state.lineItems.length - 1].date

    const note =
      this.state.category && this.state.description &&
      this.state.category[this.state.description] &&
      this.state.category[this.state.description].note

    const total = formatCurrency(
      sumArr(
        this.state.lineItems.map(item => {
          return parseInt(item.price)
        })))

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
                  {} ))}
                 key={r}>{r}
            </div>)}

        </div>
        {/* "Invoice" title */}
        <div className={styles.mainTitle}>
          {this.state.title && this.state.title}
        </div>
        <div className={styles.rule} />

        {/* table caption */}
        <div className={styles.description}>
          <div className={styles.key}>
            {this.state.caption.length > 0 && `${this.state.caption[0]}:`}
            <span className={styles.value}> {date}</span>
          </div>
          <div className={styles.value} />
          <div className={styles.key}>
            {this.state.caption && `${this.state.caption[1]}:`}
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
          <div className={styles.gridTable}>
            <div className={`${styles.row} ${styles.header}`}>
              {this.state.column.map &&
              this.state.column.map(col =>
                <div key={col} name={"col"}>{col}</div>)}
            </div>

            <div>
              {/* table rows */}
              {this.state.lineItems.map((item, i) => (
                <Line key={i} index={i}
                      {...item}
                      description={this.state.description}
                      categories={Object.keys(this.state.category)}
                      addHandler={this.onAddLine}
                      changeLine={this.onChangeLine}
                      changeInvoice={this.onChangeInvoice}
                      focusHandler={this.onInputFocus}
                      deleteHandler={this.onDeleteLine} />
              ))}
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
          </div>

          {/* bottom notes */}
          <div className={`${styles.note}`}>
            {note &&
            <div className={`${styles.text} ${styles.hangingIndent}`}>
              {note[0]}:<span> </span>
              {note.slice(1, note.length)
                .map((line, i) =>
                  <span key={i}>{line}
                    {line.length > 0 && i < note.length - 2 && ". "}
                </span>)}
            </div>}
          </div>

          {/* payment */}
          {this.state.segment.radio &&
          <div className={styles.valueTable}>
            <div className={styles.title}>
              {this.state.segment.title && `${this.state.segment.title}:`}
            </div>
            {this.state.segment.radio.map(r =>
              <React.Fragment key={r}>
                <div className={`${styles.label}`}>
                  <input className={styles.radio}
                         type="radio"
                         name={this.state.segment.title}
                         value={r}
                         onChange={this.onChangeLine()} />
                </div>
                <div className={styles.label}>{r}</div>
              </React.Fragment>
            )}
          </div>}

        </form>

        <div className={"no-print"}>
          {/* add button */}
          <div className={styles.lineItems}>
            <div className={styles.addItem}>
              <button type="button" onClick={this.onAddLine}>
                <AddIcon size="1.25em" className={styles.addIcon} />Add
              </button>
            </div>
          </div>
          {/* submit button */}
          <div className={styles.major}>
            <button className={styles.submit}
                    onClick={this.onSave}>
              Save {this.state.id}
            </button>
          </div>
        </div>

        <div className={styles.footer}>
        </div>
      </div>
    )
  }
}

export default withFirebase(InvoiceBase)
