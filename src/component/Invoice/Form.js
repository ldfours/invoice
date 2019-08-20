import React, { Component } from 'react'
import { formatCurrency } from '../../constant/util'
import Line from './Line'
import styles from './Form.module.scss'

export default class extends Component {

  render() {
    const { lineItems, total, text, ...rest } = this.props
    const totalFormatted = formatCurrency(total)

    return (
      <form>
        <div className={styles.gridTable}>
          <div className={`${styles.row} ${styles.header}`}>
            <div name={"date"}>Date</div>
            <div name={"description"}>Description</div>
            <div name={"quantity"}>Hours</div>
            <div name={"price"}>Total</div>
          </div>

          <div>
            {lineItems.map((item, i) => (
              <Line key={i} index={i}
                    date={item.date}
                    description={item.description}
                    quantity={item.quantity}
                    price={item.price}
                    {...rest}
              />
            ))}
            <div className={styles.totalLine}>
              <div />
              <div />
              <div style={{ textAlign: "center" }}>
                <strong>Total</strong>
              </div>
              <div className={styles.text}
                   style={{ textAlign: "left" }}>{totalFormatted}</div>
            </div>
          </div>
        </div>

        <div className={`${styles.note}`}>
          {text &&
          <div className={`${styles.text} ${styles.hangingIndent}`}>
            {text[0]}:<span> </span>
            {text
              .slice(1, text.length)
              .map((line, i) =>
                <span key={i}
                      className={`${styles.text}`}>
                  {line}
                  {line.length > 0 && i < text.length - 2 && ". "}
                </span>)}
          </div>}
        </div>


        < div className={styles.valueTable}>
          <div className={`${styles.label}`}>
            <input className={styles.radio}
                   type="radio" name="payment" value={"cash"}
                   onChange={this.props.changeHandler()} />
          </div>
          <div className={styles.label}>Cash</div>

          <div className={styles.label}>
            <input className={`${styles.radio}`}
                   type="radio" name="payment" value={"cheque"}
                   onChange={this.props.changeHandler()} />
          </div>

          <div className={styles.label}>Cheque</div>
        </div>
      </form>
    )
  }
}
