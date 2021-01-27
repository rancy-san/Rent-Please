var RentPlease = require('./rentPlease');
var Main = /** @class */ (function () {
    function Main() {
        this.args = process.argv;
        this.argsLength = this.args.length;
        // load available web applications from config file to verify valid arguments
        // check arguments and run webcrawler for that web application
        // throw error and exit if no arguments or wrong arguments
    }
    Main.prototype.validateArgs = function () {
        var arg = this.args[2].toLowerCase().replace('-', '');
        if (this.argsLength > 3) {
            console.log("Error: Too many arguments. Only input 1 argument.");
        }
        else if (this.argsLength < 3) {
            console.log("Error: Too few arguments. Only input 1 argument.");
        }
        else {
            switch (arg) {
                case "p": {
                    var rentPlease = new RentPlease(arg);
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