const admin = require('firebase-admin')
const cert = require('../serviceAuthKey.json')

admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: 'https://homebrew-data.firebaseio.com/'
})

const database = admin.database()

module.exports = database