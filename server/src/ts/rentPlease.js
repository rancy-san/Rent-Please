"use strict";
/**
 * Filename:        rentPlease.ts
 * Description:     This file contains tasks to call functions to
 *                  process rental data managed by other classes.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentPlease = void 0;
// Web crawling class
var CrawlRental = require('./webcrawl/crawlRental');
var DistrictScan = require('./tools/wiki_scan/districtScan');
var RentPlease = /** @class */ (function () {
    /**
     * Description:     Instantiate classes for use in the Rent, Please! application.
     * @param           {string} arg the processed argument character from the commandline.
     */
    function RentPlease(arg) {
        // instantiate web crawler to first obtain rental data pointing to the arg parameter
        this.crawlRental = new CrawlRental(arg);
    }
    /**
     * Function Name:   seekRental
     * Description:     Crawl the web application indicated by the parameter
     *                  set during initializtion of the CrawlRental object
     *                  in the constructor.
     */
    RentPlease.prototype.seekRental = function () {
        this.crawlRental.crawl();
        return;
    };
    RentPlease.prototype.updateDistrictList = function () {
        this.districtScan = new DistrictScan();
        this.districtScan.searchByProvince();
        //this.districtScan.searchPages("Neighbourhoods in Timmins");
        /*
        let redisDatabase:any = new RedisDatabase();
        redisDatabase.rpushQueueData("testKey", "testData");
        */
    };
    RentPlease.prototype.buildRentalNetwork = function () { };
    RentPlease.prototype.sortRental = function () { };
    RentPlease.prototype.filterRental = function () { };
    return RentPlease;
}());
exports.RentPlease = RentPlease;
module.exports = RentPlease;
//# sourceMappingURL=rentPlease.js.map