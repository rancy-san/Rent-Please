const AbstractTarget = require('./target');

class Padmapper extends AbstractTarget {
    private browser:any;
    private targetURL:string;
    private rentalType:object;

    public async search() {
        
        let [targetPage]:any = await this.browser.pages();
        await targetPage.goto(this.targetURL);
        
    }
}

module.exports = Padmapper;