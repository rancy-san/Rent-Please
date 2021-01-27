"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentPlease = void 0;
var CrawlRental = require('./crawlRental');
var RentPlease = /** @class */ (function () {
    function RentPlease(arg) {
        this.crawlRental = new CrawlRental(arg);
    }
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