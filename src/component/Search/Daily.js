import React from 'react'
import { Link } from 'react-router-dom'

import styles from './Table.module.scss'
import { INVOICE } from '../../constant/route'
import { getPaymentIcon } from '.'

function Comparator([dateA, ...restA], [dateB, ...restB]) {
    const a = new Date(dateA)
    const b = new Date(dateB)
    if (a < b) return 1
    if (a > b) return -1
    return 0
}

const Lines = ({ lines }) => {
    return lines.map(([date, price, invoice], i) => {
        const PaymentIcon = getPaymentIcon(invoice.payment)
        return (
            <tr key={i}>
                <td>
                    {(!lines[i - 1] || lines[i - 1][0] !== date) &&
                        date}
                </td>
                <td>
                    {!invoice.category.startsWith("slp") &&
                        invoice.category}
                </td>
                <td>
                    <Link to={{
                        pathname: INVOICE,
                        invoice: { ...invoice }
                    }}>
                        {invoice.customer}
                    </Link>
                </td>
                <td>{price}</td>
                <td><PaymentIcon /></td>
            </tr>)
    })
}

export default ({ invoices }) => {
    const lines = invoices &&
        invoices.reduce((acc, invoice) => {
            return acc.concat(invoice.lineItems
                .map(line => [
                    line.date,
                    line.price,
                    invoice
                ]))
        }, []).sort(Comparator)

    return (
        <React.Fragment>
            {/* {invoices && JSON.stringify(lines.slice(0, 1))} */}
            {invoices &&
                <table className={`${styles.table}`}>
                    <tbody>
                        <Lines lines={lines} />
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}
