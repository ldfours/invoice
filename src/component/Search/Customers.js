import React from 'react'
import { Link } from 'react-router-dom'

import { groupBy, sumArr, formatDate } from '../../constant/util'
import styles from './Table.module.scss'
import { CUSTOMER } from '../../constant/route'

const CategorySummary = ({ visits, categoryName, minDate, maxDate, total }) => {
    const visitsWithNotes = Object.keys(visits)
        .filter(key => visits[key].note)
        .map(key => visits[key])
    return (
        <React.Fragment>
            <span style={{ whiteSpace: 'nowrap' }}>{minDate} - {maxDate}</span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
                {visitsWithNotes.length ?
                    <React.Fragment>
                        <Link to={{
                            pathname: CUSTOMER,
                            customer: visitsWithNotes && visitsWithNotes[0].customer,
                            visits: {
                                ...visitsWithNotes
                            }
                        }}>{categoryName}</Link> ${total}
                    </React.Fragment>
                    : `${categoryName} $${total}`}
            </span>
        </React.Fragment>
    )
}

const Line = ({ customer }) => {
    const customerName = Object.keys(customer)[0]
    const categoryNames = Object.keys(customer[customerName])
    return (
        <tr key={customerName}>
            <td>{customerName}</td>
            {/* <td>{JSON.stringify(categoryNames)}</td> */}
            {categoryNames.map(categoryName => {
                const visits = customer[customerName][categoryName]
                const total = sumArr(visits.map(visit => parseFloat(visit.price)))
                const dates = visits.map(visit => new Date(visit.date))
                const minDate = formatDate(new Date(Math.min.apply(null, dates)))
                const maxDate = formatDate(new Date(Math.max.apply(null, dates)))
                return (
                    <td key={categoryName}>
                        <CategorySummary key={categoryName}
                            visits={visits}
                            categoryName={categoryName}
                            minDate={minDate}
                            maxDate={maxDate}
                            total={total}
                        />
                    </td>
                )
            })}
        </tr>)
}

export default ({ invoices }) => {
    const lines = invoices &&
        invoices.reduce((acc, invoice) => {
            return acc.concat(invoice.lineItems
                .map(item => {
                    return {
                        customer: invoice.customer,
                        category: invoice.category,
                        ...item
                    }
                }))
        }, [])

    const ungroupedCustomers = groupBy(lines, 'customer')
    const customers =
        Object.keys(ungroupedCustomers).map(
            customer => {
                return {
                    [customer]:
                        groupBy(ungroupedCustomers[customer], 'category')
                }
            }
        ).reverse()

    return (
        <React.Fragment>
            {/* {invoices && JSON.stringify(lines.slice(0, 1))} */}
            {invoices &&
                <table className={`${styles.table}`}>
                    <tbody>
                        {/* {JSON.stringify(customers)} */}
                        {customers.map((customer, i) => {
                            return <Line key={i} customer={customer} />
                        })}
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}
