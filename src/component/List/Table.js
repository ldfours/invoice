import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constant/route';

const Layout = ({ invoices, title }) => {
  return (
    <div>
      <label>{title}</label>
      <table>
        <thead>
        <tr>
          <th>Client</th>
          <th>Description</th>
          {/*<th>Total</th>*/}
          <th>Visits</th>
          <th>Dates</th>
        </tr>
        </thead>
        <tbody>
        {invoices.map(
          invoice => {
              // set the same description for each line in the invoice
              invoice.lineItems.map(line => line.description = invoice.description)

            return (
              <tr key={invoice.id}>
                <td>{invoice.customer}</td>
                <td>{invoice.description}</td>
                {/*<td>{"$"}{invoice.total}</td>*/}
                <td>{invoice.lineItems.length}</td>
                <td>
                  <Link to={{
                    pathname: ROUTES.INVOICE,
                    invoice: { ...invoice, readOnly: true }
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

export default withRouter(Layout)
