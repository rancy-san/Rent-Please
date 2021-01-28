abstract class Target {

    private browser:any;
    private targetURL:string;
    private rentalType:object;
    private districtList:object;

    constructor(browser:any, targetURL:string, rentalType:object, districtList:object){
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
        this.districtList = districtList;
    }

    public async search(){};

}

module.exports = Target;