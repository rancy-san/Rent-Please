
/**
 * @filename        main.ts
 * @description     This file is the starting point of the application.
 *                  Commandline arguments are handled here to ensure the
 *                  valid type of data collection is chosen to run the 
 *                  Rent, Please! application.
 * 
 */

const Server = require('./server')
 // fetch class RentPlease for later instantiation
//const RentPlease = require('./rentPlease.js');

class Main {
    // commandline arguments are stored in an array
    private args:string[];
    // number of arguments
    private argsLength:number;

    /**
     * @description     Set basic data from the commandline
     */
    constructor(){
        this.args = process.argv;
        this.argsLength = this.args.length;
    }

    /**
     * @function        validateArgs
     * @description     Processes the commandline argument for only 
     *                      1 argument per line.
     *                  This is meant to allow for the application to 
     *                      run in parallel with itself.
     * @return          {void}
     */
    public async validateArgs() {
        // strict setting to ensure one command line arugment is sent
        if(this.argsLength > 3) {
            console.log("Error: Too many arguments. Only input 1 argument.");
        } else if(this.argsLength < 3) {
            console.log("Error: Too few arguments. Only input 1 argument.");
        } else {
            // format commandline argument to ensure consistent values are passed
            let arg:string = this.args[2].toLowerCase().replace('-', '');
            // filter only valid argument is entered
            switch (arg) {
                case "start": {
                    let server: any = new Server();
                    server.listenForClientGenerateReport();
                    server.startServer();
                    break;
                }
                default: {
                    console.log("Error: Argument '" + this.args[2] + "' does not exist.");
                }
            }
        }
    }
}

let main = new Main();
main.validateArgs();