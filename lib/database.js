const admin = require('firebase-admin')
const cert = require('../serviceAuthKey.json')

admin.initializeApp({
    credential: admin.credential.cert(cert)
})

const database = admin.firestore()

const saveBeacon = (data) => {
    let collection = database.collection(`${data.color}`)
    let promise = new Promise((resolve, reject) => {
        collection.add({
            uuid: data.uuid,
            temp: data.temp,
            gravity: data.gravity,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        })
            .then(() => resolve())
            .catch((e) => reject(e))
    })

    return promise
}

const getInterval = async () => {
    const settingsRef = database.collection('Settings').doc('service')

    return await settingsRef.get().then((snapshot) => snapshot.get('interval'))
}

module.exports = { saveBeacon, getInterval }