import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { INVOICE } from '../../constant/route';
import { sumArr } from '../../constant/util';
import styles from './Table.module.scss'

const Table = ({ invoices, title }) => {
  return (
    <div>
      <label style={{fontStyle: 'italic', fontWeight: 'bold'}}>{title}</label>
      <table className={`${styles.table}`}>
        <tbody>
        {Object.keys(invoices).map(
          id => {
            const invoice = invoices[id]
            // set the same description for each line in the invoice
            invoice.lineItems.map(line => line.description = invoice.description)

            return (
              <tr key={id}>
                <td>{invoice.customer}</td>
                <td>{invoice.description}</td>
                <td>x{invoice.lineItems.length}</td>
                <td>{"$"}{sumArr(invoice.lineItems
                  .map(item => parseInt(item.price)))}</td>
                <td>
                  <Link to={{
                    pathname: INVOICE,
                    invoice: { id, ...invoice }
                  }}>

                    <table>
                      <tbody>
                      <tr>
                        {invoice.lineItems.map((line, i) =>
                          (<td width={2} key={i}>
                              <div>{line.date} {"$"}{line.price}</div>
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
