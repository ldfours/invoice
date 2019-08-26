import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as ROUTES from '../../constant/route';
import { sumArr } from '../../constant/util';

const Table = ({ invoices, title }) => {
  return (
    <div>
      <label>{title}</label>
      <table>
        <thead>
        <tr>
          <th>Client</th>
          <th>Description</th>
          <th>Visits</th>
          <th>Total</th>
          <th>Dates</th>
          <th>Id</th>
        </tr>
        </thead>
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
                <td>{invoice.lineItems.length}</td>
                <td>{"$"}{sumArr(invoice.lineItems
                  .map(item => parseInt(item.price)))}</td>
                <td>
                  <Link to={{
                    pathname: ROUTES.INVOICE,
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
                <td>{id.substring(0,6)}</td>
              </tr>
            )
          }).reverse()}
        </tbody>
      </table>
    </div>
  )
}

export default withRouter(Table)
