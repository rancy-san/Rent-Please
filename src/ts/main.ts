
/**
 * Filename:        main.ts
 * Description:     This file is the starting point of the application.
 *                  Commandline arguments are handled here to ensure the
 *                  valid type of data collection is chosen to run the 
 *                  Rent, Please! application.
 * 
 */

 // fetch class RentPlease for later instantiation
const RentPlease = require('./rentPlease');

class Main {
    // commandline arguments are stored in an array
    private args:string[];
    // number of arguments
    private argsLength:number;

    /**
     * Constructor description:     Set basic data from the commandline
     */
    constructor(){
        this.args = process.argv;
        this.argsLength = this.args.length;
    }

    /**
     * Function Name:   validateArgs
     * Description:     Processes the commandline argument for only 1 argument per line ran.
     *                  This is meant to allow for the application to run in parallel with itself.
     */
    public validateArgs():void {
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
                // any previous case will not have "break; 
                case "p": {
                    // begin the Rent, Please! application through instantiating the class
                    let rentPlease:any = new RentPlease(arg);
                    // run web crawling
                    rentPlease.seekRental();                   
                    break;
                }
                // update list of neighbourhoods
                case "-un": {
                    let rentPlease:any = new RentPlease();
                    rentPlease.updateNeighbourhoodList();
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