const AbstractTarget = require('./target');

class Padmapper extends AbstractTarget {
    private browser:any;
    private targetURL:string;
    private rentalType:object;

    public async search() {
        let tempTargetURL = this.targetURL;
        let buildingDataLength = this.rentalType['building'].length;
        let [targetPage]:any = await this.browser.pages();

        while(buildingDataLength--) {

        }
        //await targetPage.goto(this.targetURL);    
    }
}

module.exports = Padmapper;