<!-- -*- mode: markdown; mode: flyspell; -*-->
# Invoices

* Use Firebase and React to Create/Read/Update/Delete invoices
* Customized header
* Cash / Cheque payment selection
* *PAID* stamp overlay image
* Assign categories
* Search by description and category
* Notes panel
* Reports

## Run

    $ npm start

## Firebase

### Setup

    $ ./node_modules/.bin/firebase login
    $ firebase use --add

### Deployment

    $ npm run build
    $ firebase deploy

### Real-time database file

```json
{
  "user" : {
    "7Xyj5TdlVRAM8jcfMBCNDYNFXBAl2" : {
      "customer" : {
        "client name A" : {
          "company" : "",
          "dob" : "1982-09-21",
          "note" : ""
        },
        ...
      },
      "invoice" : {
        "1356739200159" : {
          "category" : "cat1",
          "customer" : "A, Val",
          "extraNote" : "",
          "lineItems" : [ {
            "date" : "December 29, 2012",
            "description" : "desc A",
            "price" : 20,
            "quantity" : "1 hr"
          }, {
            "date" : "January 5, 2013",
            "description" : "desc b",
            "price" : 44,
            "quantity" : "1 hr"
          }, {
            "date" : "January 12, 2013",
            "description" : "desc c",
            "price" : 20,
            "quantity" : "1 hr"
          } ],
          "notes" : "",
          "payment" : "",
          "tag" : ""
        },
        "1357084800159" : {
       ...
      },
      "layout" : {
        "caption" : [ "Date:", "Customer name:" ],
        "categories" : {
          "cat1" : {
            "column" : [ "Date", "Description", "Hours", "Total" ],
            "description" : "A description",
            "note" : [ "Provider:", "Karl,", "", "another note" ],
            "signature" : "signature.png"
          },
          "cat2" : {
            "column" : [ "Quantity", "Description", "Unit Price", "Total" ],
            "description" : "Model ",
            "note" : [ "" ],
            "signature" : ""
          },
          ...
        },
        "head" : [ "Main header", "SubHeader 1", "Phone: 123", "Fax: 456" ],
        "segment" : {
          "radio" : [ "Cash", "Cheque" ],
          "title" : "Payment"
        },
        "title" : "Invoice"
      }
    }
  }
}

```
