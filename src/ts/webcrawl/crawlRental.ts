/**
 * Filename:        crawlRental
 * Description:     Class web crawls rental web applications
 *                  through asynchronous calls.
 *                   
 */
// web crawling library
import * as puppeteer from 'puppeteer';
// get information for properties of available rental web applications
const rentalConfig = require("../../json/rentalConfig.json");
// web crawling configuration information
const browserConfig = require("../../json/browserConfig.json");
// list of regions to scan
const districtList = require("../../json/district.json");

class CrawlRental {
    // command line argument representing the target rental web application
    private target:string;
    // URL for the target
    private targetURL:string;
    // browser for web crawling
    private browser:any;

    constructor(arg:string) {
        this.target = arg;
        
    }

    public crawl():void {
        (async () => {
            this.targetURL = await this.getTargetURL(this.target);
            this.browser = await puppeteer.launch({
                headless: browserConfig["headless"],
                defaultViewport: null,
                args: [
                    //'--start-maximized',
                    "--start-fullscreen",
                    '--window-size=' + browserConfig["width"] + ',' + browserConfig["height"]
                ]
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
        // get Class for padmapper web crawling
        const Padmapper = require('./target/padmapper');

        let rentalType:object = rentalConfig[this.target].rental_type;
        let selectorList:object = rentalConfig[this.target].selector;
        let padmapper:any = new Padmapper(browser, targetURL, rentalType, districtList, selectorList);
        await padmapper.search();
    }

}

module.exports = CrawlRental;