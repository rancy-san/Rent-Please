abstract class Target {

    private browser:any;
    private targetURL:string;
    private rentalType:object;
    private districtList:object;
    private selectorList:object;

    constructor(browser:any, targetURL:string, rentalType:object, districtList:object, selectorList:object){
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
        this.districtList = districtList;
        this.selectorList = selectorList;
    }

    public async search(){};

}

module.exports = Target;