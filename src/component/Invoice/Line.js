import React from 'react'
import PropTypes from 'prop-types'

import { MdAddCircle as AddIcon } from 'react-icons/md'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import styles from './index.module.scss'

const Line = (props) => {
  return (
    <div className={styles.lineItem}>
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
      <div>
        <input name="priceFormat" value={props.priceFormat || ''}
          //onFocus={props.focusHandler}
               onChange={props.changeLine(props.index)} />
      </div>
      <div>
        {!props.readOnly &&
        <DeleteIcon className={`no-print ${styles.deleteItem}`}
                    onClick={props.deleteHandler(props.index)} />}
      </div>
      <div>
        {!props.readOnly && (props.index + 1 === props.last) &&
        <AddIcon className={`no-print ${styles.addItem}`}
                 onClick={props.addHandler} />}
      </div>
    </div>
  )
}
Line.propTypes = {
  index: PropTypes.number, //.isRequired,
  date: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Line
