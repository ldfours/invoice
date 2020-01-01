import React from 'react'
import { Link } from 'react-router-dom'

import { INVOICE, DAILY } from '../../constant/route'
import { sumArr } from '../../constant/util'
import styles from './Table.module.scss'

export default ({ invoices, query_key, query_val, query_category }) => {
    const filteredInvoices = Object.keys(invoices)
        .filter(id => {
            //console.log(JSON.stringify(id, null, 2))
            if (!query_category
                || invoices[id].category.startsWith(query_category)) {
                return true
            } else {
                return false
            }
        })
        .map(id => {
            const invoice = invoices[id]
            invoice.id = id
            return invoice
        })

    return (
        // query parameters
        <React.Fragment>{query_key && query_key}<span> </span>
            <label>{query_val && query_val}
                {query_category && ` category ${query_category}`}
            </label>
            <table className={`${styles.table}`}>
                <tbody>
                    {filteredInvoices.map(
                        invoice => {
                            return (
                                <tr key={invoice.id}>
                                    <td>{invoice.customer}</td>
                                    <td>{invoice.lineItems[0].description.substring(0, 20) || invoice.category.substring(0, 25)}</td>
                                    <td>{invoice.lineItems.length}</td>
                                    <td>{"$"}{sumArr(invoice.lineItems
                                        .map(item => parseInt(item.price)))}</td>
                                    <td>
                                        <Link to={{
                                            pathname: INVOICE,
                                            invoice: {
                                                //id: invoice,
                                                query_key,
                                                query_val,
                                                ...invoice
                                            }
                                        }}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        {invoice.lineItems.map((line, i) =>
                                                            (<td width={2} key={i}>
                                                                <div>
                                                                    {line.date}
                                                                    <span> </span>
                                                                    {i === 0 && invoice.tag}
                                                                    {"$"}
                                                                    {line.price}
                                                                </div>
                                                            </td>
                                                            ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        }).reverse()}
                </tbody>
            </table>
            <Link to={{ pathname: DAILY, invoices: filteredInvoices }}> daily</Link>
        </React.Fragment>
    )
}
