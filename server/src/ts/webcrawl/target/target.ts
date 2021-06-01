abstract class Target {

    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private districtList: object;
    private selectorList: object;
    private objectList: object;
    private attributeList: object;
    private rentalData: object;
    private selectorInnerDataList: object;

    constructor();
    constructor(browser: any, targetURL: string, rentalType: object, districtList: object, selectorList: object, objectList: object, attributeList: object, selectorInnerDataList: object);
    constructor(browser?: any, targetURL?: string, rentalType?: object, districtList?: object, selectorList?: object, objectList?: object, attributeList?: object, selectorInnerDataList?: object) {
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
        this.districtList = districtList;
        this.selectorList = selectorList;
        this.selectorInnerDataList = selectorInnerDataList;
        this.objectList = objectList;
        this.attributeList = attributeList;
        this.rentalData = {};
        this.populateRentalData();
    }

    private async populateRentalData() {
        let districtList = this.districtList['region'];
        let tempDistrictLength = districtList.length;
        while (tempDistrictLength--) {
            this.rentalData[districtList[tempDistrictLength]] = {};
        }
    }

    public async search() { };

}

module.exports = Target;