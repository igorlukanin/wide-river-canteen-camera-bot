const config = require('config');
const r = require('rethinkdb');

const connection = r.connect({
    host: config.get('rethinkdb.host'),
    port: config.get('rethinkdb.port'),
    db: config.get('rethinkdb.db')
});


const upsertMessage = message => connection.then(c => r.table('messages')
    .insert(message, { conflict: 'update' })
    .run(c));


module.exports = {
    saveMessage: upsertMessage
};