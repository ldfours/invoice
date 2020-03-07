import React from 'react'
import { Link } from 'react-router-dom'

import { groupBy, sumArr, formatDate } from '../../constant/util'
import styles from './Table.module.scss'
import { CUSTOMER } from '../../constant/route'

const CategorySummary = ({
    visits, categoryName,
    minDate, maxDate, total,
    layoutCategory,
}) => {
    const visitsWithNotes =
        Object.keys(visits)
            .filter(key => visits[key].note)
            .map(key => visits[key])
    return (
        <React.Fragment>
            <div>
                <span style={{ whiteSpace: 'nowrap' }}>{minDate} - {maxDate}</span>
            </div>
            {/* {JSON.stringify(layoutCategory)} */}
            <div>
                <span style={{ whiteSpace: 'nowrap' }}>
                    {visitsWithNotes.length && layoutCategory ?
                        <React.Fragment>
                            <Link to={{
                                pathname: CUSTOMER,
                                customer: visitsWithNotes && visitsWithNotes[0].customer,
                                layoutCategory: layoutCategory,
                                visits: { ...visitsWithNotes }
                            }}>{categoryName}</Link> ${total}
                        </React.Fragment>
                        : `${categoryName} $${total}`}
                </span>
            </div>
        </React.Fragment>
    )
}

const Line = ({ customer, layout }) => {
    const customerName = Object.keys(customer)[0]
    const categoryNames = Object.keys(customer[customerName])
    return (
        <tr key={customerName}>
            <td>{customerName}</td>
            {/* <td>{JSON.stringify(layout)}</td> */}
            {categoryNames.map(categoryName => {
                // console.log(customerName + " " + categoryName)
                const visits = customer[customerName][categoryName]
                const total = sumArr(visits.map(visit => parseFloat(visit.price)))
                const dates = visits.map(visit => new Date(visit.date))
                const minDate = //new Date(Math.min.apply(null, dates))
                    dates.reduce(function (a, b) { return a < b ? a : b })
                const maxDate = //new Date(Math.max.apply(null, dates))
                    dates.reduce(function (a, b) { return a > b ? a : b })
                return (
                    <td key={categoryName}>
                        <CategorySummary key={categoryName}
                            visits={visits}
                            categoryName={categoryName}
                            minDate={formatDate(minDate)}
                            maxDate={formatDate(maxDate)}
                            total={total}
                            layoutCategory={layout.categories[categoryName]}
                        />
                    </td>
                )
            })}
        </tr>)
}

export default ({ invoices, layout }) => {
    const lines = invoices &&
        invoices.reduce((acc, invoice) => {
            return acc.concat(invoice.lineItems
                .map(item => {
                    // console.log(`${invoice.customer} ${invoice.category}`)
                    return {
                        ...item,
                        customer: invoice.customer,
                        category: invoice.category,
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
                        {/* {JSON.stringify(lines)} */}
                        {customers.map((customer, i) => {
                            return <Line key={i} customer={customer} layout={layout} />
                        })}
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}
