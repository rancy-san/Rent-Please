const CrawlRental = require('./crawlRental');

export class RentPlease {

    private crawlRental:any;

    constructor(arg:string){
       this.crawlRental = new CrawlRental(arg);
    }

    public seekRental():void {
        this.crawlRental.crawl();
    }

    private buildRentalNetwork():void {}
    private sortRental():void {}
    private filterRental():void {}
}

module.exports = RentPlease;