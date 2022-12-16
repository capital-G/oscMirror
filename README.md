# OSC mirror

A derivative of [webRTCgui](https://github.com/capital-G/webRTCgui) which uses the websockets to channel OSC messages through the network.
This allows to circumvent many network restrictions such as Firewalls which may make it hard to exchange OSC messages directly.

The project consists of two parts written in NodeJS,

1) a server which needs to be run on a remote machine and
2) a clients which server as translation layer between the WebSocket connection and our OSC messages from e.g. SuperCollider.

To run the client locally you need to have [node](https://nodejs.org) or [Docker](https://www.docker.com/) installed.

## License

GPL-2.0
