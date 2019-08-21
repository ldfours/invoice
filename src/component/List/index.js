import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { compose } from '../../constant/util';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import InvoiceList from './Layout';

class InvoicesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invoices: [],
      title: null,
      query_key: this.props.location.state.query_key,
      query_val: this.props.location.state.query_val
    };
  }

  componentDidMount() {
    this.queryInvoices(this.state.query_key,
      this.state.query_val);
  }

  queryInvoices = (query_key, query_val,
                   limit = 20) => {

    this.setState({ loading: true });

    this.props.firebase.invoice()
      .orderByChild(query_key)
      .limitToLast(limit)

      // filter query results to substring of a child node
      .startAt(query_val)
      .endAt(`${query_val}\uf8ff`)
      .once('value', snapshot => {
        const invoiceObject = snapshot.val();

        if (invoiceObject) {
          const invoiceList =
            Object.keys(invoiceObject).map(key => ({
              ...invoiceObject[key]
            }));

          this.setState({
            invoices: invoiceList,
            loading: false,
            title: `${query_key} = ${query_val}`,
          });
        } else {
          this.setState({
            invoices: null,
            loading: false,
          });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.invoice().off();
  }

  loadMore = () => {
    //this.setState(state => ({ limit: state.limit + 1000 }));
    this.queryInvoices(this.state.query_key,
      this.state.query_val, 1000);
  };

  render() {
    const { invoices, loading, title } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>loading..</div>}

            {invoices ? (
              <InvoiceList
                title={title}
                invoices={invoices} />
            ) : <div>no invoices found</div>}
            <div>
              {!loading && invoices && (
                <button onClick={this.loadMore}>
                  more&raquo;
                </button>
              )}
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

export default compose(
  withFirebase,
  withRouter,
)(InvoicesBase);
