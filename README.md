# CouchDBClient

## Table of Contents
- [Example](#example)
- [Usage](#usage)
- [Documentation](#documentation)
- [CouchDBClient](##couchdbclientoptions)
- [#welcome](#welcomecallback)
- [#createDB](#createdbname-callback)
- [#getDB](#getdbname-callback)

## Example
welcome.js
```js
var CouchDBClient = require('couchdb-client');
var client = new CouchDBClient({
    host: '127.0.0.1', //The host to connect to
    port: '5984' //The port
});
client.welcome(function (err, data) {
    console.log(err || data); //Hope it is not an error!
});
```
If all goes to plan we have a welcome message.

## Usage
After requiring it, you will get a constructor. Call the constructor with options to get a client.

## Documentation
*This will be moved to another site eventually.*
## CouchDBClient([options])
This constructs your client. The options object can have:
    host: the host to connect to. Default: 127.0.0.1
    port: the port to connect to. Default: 5984
```js
var CouchDBClient = require('couchdb-client');
var client = new CouchDBClient({
    host: example.com,
    port: 3000
});
```
## #welcome(callback)
Fetches the welcome message from the couchdb server.
```js
client.welcome(function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```

## #getUUIDs(num, callback)
Gets UUIDs from the server.
```js
var id;
client.getUUIDS(1, function (err, data) {
    if (err){
        console.error(err);
    } else {
        id = data;
    }
});
```
## #createDB(name, callback)
Creates a database in the couchdb server. Will give an error if the database already exists.
```js
client.createDB('foo', function (err, data) {
    if(err) {
        console.error(err);
    } else {
        console.log('Success:', data);
    }
});
```

## #getDB(name, callback)
Get a database from the server.
```js
var rev;
client.getDB('foo', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        rev = data.rev;
        console.log(data);
    }
});
```

## #deleteDB(name, callback)
Deletes a database.
```js
client.deleteDB('foo', rev, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```
## #addDoc(name, id, [rev], callback)
Adds a doc, could also be used to update a doc.
```js
var rev2;
client.addDoc('foo', 'bar', {hi: true, bye false}, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        rev2 = data.rev;
        console.log(data);
    }
});
```
## #getDoc(name, id, callback)
Gets a document from the database.
```js
client.getDoc('foo', 'bar', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```
## #deleteDoc(name, id, rev, callback)
Deletes a document.
```js
client.deleteDoc('foo', 'bar', rev, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```
## #addView(name, id, obj, callback)
Adds or updates a view.
```js
client.addView('test', 'stuff', {all: {map: "function (doc){emit(null,doc)}"}}, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        rev = data.rev;
        console.log(data);
    }
});
```
## #deleteView(name, id, rev, callback)
Deletes a view.
```js
client.deleteView('test', 'stuff', rev, function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```
## #useView(name, id, view, [key,] callback)
Uses a view with the specified key.
```js
client.useView('test', 'stuff', 'all', 'hi', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
```
## Test
```bash
npm test
```

## Lisence
MIT