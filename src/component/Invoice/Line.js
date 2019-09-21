import React from 'react'
import PropTypes from 'prop-types'

import { MdAddCircle as AddIcon } from 'react-icons/md'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import styles from './index.module.scss'

const Line = (props) => {
  const isAddLine = !props.readOnly && (props.index + 1 === props.last)

  return (
    <div className={styles.lineItem}>
      <div>
        {!props.readOnly &&
        <input name="date" type="text" value={props.date}
               onChange={props.changeLine(props.index)} />}
      </div>
      <div>
        {!props.readOnly ?
          <>
          <textarea rows="1" /*input type="text"*/
                    name="description" value={props.description}
                    onChange={props.changeInvoice}
                    list={"descriptionName"} />
          <datalist id="descriptionName"
                    value={props.description}>
            {[...props.categories]
              .map(function (category) {
                return (<option key={category} value={category}>
                  {category}</option>)
              })}
          </datalist>
          </> :
          <input name="description" readOnly styles={{ padding: 0 }} />}
      </div>
      <div /*dangerouslySetInnerHTML={{
          __html: '<sup>1</sup>&frasl;<sub>2</sub>' }}*/>
        {!props.readOnly &&
        <input name="quantity" value={props.quantity}
               onChange={props.changeLine(props.index)} />}
      </div>
      <div>
        {!props.readOnly &&
        <input name="priceFormat" value={props.priceFormat || ''}
          //onFocus={props.focusHandler}
               onChange={props.changeLine(props.index)} />}
      </div>
      <div>
        {!props.readOnly &&
        <DeleteIcon className={`no-print ${styles.deleteItem}`}
                    onClick={props.deleteHandler(props.index)} />}
      </div>
      <div>
        {isAddLine &&
        <AddIcon className={`no-print ${styles.addItem}`}
                 onClick={props.addHandler} />}
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

export default Line
