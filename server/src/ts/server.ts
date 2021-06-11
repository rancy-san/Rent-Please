import { JSONObject } from "puppeteer";

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
            // display IP address of the server
            console.log("This machine '" + os.hostname() + "' is now a local server!");
            console.log("Application ready."); 
        });
    }

    public async listenForClientGenerateReport() {
        await app.post('/generateReport', async (req, res) => {
            process.stdout.write("Received request to generate a report.                          \r");
            let clientData:object = req.body;
            await this.generateReport(res, clientData).then(async ()=>{
                
                process.stdout.write("Sending filename to client.                          \r");
                let filename: string = await this.rentPlease.getFilename();
                let filpath: string =  __dirname;
                await res.send(filpath + filename);
                process.stdout.write("Reply sent to client.                                               \r");
            });
        });
    }

    public async generateReport(res:any, clientData:object) {
        let data:object = clientData;
        let response:any = res;
        return new Promise<void>(async (resolve, clientData) => await this.seekRental(resolve, data)).then(()=> {
            return new Promise<void>(async resolve => await this.rentPlease.createDistrictDataOutput(resolve, 'p'));
        });
    }

    private async seekRental(resolve:any, data:object) {
        this.rentPlease = await new RentPlease('p');
        // run web crawling
        await this.rentPlease.seekRental(resolve, data);
    }
}

module.exports = Server;