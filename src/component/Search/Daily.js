import React from 'react'
import { Link } from 'react-router-dom'

import { DateComparator } from '../../constant/util'
import { INVOICE } from '../../constant/route'

import styles from './Table.module.scss'
import { getPaymentIcon } from '.'

const Lines = ({ lines, layout }) => {
    return lines.map(([date, price, invoice], i) => {
        const PaymentIcon = getPaymentIcon(invoice.payment)
        return (
            <tr key={i}>
                <td>
                    {(!lines[i - 1] || lines[i - 1][0] !== date) &&
                        date}
                </td>
                <td>
                    {!invoice.category === "slp" &&
                        invoice.category}
                </td>
                <td>
                    {invoice.customer}
                </td>
                <td>
                    {layout && layout.categories ?
                        <Link to={{
                            pathname: INVOICE,
                            invoice: { ...invoice },
                            layout: layout,
                        }}>
                            {price} <PaymentIcon />
                        </Link> :
                        <span>{price} < PaymentIcon /></span>}
                </td>
            </tr>)
    })
}

export default ({ invoices, layout }) => {
    const lines = invoices &&
        invoices.reduce((acc, invoice) => {
            return acc.concat(invoice.lineItems
                .map(item => [
                    item.date,
                    item.price,
                    invoice
                ]))
        }, []).sort(DateComparator)

    return (
        <React.Fragment>
            {/* {invoices && JSON.stringify(lines.slice(0, 1))} */}
            {invoices &&
                <table className={`${styles.table}`}>
                    <tbody>
                        <Lines lines={lines} layout={layout} />
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}
