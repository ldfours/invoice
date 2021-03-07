<!-- -*- mode: markdown; mode: flyspell; -*-->
# Invoices

Invoices organizer developed with React and Firebase DB.

It allows:
* Create, Update and Delete invoices
* Customize headers
* Search by description and category
* Select Cash / Cheque payment options
* Add the *PAID* stamp overlay image
* Assign categories
* Use an embedded calendar
* Group invoices by date and customer and create reports

## Local run

    $ npm install
    $ npm start

## Firebase deployment

    $ ./node_modules/.bin/firebase login
    $ firebase use --add

    $ npm run build
    $ firebase deploy

## Example

Import data file into the Firebase Realtime database:

```json
{
  "user" : {
    "7XYj5TdlVRAM8jcfMBCNDYNFXBAl2" : {
      "customer" : {
        "Tara" : {
          "company" : "",
          "dob" : "1980-09-21",
          "note" : ""
        }
      },
      "invoice" : {
        "1356739200159" : {
          "category" : "dev",
          "customer" : "Tara",
          "extraNote" : "",
          "lineItems" : [ {
            "date" : "1",
            "description" : "Therapy materials",
            "quantity" : "$23.03",
            "price" : 23.03,
          }, {
            "date" : "2",
            "description" : "Tooth brush",
            "quantity" : "$4",
            "price" : 8.00,
          } ],
          "notes" : "",
          "payment" : "",
          "tag" : "tag"
        }
      },
      "layout" : {
        "caption" : [ "Date:", "Patient's name:" ],
        "categories" : {
          "cat1" : {
            "column" : [ "Date", "Description", "Hours", "Total" ],
            "description" : "A description",
            "note" : [ "Provider:", "Karl,", "", "another note" ]
          },
          "dev" : {
            "column" : [ "Quantity", "Description", "Unit Price", "Total" ],
            "description" : "",
            "note" : [ "" ]
          }
        },
        "head" : [ "Company", "Coltrane", "Phone: (416) 234-1232", "Fax: (905) 234-1224" ],
        "segment" : {
          "radio" : [ "Cash", "Cheque/email transfer" ],
          "title" : "Payment"
        },
        "title" : "Invoice"
      }
    }
  }
}
```

Generated invoice:

![](invoice.jpg?display=inline-block)
