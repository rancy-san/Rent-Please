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
var CrawlRental = require('./crawlRental');
var RentPlease = /** @class */ (function () {
    /**
     * Constructor description:     Instantiate classes for use in the Rent, Please! application.
     * Parameter:                   arg:string, the processed argument character from the commandline.
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
    };
    RentPlease.prototype.buildRentalNetwork = function () { };
    RentPlease.prototype.sortRental = function () { };
    RentPlease.prototype.filterRental = function () { };
    return RentPlease;
}());
exports.RentPlease = RentPlease;
module.exports = RentPlease;
//# sourceMappingURL=rentPlease.js.map