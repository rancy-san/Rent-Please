abstract class Target {

    private browser:any;
    private targetURL:string;
    private rentalType:object;

    constructor(browser:any, targetURL:string, rentalType:object){
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
    }

    public async search(any){};

}

module.exports = Target;