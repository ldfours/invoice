import React from 'react';
import styles from '../List/Table.module.scss'

function Comparator(a, b) {
    const da = new Date(a[0])
    const db = new Date(b[0])
    if (da < db) return -1;
    if (da > db) return 1;
    return 0;
}

export default (props) => {
    const invoices = props.location.invoices
    const lines = invoices &&
        invoices.reduce((acc, invoice) => {
            return acc.concat(invoice.lineItems
                .map(line => [
                    line.date,
                    invoice.customer,
                    invoice.payment,
                    line.price,
                    invoice.category
                ]))
        }, [])
            .sort(Comparator)

    return (
        <React.Fragment>
            {/* {invoices && JSON.stringify(lines.slice(0, 1))} */}
            {invoices &&
                <table className={`${styles.table}`}>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Customer</td>
                            <td>cheque</td>
                            <td>cash</td>
                            <td>Category</td>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((line, i) =>
                            <tr key={i}>
                                <td>
                                    {(!lines[i - 1] || lines[i - 1][0] != line[0])
                                        && line[0]}
                                </td>
                                <td>{line[1]}</td>
                                <td>{(!line[2] || line[2] === "Cheque")
                                    && line[3]}
                                </td>
                                <td>{line[2] && line[2] === "Cash"
                                    && line[3]}</td>
                                <td>{!line[4].startsWith("slp") && line[4]}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}
