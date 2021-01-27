import * as puppeteer from 'puppeteer';
const rentalConfig = require("../json/rentalConfig.json");
const browserConfig = require("../json/browserConfig.json");
const Padmapper = require('./target/padmapper');

class CrawlRental {
    private target:string;
    private targetURL:string;
    private browser:any;

    constructor(arg:string) {
        this.target = arg;
        
    }

    public crawl():void {
        (async () => {
            this.targetURL = await this.getTargetURL(this.target);
            this.browser = await puppeteer.launch({
                headless: browserConfig["headless"],
                width: browserConfig["width"] ,
		        height: browserConfig["height"]
            });

            await this.execTargetFunc(this.target);
        })();
    }

    private async getTargetURL(target:string) {
        return rentalConfig[target].target_URL;
    }

    private async execTargetFunc(target:string) {
        eval("this."+rentalConfig[target].crawl_function);
    }

    private async webCrawl_p(browser:any, targetURL:string) {
        let padmapper:any = new Padmapper
        await padmapper.search(browser, targetURL);
    }

}

module.exports = CrawlRental;