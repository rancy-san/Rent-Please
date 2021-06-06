
/**
 * Filename:        rentPlease.ts
 * Description:     This file contains tasks to call functions to
 *                  process rental data managed by other classes.
 * 
 */

// Web crawling class
const CrawlRental = require('./webcrawl/crawlRental');
const DistrictScan = require('./tools/wiki_scan/districtScan');
const CSVOut = require('./tools/data_output/csvOut');

export class RentPlease {
    // holds the crawlRental class to webcrawl rental web applications
    private crawlRental: any;
    private districtScan: any;

    constructor()
    constructor(arg: string)
    /**
     * Description:     Instantiate classes for use in the Rent, Please! application.
     * @param           {string} arg the processed argument character from the commandline.
     */
    constructor(arg?: string) {
        // instantiate web crawler to first obtain rental data pointing to the arg parameter
        this.crawlRental = new CrawlRental(arg);
    }

    /**
     * Function Name:   seekRental
     * Description:     Crawl the web application indicated by the parameter
     *                  set during initializtion of the CrawlRental object 
     *                  in the constructor.
     */
    public async seekRental(resolve?:any, clientData?:object) {
        await this.crawlRental.crawl(resolve, clientData);
        return;
    }

    public updateDistrictList() {
        this.districtScan = new DistrictScan();
        this.districtScan.searchByProvince();
    }

    public async createDistrictDataOutput(resolve?:any, arg?:string) {
        await console.log(JSON.stringify(this.crawlRental.getRentalData()));
        /*
        let csvOut: typeof CSVOut;
        let districtData: object;
        districtData = await this.crawlRental.getRentalData();
        csvOut = await new CSVOut(arg);
        */
        resolve();
    }
}

module.exports = RentPlease;