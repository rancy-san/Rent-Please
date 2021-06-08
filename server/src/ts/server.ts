
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
// fetch class RentPlease for later instantiation
const RentPlease = require('./rentPlease');

export class Server {
    
    // begin the Rent, Please! application through instantiating the class
    private rentPlease:any;

    constructor() {
        // allow Cross Origin Requests
        app.use(cors());
        // Express 14.17+ replaces 'body-parser' module
        app.use(express.json());
        // listen to request from client
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
            });
        });
    }

    public async listenForClientGenerateReport() {
        await app.post('/generateReport', async (req, res) => {
            let clientData:object = req.body;
            await this.generateReport(res, clientData).then(()=>{});
        });
    }

    public async generateReport(res:any, clientData:object) {
        let data:object = clientData;
        return new Promise<void>(async (resolve, clientData) => await this.seekRental(resolve, data)).then(()=> {
            return new Promise<void>(async resolve => await this.rentPlease.createDistrictDataOutput(resolve, 'p'));
        });
    }

    private async seekRental(resolve:any, data:object) {
        this.rentPlease = await new RentPlease('p');
        // run web crawling
        resolve(); // remove this when output data done
        //await this.rentPlease.seekRental(resolve, data);
    }
}

module.exports = Server;