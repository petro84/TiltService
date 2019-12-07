# TiltService

Service is intended to run on raspberry pi device(s) as a startup service. Two main routes exist to be called from front-end UI to start and stop bluetooth scanning.

Modules used:
@abandonware/noble
express
firebase-admin

The filtering logic was attained from the node-beacon-scanner project. To better understand what it was doing, I rewrote it to satisfy my needs (i.e. only grab certain pieces of info and not everything related to the beacon)

To run service automatically on raspberry pi, copy tilt.service file to /etc/systemd/system folder on pi. Then run the following:
* sudo systemctl enable tilt.service (registers new service with os boot logic)
* sudo systemctl start tilt.service (manually starts service if not wanting to reboot right away)
