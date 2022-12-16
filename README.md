# OSC mirror

A derivative of [webRTCgui](https://github.com/capital-G/webRTCgui) which uses the websockets to channel OSC messages through the network.
This allows to circumvent many network restrictions such as Firewalls which may make it hard to exchange OSC messages directly.
It aims to reproduce the core API of [OSCGroups](https://www.rossbencina.com/code/oscgroups).

The project consists of two parts written in NodeJS,

1) a server which needs to be run on a remote machine and
2) a clients which server as translation layer between the WebSocket connection and our OSC messages from e.g. SuperCollider.

## Setup client

To run the client locally you need to have [node](https://nodejs.org) or [Docker](https://www.docker.com/) installed and have the repository cloned to your local computer via

```shell
git clone https://github.com/capital-G/oscMirror.git
cd oscMirror
```

### Node

Assuming you have node installed you first need to install the necessary dependencies via

```shell
npm install
```

After this you can connect your local client to the central server via

```shell
BACKEND_AUTH_TOKEN=xenakisBirthdayBoy \
BACKEND_ADDRESS="https://mirror.dennis-scheiba.com" \
npm run client
```

where the variables must be adjusted for the desired environment.

## Setup server

Clone the repo, install Docker and run

```shell
BACKEND_AUTH_TOKEN=xenakisBirthdayBoy \
docker-compose -f docker-compose.server.yml up --build -d
```

and put a reverse proxy on port `4000`.
Make sure you have activated the websocket support on your reverse proxy!

## License

GPL-2.0
