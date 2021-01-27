/**
 * Filename:        main.ts
 * Description:     This file is the starting point of the application.
 *                  Commandline arguments are handled here to ensure the
 *                  valid type of data collection is chosen to run the
 *                  Rent, Please! application.
 *
 */
// fetch class RentPlease for later instantiation
var RentPlease = require('./rentPlease');
var Main = /** @class */ (function () {
    /**
     * Constructor description:     Set basic data from the commandline
     */
    function Main() {
        this.args = process.argv;
        this.argsLength = this.args.length;
    }
    /**
     * Function Name:   validateArgs
     * Description:     Processes the commandline argument for only 1 argument per line ran.
     *                  This is meant to allow for the application to run in parallel with itself.
     */
    Main.prototype.validateArgs = function () {
        // format commandline argument to ensure consistent values are passed
        var arg = this.args[2].toLowerCase().replace('-', '');
        // strict setting to ensure one command line arugment is sent
        if (this.argsLength > 3) {
            console.log("Error: Too many arguments. Only input 1 argument.");
        }
        else if (this.argsLength < 3) {
            console.log("Error: Too few arguments. Only input 1 argument.");
        }
        else {
            // filter only valid argument is entered
            switch (arg) {
                // any previous case will not have "break; 
                case "p": {
                    // begin the Rent, Please! application through instantiating the class
                    var rentPlease = new RentPlease(arg);
                    // run web crawling
                    rentPlease.seekRental();
                    break;
                }
                default: {
                    console.log("Error: Argument '" + this.args[2] + "' does not exist.");
                }
            }
        }
    };
    return Main;
}());
var main = new Main();
main.validateArgs();
//# sourceMappingURL=main.js.map