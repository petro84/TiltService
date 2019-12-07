const express = require('express')

const scanner = require('./lib/tilt-scanner')
const {saveBeacon, getInterval} = require('./lib/database')

const scan = new scanner()
const app = express()

let stopped = true
let intervals = undefined

app.post('/Start', (req, res) => {
    startScan()

    res.send('Running!')
})

app.post('/Stop', (req, res) => {
    clearInterval(intervals)
    intervals = undefined

    res.send('Stopped!')
})

app.get('*', (req, res) => res.status(404).send())

app.listen(5841, () => console.log('Listening on port 5841'))

scan.onAdvertisement = (beacon) => {
    scan.stopScan()

    saveBeacon(beacon).then(() => stopped = true)
}

const startScan = async () => {
    let interval = await getInterval()

    intervals = setInterval(() => {
        if (stopped) {
            scan.startScan().then(() => stopped = false)
        }
    }, interval)
}

// const noble_mac = require('noble-mac')
// const noble = require('noble')

// const Tilt = require('./lib/tilt-scanner')
// const database = require('./lib/database')

// let scanner = undefined
// let stopped = false
// let interval = undefined

// if (process.platform === 'darwin') {
//     scanner = new Tilt(noble_mac)
// } else {
//     scanner = new Tilt(noble)
// }

// database.ref('tilt/Settings').on('value',(snapshot) => {
//     interval = snapshot.val()
// })

// scanner.startScan()
//     .then(() => console.log('Scanning...'))
//     .catch((e) => console.log(e))

// scanner.onAdvertisement = (data) => {
//     if (data) {
//         scanner.stopScan()
//         database.ref(`tilt/${data.color}/beacon`).push(data).then(() => stopped = true)
//     }
// }

// setInterval(() => {
//     if (stopped) {
//         scanner.startScan()
//             .then(() => stopped = false)
//             .catch((e) => console.log(e))
//     }
// }, interval)