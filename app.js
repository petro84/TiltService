const noble_mac = require('noble-mac')
const noble = require('noble')

const Tilt = require('./lib/tilt-scanner')
const database = require('./lib/database')

let scanner = undefined
let stopped = false

if (process.platform === 'darwin') {
    scanner = new Tilt(noble_mac)
} else {
    scanner = new Tilt(noble)
}

scanner.startScan()
    .then(() => console.log('Scanning...'))
    .catch((e) => console.log(e))

scanner.onAdvertisement = (data) => {
    if (data) {
        scanner.stopScan()
        database.ref(`tilt/${data.color}/beacon`).push(data).then(() => stopped = true)
    }
}

setInterval(() => {
    if (stopped) {
        scanner.startScan()
            .then(() => stopped = false)
            .catch((e) => console.log(e))
    }
}, 60000)