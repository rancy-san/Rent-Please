const AbstractTarget = require('./target');
const Sys = require("../../tools/system");


class Padmapper extends AbstractTarget {
    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private districtList: object;
    private selectorList: object;
    private rentalData: object;

    /**
     * Function Name:   search
     * Description:     Scan rental web application for properties in the area/district 
     */
    public async search() {
        let districtRegion: string[] = this.districtList['region'];
        let districtProvince: string = this.districtList['province'];
        let buildingData: string[] = this.rentalType['building'];
        let buildingDataLength: number = buildingData.length;
        let parameterPropertyCategories: string = this.rentalType['parameter'].property_categories;
        let parameterExcludeAirBnB: string = this.rentalType['parameter'].exclude_airbnb;

        await this.firstPass(districtRegion, districtProvince, buildingData, buildingDataLength, parameterPropertyCategories, parameterExcludeAirBnB);
    }

    /**
     * Function Name:   firstPass
     * Description:     Scans and collects information for all rental properties for all districts
     * @param {string[]} districtRegion array of districts or regions
     * @param {string} districtProvince province code for the district
     * @param {string[]} buildingData types of buildings stored in an array
     * @param {number} buildingDataLength number of type of buildings
     * @param {string} parameterPropertyCategories types of properties
     * @param {string} parameterExcludeAirBnB no airBnB
     */
    private async firstPass(
        districtRegion: string[],
        districtProvince: string,
        buildingData: string[],
        buildingDataLength: number,
        parameterPropertyCategories: string,
        parameterExcludeAirBnB: string
    ) {

        let [targetPage]: any = await this.browser.pages();

        await this.basicPass(targetPage, districtRegion, districtProvince, buildingData, parameterPropertyCategories, buildingDataLength, parameterExcludeAirBnB, 1);

        
    }

    private async secondPass() {
        // similar to firstPass()
        // loop through districts but with map view to aggregate similar data
    }

    private async basicPass(
        targetPage: any,
        districtRegion: string[],
        districtProvince: string,
        buildingData: string[],
        parameterPropertyCategories: string,
        buildingDataLength: number,
        parameterExcludeAirBnB: string,
        passType: number
    ) {
        // number of districts to iterate over
        let tempDistrictRegionLength = districtRegion.length;
        // parameters for the targetURL
        let paramDistrict: string;
        // set first tab to variable
        // set URL from the global variable
        let tempTargetURL: string = this.targetURL;
        // property URL as an array
        let tempPropertyURL: Promise<string[]>;
        // number of property URLs
        let tempPropertyURLLength: number;
        // number of buildings to iterate over
        let tempBuildingDataLength:number;

        // cycle through all districts
        while (tempDistrictRegionLength--) {
            paramDistrict = '/' + districtRegion[tempDistrictRegionLength].trim().replace(' ', '-') + '-' + districtProvince;
            paramDistrict = paramDistrict.toLowerCase();
            tempBuildingDataLength  = buildingDataLength;

            console.log("Working on region... " + districtRegion[tempDistrictRegionLength]);

            while (tempBuildingDataLength--) {
                // go to target site
                tempTargetURL = this.targetURL + paramDistrict + parameterPropertyCategories + buildingData[tempBuildingDataLength] + parameterExcludeAirBnB;

                await targetPage.goto(tempTargetURL, { waituntil: 'networkidle2' });

                // Map must be turned on for 2nd pass data
                if (!await this.checkMapType(targetPage)) {
                    // show map only if there is no map and passType is 2
                    if(passType === 2) {
                        let selector: string = '*[class^=\"' + this.selectorList['map_button'] + '\"]';
                        let elementBackBtn: HTMLElement[] = await targetPage.$$(selector);
                        // go back
                        await elementBackBtn[0].click();
                    }
                }

                console.log("Building type: " + buildingData[tempBuildingDataLength]);    

                // get all URLs for the district
                tempPropertyURL = await this.getAllPropertyURL(targetPage);
                tempPropertyURLLength = (await tempPropertyURL).length;

                if (tempPropertyURLLength > 0) {
                    // cycle through URL and push data to JSON object
                    while (tempPropertyURLLength--) {
                        if (!this.rentalData[districtRegion[tempDistrictRegionLength]].hasOwnProperty(tempPropertyURL[tempPropertyURLLength]))
                            this.rentalData[districtRegion[tempDistrictRegionLength]][tempPropertyURL[tempPropertyURLLength]] = {};
                    }
                }
                else
                    console.log("No rental properties listed for this district.");

                console.log("\r\n");
            }

            console.log(this.rentalData[districtRegion[tempDistrictRegionLength]]);
        }
    }

