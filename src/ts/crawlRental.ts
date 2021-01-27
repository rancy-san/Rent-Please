import * as puppeteer from 'puppeteer';
const rentalConfig = require("../json/rentalConfig.json");
const browserConfig = require("../json/browserConfig.json");
const Padmapper = require('./target/padmapper');

class CrawlRental {
    private target:string;

    constructor(arg:string) {
        this.target = arg;
        
    }

    public crawl():void {
        (async () => {

            let targetURL:string = await this.getTargetURL(this.target);
            let browser:any = await puppeteer.launch({
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

    public async webCrawl_p() {
        let padmapper:any = new Padmapper
        await padmapper.search();
    }

}

module.exports = CrawlRental;