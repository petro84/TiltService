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

const processData = ({interval, name, status}) => {
    // Stop Scanning
    clearInterval(intervals)
    intervals = undefined

    // Setup new document in database (i.e. tilt/name/beacons)
    docName = (name == '' ? undefined : `tilt/${name}/beacons`)

    // Start scanning if active (in milliseconds)
    if (status == 'active' && docName) {
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