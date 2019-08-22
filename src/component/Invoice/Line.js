import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import styles from './Line.module.scss'
import { formatCurrency } from '../../constant/util'

export default class extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    date: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  render() {

    const priceFormatted = formatCurrency(this.props.price)

    return (
      <div className={`${styles.lineItem} ${styles.text}`}>
        <div>
          <input name="date" type="text" value={this.props.date}
                 onChange={this.props.changeHandler(this.props.index)}
                 readOnly={this.props.readOnly} />
        </div>

        <div>
          <input name="description" type="text" value={this.props.description}
                 onChange={this.props.changeHandler(this.props.index)}
                 readOnly={this.props.readOnly} />
        </div>
        <div>
          <input name="quantity" value={this.props.quantity}
                 onChange={this.props.changeHandler(this.props.index)}
                 readOnly={this.props.readOnly} />
        </div>
        <div className={styles.currency}>
          <input name="price" value={priceFormatted}
                 onChange={this.props.changeHandler(this.props.index)}
                 readOnly={this.props.readOnly} />
        </div>
        {!this.props.readOnly ? (
            <div style={{ borderLeft: 0 }}>
              <button type="button"
                      className={styles.deleteItem}
                      onClick={this.props.deleteHandler(this.props.index)}>
                <DeleteIcon />
              </button>
            </div> ) :
          <div style={{ borderLeft: 0 }} />
        }
      </div>
    )
  }
}
