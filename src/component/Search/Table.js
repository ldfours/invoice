import React from 'react'
import { Link } from 'react-router-dom'

import { INVOICE, CUSTOMER } from '../../constant/route'
import { sumArr } from '../../constant/util'
import styles from './Table.module.scss'
import { getPaymentIcon } from '.'

const InvoiceTable = ({ invoice }) =>
    <table>
        <caption style={{
            textAlign: "left",
            fontStyle: "oblique",
            color: "maroon",
        }}>
            {invoice.tag}
        </caption>
        <tbody>
            <tr style={{ background: "#ffffff" }}>
                {invoice.lineItems.map((line, i) =>
                    (<td width={2} key={i}>
                        <div>
                            <span style={{ whiteSpace: 'nowrap' }}>{line.date}</span>
                        </div>
                        <div>
                            <span>{`$${line.price}`}</span>
                        </div>
                    </td>
                    ))}
            </tr>
        </tbody>
    </table >

export default ({ invoices, layout, queryKey, queryVal }) => {
    return (
        <React.Fragment>
            <table className={`${styles.table}`}>
                <tbody>
                    {invoices.map(
                        invoice => {
                            const PaymentIcon = getPaymentIcon(invoice.payment)
                            const sumPrice = <div>
                                {
                                    sumArr(invoice.lineItems
                                        .map(item => parseInt(item.price)))
                                }
                                <span> </span>
                                <PaymentIcon />
                            </div>
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
                                        {layout && layout.categories ?
                                            <Link to={{
                                                pathname: INVOICE,
                                                layout,
                                                invoice: {
                                                    queryKey,
                                                    queryVal,
                                                    ...invoice,
                                                }
                                            }}>{sumPrice}</Link> : sumPrice}
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
