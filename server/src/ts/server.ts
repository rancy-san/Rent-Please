// import expressJS
const express = require('express');
// initialize expressJS
const app = express();
// import http with an expressJS Server
const http = require('http').Server(app);
// get operating system library to display server information
const os = require('os');
// eliminate CORS (Cross origin request) issue/non-https
const cors = require('cors');
// import library that gets server's IPv4 address
const localIpV4Address = require("local-ipv4-address");

export class Server {
    constructor() {
        // allow Cross Origin Requests
        app.use(cors());
        this.listenForClientGenerateReport();
    }

    public startServer() {
        // create server & listen for connections
        http.listen(3000, function () {
            // get IPv4 address to display in the server console
            localIpV4Address().then(function (ipAddress) {
                // display IP address of the server
                console.log("This machine '" + os.hostname() + "' is now a local server!");
                console.log("Application ready.");
                // console.log("Navigate to " + ipAddress + ":3000 in any modern web browser on mobile");
            });
        });
    }

    public listenForClientGenerateReport() {
        // POST method route
        app.post('/generateReport', async (req, res) => {
            await this.generateReport(res).then(()=>{
                console.log(3);
            });
        });
    }

    public async generateReport(res) {
        return new Promise<void>(resolve => setTimeout(function() {
            console.log(1);
            resolve();
        }, 500)).then(()=> {

            return new Promise<void>(resolve => setTimeout(function() {
                console.log(2);
                resolve();
            }, 1000));
        });
    }
}

module.exports = Server;