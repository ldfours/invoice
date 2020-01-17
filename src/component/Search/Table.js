import React from 'react'
import { Link } from 'react-router-dom'

import { INVOICE } from '../../constant/route'
import { sumArr } from '../../constant/util'
import styles from './Table.module.scss'
import { getPaymentIcon } from '.'

const InvoiceTable = ({ invoice }) =>
    <table>
        <caption>{invoice.tag}</caption>
        <tbody>
            <tr>
                {invoice.lineItems.map((line, i) =>
                    (<td width={2} key={i}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{line.date} {`$${line.price}`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    ))}
            </tr>
        </tbody>
    </table>

export default ({ invoices, query_key, query_val, query_category }) => {

    return (
        // query parameters
        <React.Fragment>
            {/* <Link to={{ pathname: DAILY, invoices: filteredInvoices }}> daily</Link> */}
            <table className={`${styles.table}`}>
                <tbody>
                    {invoices.map(
                        invoice => {
                            const PaymentIcon = getPaymentIcon(invoice.payment)
                            return (
                                <tr key={invoice.id}>
                                    <td>{invoice.customer}</td>
                                    <td>{invoice.category}</td>
                                    <td>
                                        <Link to={{
                                            pathname: INVOICE,
                                            invoice: {
                                                query_key,
                                                query_val,
                                                ...invoice
                                            }
                                        }}>
                                            {sumArr(invoice.lineItems
                                                .map(item => parseInt(item.price)))}
                                            <span> </span>
                                            <PaymentIcon />
                                        </Link>
                                    </td>
                                    <td>
                                        <InvoiceTable invoice={invoice} />
                                    </td>
                                    <td>{invoice.notes.substring(0, 10)}</td>
                                </tr>
                            )
                        }).reverse()}
                </tbody>
            </table>
        </React.Fragment>
    )
}
