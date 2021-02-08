
/**
 * Filename:        rentPlease.ts
 * Description:     This file contains tasks to call functions to
 *                  process rental data managed by other classes.
 * 
 */

 // Web crawling class
const CrawlRental = require('./webcrawl/crawlRental');

export class RentPlease {
    // holds the crawlRental class to webcrawl rental web applications
    private crawlRental:any;

    constructor()
    constructor(arg:string)
    /**
     * Description:     Instantiate classes for use in the Rent, Please! application.
     * @param           {string} arg the processed argument character from the commandline.
     */
    constructor(arg?:string){
        // instantiate web crawler to first obtain rental data pointing to the arg parameter
       this.crawlRental = new CrawlRental(arg);
    }

    /**
     * Function Name:   seekRental
     * Description:     Crawl the web application indicated by the parameter
     *                  set during initializtion of the CrawlRental object 
     *                  in the constructor.
     */
    public seekRental():void {
        this.crawlRental.crawl();
        return;
    }

    public updateNeighbourhoodList() {

    }

    private buildRentalNetwork():void {}
    private sortRental():void {}
    private filterRental():void {}
}

module.exports = RentPlease;