/**
 * Filename:        crawlRental
 * Description:     Class web crawls rental web applications
 *                  through asynchronous calls.
 *                   
 */
// web crawling library
const puppeteer = require("puppeteer");
// get information for properties of available rental web applications
const rentalConfig = require("../../json/rentalConfig.json");
// web crawling configuration information
const browserConfig = require("../../json/browserConfig.json");
/*
// list of regions to scan
const districtList = require("../../json/district.json");
*/


class CrawlRental {
    // command line argument representing the target rental web application
    private target:string;
    // URL for the target
    private targetURL:string;
    // browser for web crawling
    private browser:any;
    // rental data after crawling
    private rentalData: object;
    private resolve?:any;
    private clientData?: object;

    constructor(arg:string) {
        this.target = arg;
        
    }

    public async crawl(resolve?:any, clientData?:object) {
        this.clientData = clientData;
        (async () => {
            this.targetURL = await this.getTargetURL(this.target);
            this.browser = await puppeteer.launch({
                headless: true,//browserConfig["headless"],
                defaultViewport: null,
                args: [
                    //'--start-maximized',
                    //"--start-fullscreen",
                    '--window-size=' + browserConfig["width"] + ',' + browserConfig["height"]
                ]
            });
            await this.execTargetFunc(this.target);
            this.resolve = resolve;
        })();
    }

    private async getTargetURL(target:string) {
        return rentalConfig[target].target_URL;
    }

    private async execTargetFunc(target:string) {
        eval("this."+rentalConfig[target].crawl_function);
    }

    /**
     * @function        webCrawl_p
     * @description     webCrawl_p is for webCrawl_PadMapper
     * @param           browser 
     * @param           targetURL 
     */
    private async webCrawl_p(browser:any, targetURL:string) {
        // get Class for padmapper web crawling
        const Padmapper = require('./target/padmapper');

        process.stdout.write("Opening crawler.                          \r\033[0G");
        let rentalType:object = rentalConfig[this.target].rental_type;
        let selectorList:object = rentalConfig[this.target].selector;
        let objectList:object = rentalConfig[this.target].object;
        let attributeList:object = rentalConfig[this.target].attribute;
        let selectorInnerDataList:object = rentalConfig[this.target].selector_inner_data;
        let padmapper:any = new Padmapper(browser, targetURL, rentalType, this.clientData, selectorList, attributeList, selectorInnerDataList);
        
        process.stdout.write("Searching for rental data.                          \r\033[0G");
        await padmapper.search();
        
        process.stdout.write("Obtaining rental data.                          \r\033[0G");
        await padmapper.getRentalData()
        this.rentalData = await padmapper.getRentalData();
        process.stdout.write("Completing data collection.                                                                  \r\033[0G");
        await this.browser.close();
        await this.resolve();
    }

    public getRentalData():object {
        return this.rentalData;
    } 

}

module.exports = CrawlRental;