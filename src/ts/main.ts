const RentPlease = require('./rentPlease');

class Main {
        private args:string[];
        private argsLength:number;

    constructor(){
        this.args = process.argv;
        this.argsLength = this.args.length;
        // load available web applications from config file to verify valid arguments
        // check arguments and run webcrawler for that web application
        // throw error and exit if no arguments or wrong arguments
    }

    public validateArgs():void {
        let arg:string = this.args[2].toLowerCase().replace('-', '');

        if(this.argsLength > 3) {
            console.log("Error: Too many arguments. Only input 1 argument.");
        } else if(this.argsLength < 3) {
            console.log("Error: Too few arguments. Only input 1 argument.");
        }else {
            switch (arg) {
                case "p": {
                    let rentPlease:any = new RentPlease(arg);
                    rentPlease.seekRental();                   
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