const scanner = require('./lib/tilt-scanner')
const database = require('./lib/database')

const scan = new scanner()

let intervals = undefined
let stopped = true
let docName = undefined

// listen for changes in database
database.ref('settings').on('value', (snapshot) => {
    processData(snapshot.val());
})

const processData = ({interval, flavor, active}) => {
    // Stop Scanning
    clearInterval(intervals)
    intervals = undefined

    docName = flavor

    // Start scanning if active (in milliseconds)
    if (active && docName) {
        intervals = setInterval(() => {
            if (stopped) {
                scan.startScan().then(() => stopped = false)
            }
        }, interval)
    }
}

scan.onAdvertisement = (beacon) => {
    scan.stopScan()

    database.ref(docName).push(beacon).then(() => stopped = true)
}