import * as puppeteer from 'puppeteer';
const rentalReference = require("../json/rentalReference.json");
const Padmapper = require('./target/padmapper');

class CrawlRental {
    private target:string;
    private browser:any;

    constructor(arg:string) {
        this.target = arg;
        
    }

    public crawl():void {
        (async () => {

            let targetURL = await this.getTargetURL(this.target);
            await this.execTargetFunc(this.target);
            

        })();
    }

    private async getTargetURL(target:string) {
        return rentalReference[target].targetURL;
    }

    private async execTargetFunc(target:string) {
        eval("this."+rentalReference[target].crawlFunction);
    }

    public async webCrawl_p() {
        let padmapper:any = new Padmapper
        await padmapper.search();
    }

}

module.exports = CrawlRental;