    private async getRentalPropertyData() {
        // go in URL and get data
    }

    private async checkMapType(targetPage: any) {
        let selector: string = '*[class^=\"' + this.selectorList['map'] + '\"]';
        let mapExists: boolean = await targetPage.evaluate((selector) => {
            try {
                if (document.querySelectorAll(selector).length)
                    return true;
                else
                    return false;
            } catch {
                return false;
            }
        }, selector);

        return mapExists;
    }

    /**
     * Description      Requests for more rental properties until end of list reached
     * @param           {any} targetPage holds browser property for single tab/page
     * @returns         {boolean} endOfList value determined when end of page marker found
     */
    private async checkEndOfPropertyList(targetPage: any) {
        let endOfList: boolean;
        let selector: string = '*[class^=\"' + this.selectorList['property_end'] + '\"]';

        do {
            await targetPage.keyboard.press('End');
            endOfList = await targetPage.evaluate((selector) => {
                try {
                    // 0 = false until true/found = 1
                    if (document.querySelectorAll(selector).length)
                        return true;
                    else
                        return false;
                } catch {
                    return false;
                }
            }, selector);
        } while (endOfList === false);

        return endOfList;
    }

    private async getAllPropertyURL(targetPage: any): Promise<any> {
        // use partial classname
        let selectorProperty: string = '*[class*=\"' + this.selectorList['property'] + '\"]';
        // get elements with partial classname
        let property: HTMLElement[] = await targetPage.$$(selectorProperty);
        let propertyLength: number = property.length;
        let propertyTotal: number = propertyLength;
        let propertyURL: string[] = [];

        let elementBackBtn: HTMLElement[];
        let selectorBackBtn: string = '*[class^=\"' + this.selectorList['property_backBtn'] + '\"]';

        let system = new Sys();

        while (propertyLength--) {

            // wait for element to be available
            await targetPage.waitForSelector(selectorProperty);
            // get single property details
            propertyURL.push(await this.getSinglePropertyURL(targetPage, property[propertyLength]));

            // wait for element to be available
            await targetPage.waitForSelector(selectorBackBtn[0]);
            // load element
            elementBackBtn = await targetPage.$$(selectorBackBtn);
            // go back
            await elementBackBtn[0].click();

            process.stdout.write("Scanning for rental properties...  " + system.percentLoaded(propertyTotal, propertyLength, 0) + " %\033[0G");

            // repeat
        }

        return propertyURL;
    }

    private async getSinglePropertyURL(targetPage: any, property: HTMLElement) {
        await property.click();
        return await this.getPropertyURL(targetPage);
    }

    private async getPropertyURL(targetPage: any): Promise<any> {
        let selector = '*[class^=\"' + this.selectorList['property_URL'] + '\"]';
        await targetPage.waitForSelector(selector);
        return await targetPage.evaluate((selector) => {
            try {
                let tempURL = document.querySelectorAll(selector)[0].children[0].href;
                return tempURL.substring(0, tempURL.indexOf("#back="));
            } catch {
                return "Missing URL";
            }
        }, selector);
    }

    private async getPropertyName(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {
            try {
                return document.querySelectorAll(this.selectorList['property_name'])[0].children[0].innerText;
            } catch {
                return "No data";
            }
        });
    }

    private async getPropertyAddress(subTargetPage: any) {
        let selector = '*[class^=\"' + this.selectorList['property_summary'] + '\"]';
        let tempRow: HTMLElement[] = await subTargetPage.$$(selector);

        return await subTargetPage.evaluate((tempRow) => {
            // row is data in the table
            let tempRowLength = tempRow.length;

            while (tempRowLength--) {
                if (tempRow[tempRowLength].innerText == "Address") {
                    return document.querySelectorAll(this.selectorList['property_summary'][tempRowLength].parentNode.innerText.replace("Address", "").replace("\n", "").trim());
                    break;
                }
            }
            return "No data";
        }, tempRow);
    }

    private async getPropertyRoom(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {
            let tempRoom = {};
            let room = document.querySelectorAll(this.selectorList['property_room']);
            let roomType;
        });
    }

    private async getPropertyRoomType(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {

        });
    }

    private async getPropertySize(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {

        });
    }

    private async getPropertyBathCount(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {

        });
    }

    private async getPropertyCost(subTargetPage: any) {
        return await subTargetPage.evaluate(() => {

        });
    }
}

module.exports = Padmapper;