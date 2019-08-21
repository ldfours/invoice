# Invoices

Management implemented firebase and react

## Real Time firebase database

[Firebase database rules](https://firebase.google.com/docs/database/security)

``` json
{
  "rules": {
    ".read": true,
    ".write": true,
    "invoice": {
      ".indexOn": [
        "created",
        "customer"
      ]
    }
  }
}
```
