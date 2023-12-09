# Sev Blockchain
Demo blockchain in JS

## Run nodes locally

local node 1 `npm run dev`

local node 2 `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev`

local node 3 `HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev`

Connect to remote nodes `PEERS=ws://13.40.42.210:5001,ws://13.40.4.5:5001 npm run dev`