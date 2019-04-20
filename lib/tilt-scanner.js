module.exports = class Tilt {
    constructor(version) {
        this.noble = version

        let tiltIds = {
            'a495bb10c5b14b44b5121370f02d74de':'Red',
            'a495bb20c5b14b44b5121370f02d74de':'Green',
            'a495bb30c5b14b44b5121370f02d74de':'Black',
            'a495bb40c5b14b44b5121370f02d74de':'Purple',
            'a495bb50c5b14b44b5121370f02d74de':'Orange',
            'a495bb60c5b14b44b5121370f02d74de':'Blue',
            'a495bb70c5b14b44b5121370f02d74de':'Pink'
        }

        this.tilt_devices = tiltIds
        this.initialized = false
        this.is_scanning = false
        this.onAdvertisement = undefined
    }
    startScan() {
        return new Promise((resolve, reject) => {
            this._init()
                .then(() => this._scan())
                .then(() => resolve())
                .catch((e) => reject(e))
        })
    }
    stopScan() {
        this.noble.removeAllListeners('discover')
        if (this.is_scanning) {
            this.noble.stopScanning()
            this.is_scanning = false
        }
    }
    _init() {
        return new Promise((resolve, reject) => {
            this.initialized = false
            debugger
            if (this.noble.state === 'poweredOn') {
                this.initialized = true
                resolve()
            } else {
                this.noble.once('stateChange', (state) => {
                    if (state === 'poweredOn') {
                        this.initialized = true
                        resolve()
                    } else {
                        reject(new Error('Failed to create scanner!'))
                    }
                })
            }
        })
    }
    _parse(peripheral) {
        let ads = peripheral.advertisement
        let manData = ads.manufacturerData

        if (manData && manData.length >= 4 && manData.readUInt32BE(0) === 0x4c000215) {
            if (manData.length < 25) {
                return undefined
            }

            let uuid = manData.slice(4,20).toString('hex')
            let temp = manData.slice(20,22).readUInt16BE(0)
            let gravity = manData.slice(22,24).readUInt16BE(0) / 1000
            let signal = manData.slice(24,25).readUInt8(0)
            let timestamp = Date.now()

            let beacon = {
                uuid,
                color: this.tilt_devices[uuid],
                temp,
                gravity,
                signal,
                timestamp
            }

            return beacon
        } else {
            return undefined
        }
    }
    _scan() {
        return new Promise((resolve, reject) => this.noble.startScanning([], true, (error) => {
            if (error) {
                reject(error)
            } else {
                this.noble.on('discover', (peripheral) => {
                    if (this.onAdvertisement && typeof(this.onAdvertisement) === 'function') {
                        let parsed = this._parse(peripheral)
                        if (parsed) {
                            this.onAdvertisement(parsed)
                        }
                    }
                })
                this.is_scanning = true
                resolve()
            }
        }))
    }
}