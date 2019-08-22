import React from 'react'
import PropTypes from 'prop-types'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import styles from './Line.module.scss'
import { formatCurrency } from '../../constant/util'

const Line = (props) => {

  const priceFormatted = formatCurrency(props.price)

  return (
    <div className={`${styles.lineItem} ${styles.text}`}>
      <div>
        <input name="date" type="text" value={props.date}
               onChange={props.changeHandler(props.index)}
               readOnly={props.readOnly} />
      </div>

      <div>
        <input name="description" type="text" value={props.description}
               onChange={props.changeHandler(props.index)}
               readOnly={props.readOnly} />
      </div>
      <div>
        <input name="quantity" value={props.quantity}
               onChange={props.changeHandler(props.index)}
               readOnly={props.readOnly} />
      </div>
      <div className={styles.currency}>
        <input name="price" value={priceFormatted}
               onChange={props.changeHandler(props.index)}
               readOnly={props.readOnly} />
      </div>
      {!props.readOnly ? (
          <div style={{ borderLeft: 0 }}>
            <button type="button"
                    className={styles.deleteItem}
                    onClick={props.deleteHandler(props.index)}>
              <DeleteIcon />
            </button>
          </div> ) :
        <div style={{ borderLeft: 0 }} />
      }
    </div>
  )
}

export default Line

Line.propTypes = {
  index: PropTypes.number.isRequired,
  date: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
