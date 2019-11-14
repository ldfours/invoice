import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { INVOICE } from '../../constant/route';
import { sumArr } from '../../constant/util';
import styles from './Table.module.scss'

const Table = ({ invoices, query_key, query_val }) => {
    return (
        <div>{query_key && query_key}<span> </span>
            <label style={{
                fontStyle: 'italic',
                fontWeight: 'bold'
            }}>{query_val && query_val}</label>
            <table className={`${styles.table}`}>
                <tbody>
                {Object.keys(invoices)
                    .map(
                        id => {
                            const invoice = invoices[id]
                            // set the same category for each line in the invoice
                            invoice.lineItems.map(line => line.category = invoice.category)

                            return (
                                <tr key={id}>
                                    <td>{invoice.customer}</td>
                                    <td>{invoice.lineItems[0].description || invoice.category}</td>
                                    <td>x{invoice.lineItems.length}</td>
                                    <td>{"$"}{sumArr(invoice.lineItems
                                        .map(item => parseInt(item.price)))}</td>
                                    <td>
                                        <Link to={{
                                            pathname: INVOICE,
                                            invoice: {
                                                id,
                                                query_key,
                                                query_val, ...invoice
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
        </div>
    )
}

export default withRouter(Table)
