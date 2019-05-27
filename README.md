# TiltService

Service is intended to run on raspberry pi device(s) as a startup service. Two main modules have been imported
* Noble (used on raspberry pi device)
* Noble-Mac (used on mac for development/testing purposes)

The filtering logic was attained from the node-beacon-scanner project. To better understand what it was doing, I rewrote it to satisfy my needs (i.e. only grab certain pieces of info and not everything related to the beacon)

Logging beacons/data to Firebase database, hence, third a final npm module.

To run service automatically on raspberry pi, copy tilt.service file to /etc/systemd/system folder on pi. Then run the following:
* sudo systemctl enable tilt.service (registers new service with os boot logic)
* sudo systemctl start tilt.service (manually starts service if not wanting to reboot right away)
