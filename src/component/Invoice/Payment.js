import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import { clone, sumArr, formatCurrency, range } from '../../constant/util'
import styles from './Payment.module.scss'
import {
    lineItemInitState,
    invoiceInitState,
    layoutInitState,
    resetPayment,
    queryLayout,
    onChangeEvent,
} from '.'

const Line = (props) => {
    const isBeforeLastLine = !props.readOnly && (props.index + 2 === props.last)
    const isLastLine = !props.readOnly && (props.index + 1 === props.last)

    return (
        <div className={styles.lineItem}>
            <div>
                {!props.readOnly &&
                    <input name="date" type="text" value={props.date}
                        onChange={props.changeLine(props.index)}
                    />}
            </div>
            <div>
                {/* // IIFE
                 {
                   (() => {
                       if (conditionOne)
                          return <span>One</span>
                       if (conditionTwo)
                          return <span>Two</span>
                       else (conditionOne)
                          return <span>Three</span>
                   })()
                }
                */}
                {
                    (() => {
                        if (props.readOnly)
                            return <input name="description" readOnly />
                        else
                            return <textarea rows="1"
                                name="description"
                                value={props.description}
                                onChange={props.changeLine(props.index)} />
                    })()
                }
            </div>
            <div /*dangerouslySetInnerHTML={{
                __html: '<sup>1</sup>&frasl;<sub>2</sub>' }}*/>
                {!props.readOnly &&
                    <input name="quantity" value={props.quantity}
                        onChange={props.changeLine(props.index)}
                        {...isBeforeLastLine && {
                            onFocus: props.deleteDuplicateHandler(props.index + 1)
                        }}
                    />}
            </div>
            <div>
                {!props.readOnly &&
                    <input name="priceFormat" value={props.priceFormat || ''}
                        onChange={props.changeLine(props.index)}
                        {...isLastLine && { onFocus: props.addHandler(props.index) }}
                    />}
            </div>
            <div>
                {!props.readOnly &&
                    <DeleteIcon className={`no-print ${styles.deleteItem}`}
                        onClick={props.deleteHandler(props.index)} />}
            </div>
            <div>
            </div>
        </div>
    )
}
Line.propTypes = {
    index: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default class extends Component {

    state = {
        ...invoiceInitState,
        // selected invoice
        ...this.props.location.invoice,
        ...layoutInitState,
    }

    saveInvoice = () => {
        const items =
            clone(this.state.lineItems)
                .map(item => {
                    delete item['priceFormat']
                    return item
                })

        const invoice = {
            customer: this.state.customer,
            category: this.state.category,
            lineItems: items,
            payment: this.state.payment,
            tag: this.state.tag,
            notes: this.state.notes,
            extraNote: this.state.extraNote,
            mainHeader: this.state.mainHeader
        }

        const firebaseSave = (id, invoice) => {
            this.props.firebase
                .invoice(id)
                .set({ ...invoice })
                .catch(error =>
                    console.log(error + " in invoice " +
                        id + " " + invoice.customer))
        }

        // validation
        if (!(this.state.customer.length > 0 &&
            this.state.lineItems.length > 0 &&
            this.state.category.length > 0)) {
            console.log("can not save empty invoice")
            return false
        }

        if (window.confirm("save invoice " + invoice.customer)) {
            let id = this.state.id
            if (!id) {
                id = new Date().getTime().toString()
                this.setState({ id: id })
            }
            firebaseSave(id, invoice)
            console.log("saved " + id + " " + invoice.customer)
        }
    }

    removeInvoice = () => {
        const firebaseRemove = (id) => {
            this.props.firebase
                .invoice(id)
                .remove()
                .catch(_error => console.log("cannot remove invoice " + id))
        }

        const id = this.state.id
        if ((id.length > 0) &&
            window.confirm("remove invoice id " + id)) {
            firebaseRemove(id)
            console.log("removed " + id)
        }
    }

    componentDidMount() {
        const setStatePriceForm = () => {
            this.setState(state => {
                state.lineItems.map(item => {
                    //^[0-9]+$/.test(price)
                    item.priceFormat = formatCurrency(item.price)
                    return (item.priceFormat)
                })
                return state; // should return updated state
            })
        }

        queryLayout(this)
        setStatePriceForm()
    }
    componentWillUnmount() {
        this.props.firebase.invoice().off()
        this.props.firebase.invoices().off()
        this.props.firebase.layout().off()
    }

    onChangeCategory = (event) => {
        //console.log(event.target.name + " = " + event.target.value)
        let item = this.state.lineItems[0] || lineItemInitState
        const category = event.target.value
        item.description = category && this.state.categories && this.state.categories[category].description
        const items = [item, ...this.state.lineItems.slice(1)]
        this.setState({ lineItems: items })
        onChangeEvent(this, event)
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
    onAddLine = (elementIndex) => (_event) => {
        const items = (!this.state.lineItems) ? lineItemInitState :
            this.state.lineItems[elementIndex]
        this.setState({
            lineItems: this.state.lineItems.concat([{
                ...items
            }])
        })
    }

    onDeleteLine = (elementIndex) => (_event) => {
        this.setState({
            lineItems: this.state.lineItems.filter((_item, i) => {
                return elementIndex !== i
            })
        })
    }
    onDeleteDuplicateLine = (elementIndex) => (event) => {
        if (this.state.lineItems[elementIndex] &&
            this.state.lineItems[elementIndex - 1] && (
                this.state.lineItems[elementIndex].date ===
                this.state.lineItems[elementIndex - 1].date)) {
            this.onDeleteLine(elementIndex)(event)
        }
    }

    goToList = () => {
        // this.state.id &&
        //     this.state.query_key &&
        //     this.state.query_val &&
        // this.props.history.push(
        //     {
        //         pathname: LIST,
        //         state: {
        //             query_key: this.state.query_key,
        //             query_val: this.state.query_val,
        //         }
        //     })
    }

    onSave = (event) => {
        event.preventDefault()
        this.saveInvoice()
    }

    onCopy = (event) => {
        event.preventDefault()
        this.setState({ id: '' })
    }

    onRemove = (event) => {
        event.preventDefault()
        this.removeInvoice()
        this.goToList()
    }

    render() {
        const items = this.state.lineItems
        const first = items.length > 0 && this.state.caption &&
            this.state.caption[0] && this.state.caption[0] === 'Date:' &&
            (items[items.length - 1].date.includes("20") ?
                this.state.caption[0] + " " +
                items[this.state.lineItems.length - 1].date :
                this.state.tag)

        const category = this.state.categories && this.state.category &&
            this.state.categories[this.state.category]
        const note = category && this.state.categories[this.state.category].note
        const column = category && this.state.categories[this.state.category].column

        const total = formatCurrency(
            sumArr(
                items.map(item => {
                    return parseFloat(item.price)
                })))

        const totalRows = 11

        const completeInvoice =
            this.state.customer.length > 0 &&
            this.state.lineItems.length > 0

        return (
            <div className={styles.invoice}>
                <div className={styles.headers}>
                    {/*{JSON.stringify(this.state.mainHeader)}*/}
                    {this.state.head &&
                        <input type="text" name="mainHeader"
                            className={styles.major}
                            value={this.state.mainHeader || this.state.head[0]}
                            onChange={(e) => { onChangeEvent(this, e) }} />}
                    {this.state.head &&
                        this.state.head.slice(1).map((r, i) =>
                            /*
                            * Conditional tag attribute
                            *   <Button {...(condition ? { bsStyle: 'success' } : {})} />
                            * */
                            <div {...
                                (i === 1 ? { className: styles.label } :
                                    {})}
                                key={r}>{r}
                            </div>)}
                </div>
                <span className={`${styles.mainTitle} ${styles.controls}`}>
                    {/* main title */}
                    {this.state.title && this.state.title}
                    {/* categories dropdown */}
                    <span className={"no-print"}>
                        {/* categories dropdown */}
                        <select name="category"
                            value={this.state.category}
                            onChange={this.onChangeCategory}>
                            <option />
                            {Object.keys(this.state.categories)
                                .sort((a, b) => a.length > b.length)
                                .map(function (category) {
                                    return (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>)
                                })}
                        </select>
                    </span>
                    {/* submit buttons */}
                    <span className={`no-print ${styles.invoiceId}`}>
                        {this.state.id && !isNaN(parseInt(this.state.id)) &&
                            (new Date(parseInt(this.state.id))).toString().substring(0, 21)}
                    </span>
                    {completeInvoice &&
                        <button className={`no-print`}
                            style={{ background: 'azure' }}
                            onClick={this.onSave}>
                            Save
                    </button>}
                    {this.state.id &&
                        <React.Fragment>
                            <button className={`no-print`}
                                style={{ background: 'lightyellow' }}
                                onClick={this.onCopy}>
                                Copy
                            </button>
                            <button className={`no-print`}
                                style={{ background: 'bisque' }}
                                onClick={this.onRemove}>
                                Remove
                            </button>
                        </React.Fragment>}
                </span>
                <div className={styles.rule} />

                <div className={styles.tableCaption}>
                    {first &&
                        <div className={styles.key}>
                            <span className={styles.value}>{first}</span>
                        </div>}
                    <div className={styles.key}>
                        {this.state.caption && this.state.caption[1]}
                        <span>  </span>
                        <input name="customer" value={this.state.customer}
                            className={`${styles.value} ${styles.name}`}
                            style={{ width: "21em" }}
                            onChange={(e) => { onChangeEvent(this, e) }} />

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
                                changeInvoice={(e) => { onChangeEvent(this, e) }}
                                deleteHandler={this.onDeleteLine}
                                deleteDuplicateHandler={this.onDeleteDuplicateLine} />
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
                                    deleteHandler={f => f}
                                    deleteDuplicateHandler={f => f}
                                />)}
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
                            onChange={(e) => { onChangeEvent(this, e) }} />
                    </div>

                    {/* payment */}
                    {this.state.segment.radio &&
                        <div className={styles.valueTable}>
                            {this.state.id &&
                                <div style={{
                                    // WebkitFilter: 'blur(1px) saturate(2)',
                                    WebkitTransform: "rotate(-10deg)",
                                    position: 'absolute',
                                    left: '100px',
                                    fontFamily: "Arial, sans-serif",
                                    transform: "rotate(-10deg)",
                                    fontSize: "3.6em",
                                    color: "#c00",
                                    opacity: "0.4",
                                    textShadow: "0 0 2px #c00",
                                    boxShadow: "0 0 2px #c00",
                                }}>PAID
                        </div>}
                            <div className={styles.title}
                                onClick={
                                    //this.resetPayment
                                    (e) => { resetPayment(this, e) }
                                }>
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
                                            onChange={(e) => { onChangeEvent(this, e) }} />
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
                            onChange={(e) => { onChangeEvent(this, e) }} />
                        notes:
                        <textarea rows="1" name="notes" value={this.state.notes}
                            onChange={(e) => { onChangeEvent(this, e) }} />
                    </div>
                </form>
            </div>
        )
    }
}
