
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
        let csvOut: typeof CSVOut;
        let districtData: object;
        districtData = {
            "0": {
              "Esquimalt": "-123.43879198109845,48.416050431672375,-123.38578022774044,48.441362556926975",
              "https://www.padmapper.com/apartments/10063697p/2-bedroom-1-bath-apartment-at-611-admirals-rd-esquimalt-bc-v9a-2n6": {
                "property": [
                  {
                    "basic_information": {
                      "building_name": "611 Admirals Rd",
                      "Address": "611 Admirals Rd",
                      "building_postal_code": "V9A 2N6",
                      "Property Type": "condo",
                      "Floor (sqft)": "700",
                      "Bathroom Count": "1",
                      "Bedroom Count": "2",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [
                      "On Site Laundry",
                      "Hardwood Floor",
                      "Balcony"
                    ],
                    "Building Amenity": [
                      "On Site Laundry",
                      "Elevator"
                    ]
                  }
                ]
              },
              "https://www.padmapper.com/buildings/p289189/magnolia-manor-apartments-at-830-craigflower-rd-esquimalt-bc-v9a-2w9": {
                "property": [
                  {
                    "basic_information": {
                      "building_name": "Magnolia Manor",
                      "Address": "830 Craigflower Rd",
                      "building_postal_code": "V9A 2W9",
                      "Property Type": "condo",
                      "Rental Cost ($CAD)": "1625",
                      "Bedroom Count": "2",
                      "Floor (sqft)": "No Data",
                      "Bathroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  }
                ]
              },
              "https://www.padmapper.com/buildings/p470646/sentinel-apartments-at-625-constance-ave-victoria-bc-v9a-6n8": {
                "property": [
                  {
                    "basic_information": {
                      "building_name": "Sentinel Apartments",
                      "Address": "625 Constance Ave",
                      "building_postal_code": "V9A 6N8",
                      "Property Type": "condo",
                      "Rental Cost ($CAD)": "1325",
                      "Bedroom Count": "1",
                      "Floor (sqft)": "No Data",
                      "Bathroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  }
                ]
              }
            },
            "1": {
              "Saanich": "-123.38674437883984,48.44964412237118,-123.34529848708146,48.469421756972196",
              "https://www.padmapper.com/buildings/p446272/don-quadra-apartments-at-3244-quadra-st-saanich-bc-v8x-1g2": {
                    "property": [
                  {
                    "basic_information": {
                      "building_name": "Don Quadra Apartments",
                      "Address": "3244 Quadra St",
                      "building_postal_code": "V8X 1G2",
                      "Property Type": "condo",
                      "Rental Cost ($CAD)": "1225",
                      "Bedroom Count": "No Data",
                      "Floor (sqft)": "No Data",
                      "Bathroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  }
                ]
              },
              "https://www.padmapper.com/buildings/p446268/fair-oaks-apartments-at-3501-savannah-ave-saanich-bc-v8x-1s6": {
                "property": [
                  {
                    "basic_information": {
                      "building_name": "Fair Oaks Apartments",
                      "Address": "3501 Savannah Ave",
                      "building_postal_code": "V8X 1S6",
                      "Property Type": "condo",
                      "Rental Cost ($CAD)": "1695",
                      "Bedroom Count": "2",
                      "Floor (sqft)": "No Data",
                      "Bathroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  },
                  {
                    "basic_information": {
                      "building_name": "Fair Oaks Apartments",
                      "Address": "3501 Savannah Ave",
                      "building_postal_code": "V8X 1S6",
                      "Property Type": "condo",
                      "Rental Cost ($CAD)": "1375",
                      "Bedroom Count": "1",
                      "Floor (sqft)": "No Data",
                      "Bathroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  }
                ]
              },
              "": {
                "property": [
                  {
                    "basic_information": {
                      "building_name": "Glasgow Avenue",
                      "Address": "Glasgow Avenue",
                      "building_postal_code": null,
                      "Property Type": "condo",
                      "Bathroom Count": "1",
                      "Bedroom Count": "1",
                      "Lease Length": "Long",
                      "Dogs Allowed": "NO",
                      "Cats Allowed": "NO"
                    },
                    "In-Unit Amenity": [],
                    "Building Amenity": []
                  }
                ]
              }
            }
          };
        //districtData = await this.crawlRental.getRentalData();
        csvOut = await new CSVOut(districtData, arg);
        await csvOut.appendDataToXLSX();
        await csvOut.saveXLSX();
        
        resolve();
    }
}

module.exports = RentPlease;