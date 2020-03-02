import React from 'react'
import { Link } from 'react-router-dom'

import { INVOICE, CUSTOMER } from '../../constant/route'
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
                        <span style={{ whiteSpace: 'nowrap' }}>{line.date}</span>
                        <br />
                        <span>{`$${line.price}`}</span>
                    </td>
                    ))}
            </tr>
        </tbody>
    </table>

export default ({ invoices, layout, query_key, query_val }) => {
    return (
        <React.Fragment>
            <table className={`${styles.table}`}>
                <tbody>
                    {invoices.map(
                        invoice => {
                            const PaymentIcon = getPaymentIcon(invoice.payment)
                            return (
                                <tr key={invoice.id}>
                                    <td>
                                        <Link to={{
                                            pathname: CUSTOMER,
                                            customer: invoice.customer,
                                            visits: null
                                        }}>
                                            {invoice.customer}
                                        </Link>
                                    </td>
                                    <td>{invoice.category}</td>
                                    <td>
                                        <Link to={{
                                            pathname: INVOICE,
                                            layout,
                                            invoice: {
                                                query_key,
                                                query_val,
                                                ...invoice,
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
