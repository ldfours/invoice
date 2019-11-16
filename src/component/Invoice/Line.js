import React from 'react'
import PropTypes from 'prop-types'

//import { MdAddCircle as AddIcon } from 'react-icons/md'
import { MdCancel as DeleteIcon } from 'react-icons/md'

import styles from './index.module.scss'

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
                       {... isBeforeLastLine && {
                           onFocus: props.deleteDuplicateHandler(props.index + 1)
                       }}
                />}
            </div>
            <div>
                {!props.readOnly &&
                <input name="priceFormat" value={props.priceFormat || ''}
                       onChange={props.changeLine(props.index)}
                       {... isLastLine && { onFocus: props.addHandler(props.index) }}
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

export default Line
