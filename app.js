const noble = require('@abandonware/noble')

const Tilt = require('./lib/tilt-scanner')
const database = require('./lib/database')

let scanner = new Tilt(noble)
let stopped = false
let interval = 1800000

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
}, interval)
