abstract class Target {

    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private clientData: object
    private selectorList: object;
    private attributeList: object;
    private rentalData: object;
    private selectorInnerDataList: object;

    constructor();
    constructor(browser: any, targetURL: string, rentalType: object, clientData: object, selectorList: object, attributeList: object, selectorInnerDataList: object);
    constructor(browser?: any, targetURL?: string, rentalType?: object, clientData?: object, selectorList?: object, attributeList?: object, selectorInnerDataList?: object) {
        this.browser = browser;
        this.targetURL = targetURL;
        this.rentalType = rentalType;
        this.selectorList = selectorList;
        this.selectorInnerDataList = selectorInnerDataList;
        this.clientData = clientData;
        this.attributeList = attributeList;
        this.rentalData = {};
        this.populateRentalData();
    }

    
    private async populateRentalData() {
        this.rentalData = this.clientData;
    }
    

    private getDataClientLength() {
        return Object.keys(this.clientData).length;
    }
    public async search() { };

}

module.exports = Target;