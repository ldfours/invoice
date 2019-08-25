import React from 'react'
import PropTypes from 'prop-types'
import { MdCancel as Delete } from 'react-icons/md'

import styles from './Line.module.scss'

const Line = (props) => {
  return (
    <div className={`${styles.lineItem} ${styles.text}`}>
      <div>
        <input name="date" type="text" value={props.date}
               onChange={props.changeLine(props.index)} />
      </div>
      <div>
        <select name="description"
                value={props.description}
                onChange={props.changeInvoice}>
          {['', ...props.categories]
            .map(function (category) {
              return (<option key={category} value={category}>
                {category}</option>)
            })}
        </select>
      </div>
      <div>
        <input name="quantity" value={props.quantity}
               onChange={props.changeLine(props.index)} />
      </div>
      <div className={styles.currency}>
        <input name="priceFormat" value={props.priceFormat || ''}
          //onFocus={props.focusHandler}
               onChange={props.changeLine(props.index)} />
      </div>
      <div style={{ borderLeft: 0 }}>
        <button type="button"
                className={styles.deleteItem}
                onClick={props.deleteHandler(props.index)}>
          <Delete className={"no-print"} />
        </button>
      </div>
    </div>
  )
}
Line.propTypes = {
  index: PropTypes.number.isRequired,
  date: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Line
