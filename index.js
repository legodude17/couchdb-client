/*jslint node:true*/
'use strict';
var request = require('request');
var CouchDBClient = function (options) {
    this.options = {};
    Object.assign(this.options, options, {
        host: '127.0.0.1',
        port: '5984'
    });
    this.place = 'http://' + this.options.host + ':' + this.options.port;
};
function d(name, obj) {
    CouchDBClient.prototype[name] = obj;
}
d('welcome', function (cb) {
    if (!cb) {
        throw new Error('No callback supplied!');
    }
    request(this.place, function (error, response, data) {
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('getUUIDs', function (num, cb) {
    num = num || 1;
    request(this.place + '/_uuids?count=' + num, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            if (num === 1) {
                cb(null, data.uuids[0]);
            } else {
                cb(null, data.uuids);
            }
        } else {
            cb(error || data);
        }
    });
});
d('createDB', function (name, cb) {
    request.put(this.place + '/' + name, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 201) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('getDB', function (name, cb) {
    request(this.place + '/' + name, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('deleteDB', function (name, cb) {
    request['delete'](this.place + '/' + name, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('addDoc', function (name, id, data, rev, cb) {
    if (typeof rev === 'function') {
        cb = rev;
        rev = null;
    }
    if (!cb) {
        throw new Error('Callback must be a function');
    }
    request.put(this.place + '/' + name + '/' + id + (rev ? '?rev=' + rev : ''), {body: JSON.stringify(data)}, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 201) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('getDoc', function (name, id, cb) {
    if (!cb) {
        throw new Error('Callback must be a function');
    }
    request(this.place + '/' + name + '/' + id, function (error, response, data) {
        data = JSON.parse(data);
        var rev = '_' + 'rev';
        data.rev = data[rev];
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('deleteDoc', function (name, id, rev, cb) {
    if (!cb) {
        throw new Error('Callback must be a function');
    }
    request.del(this.place + '/' + name + '/' + id + '?rev=' + rev, function (error, response, data) {
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('addView', function (name, id, obj, rev, cb) {
    if (typeof rev === 'function') {
        cb = rev;
        rev = null;
    }
    var view = {},
        did = '_' + 'id',
        i;
    view[did] = '_design/' + id;
    view.views = obj;
    request.put(this.place + '/' + name + '/_design/' + id + (rev ? '?rev=' + rev : ''), {body: JSON.stringify(view)}, function (error, response, data) {
        if (error) {
            return cb(error);
        }
        data = JSON.parse(data);
        if (response.statusCode.toString().indexOf('20') === 0) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('deleteView', function (name, id, rev, cb) {
    request.del(this.place + '/' + name + '/_design/' + id + '?rev=' + rev, function (error, response, data) {
        if (error) {
            return cb(error);
        }
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
d('useView', function (name, id, view, key, cb) {
    request(this.place + '/' + name + '/_design/' + id + '/_view/' + view + (key ? '?key="' + key + '"' : ''), function (error, response, data) {
        if (error) {
            return cb(error);
        }
        data = JSON.parse(data);
        if (response.statusCode === 200) {
            cb(null, data);
        } else {
            cb(error || data);
        }
    });
});
module.exports = CouchDBClient;