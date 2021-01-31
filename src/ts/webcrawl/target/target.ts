abstract class Target {

    private browser:any;
    private targetURL:string;
    private rentalType:object;
    private districtList:object;
    private selectorList:object;
    private rentalData: object;

    constructor(browser:any, targetURL:string, rentalType:object, districtList:object, selectorList:object){
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
        this.districtList = districtList;
        this.selectorList = selectorList;
        this.rentalData = {};
        this.populateRentalData();
    }

    private async populateRentalData() {
        let districtList = this.districtList['region'];
        let tempDistrictLength = districtList.length;
        while(tempDistrictLength--) {
            this.rentalData[districtList[tempDistrictLength]] = {};
        }
    }

    public async search(){};

}

module.exports = Target;