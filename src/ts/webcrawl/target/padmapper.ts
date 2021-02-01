const AbstractTarget = require('./target');

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

        //console.log(this.rentalData);

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
        let districtRegionLength = districtRegion.length;
        let paramDistrict = '/' + districtRegion[districtRegionLength - 1].trim().replace(' ', '-') + '-' + districtProvince;

        paramDistrict = paramDistrict.toLowerCase();

        let [targetPage]: any = await this.browser.pages();
        let tempTargetURL: string = this.targetURL;
        let x: number = 0;
        
        console.log(this.targetURL);
        // for loop just for districts
        // go to target site
        tempTargetURL = this.targetURL + paramDistrict + parameterPropertyCategories + buildingData[x] + parameterExcludeAirBnB;
        await targetPage.goto(tempTargetURL, { waituntil: 'networkidle2' });
        
        this.getAllPropertyURL(targetPage);

        /*
        if(!await this.checkMapType(targetPage)) {
            await this.checkEndOfPropertyList(targetPage);
        }
        */

        // 

        // new for-loop to get rental data from list for each building rental type (apartment, house, etc.), then go to the next district
        //}
    }

    private async secondPass() {
        // similar to firstPass()
        // loop through districts but with map view to aggregate similar data
    }

    private async checkMapType(targetPage:any) {
        let selector:string = '*[class^=\"' + this.selectorList['map'] + '\"]';
        let mapExists:boolean = await targetPage.evaluate((selector) => {
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
        let selector:string = '*[class^=\"' + this.selectorList['property_end'] + '\"]';
        
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

    private async getAllPropertyURL(targetPage: any) {
        // use partial classname
        let selectorProperty:string = '*[class*=\"' + this.selectorList['property'] + '\"]';
        // get elements with partial classname
        let property:HTMLElement[] = await targetPage.$$(selectorProperty);
        let propertyLength:number = property.length;
        
        //console.log(await property[0]);

        
        while(propertyLength--) {
            
            let elementBackBtn:HTMLElement[];
            let selectorBackBtn:string = '*[class^=\"' + this.selectorList['property_backBtn'] + '\"]';

            // wait for element to be available
            await targetPage.waitForSelector(selectorProperty);
            // get single property details
            await this.getSinglePropertyURL(targetPage, property[propertyLength]);

            // wait for element to be available
            await targetPage.waitForSelector(selectorBackBtn[0]);
            // load element
            elementBackBtn = await targetPage.$$(selectorBackBtn);
            // go back
            await elementBackBtn[0].click();
            

            // repeat
        }
        
        
    }

    private async getSinglePropertyURL(targetPage:any, property:HTMLElement) {
        
        await property.click();
        
        console.log(await this.getPropertyURL(targetPage));

    }

    private async getPropertyURL(targetPage:any) {
        let selector =  '*[class^=\"' + this.selectorList['property_URL'] + '\"]';
        await targetPage.waitForSelector(selector);
        return await targetPage.evaluate((selector) => {
            try {
                let tempURL = document.querySelectorAll(selector)[0].children[0].href;
                return tempURL.substring(0,tempURL.indexOf("#back="));
            } catch {
                return "No URL";
            }
        }, selector);
    }

    private async getPropertyName(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {
            try {
                return document.querySelectorAll(this.selectorList['property_name'])[0].children[0].innerText;
            } catch {
                return "No data";
            }
        });
    }

    private async getPropertyAddress(subTargetPage:any) {
        let selector = '*[class^=\"' + this.selectorList['property_summary'] + '\"]';
        let tempRow:HTMLElement[] = await subTargetPage.$$(selector);

        return await subTargetPage.evaluate((tempRow) => {
            // row is data in the table
            let tempRowLength = tempRow.length;

            while(tempRowLength--) {
                if(tempRow[tempRowLength].innerText == "Address") {
                    return document.querySelectorAll(this.selectorList['property_summary'][tempRowLength].parentNode.innerText.replace("Address", "").replace("\n", "").trim());
                    break;
                }
            }
            return "No data";
        }, tempRow);
    }

    private async getPropertyRoom(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {
            let tempRoom = {};
            let room = document.querySelectorAll(this.selectorList['property_room']);
            let roomType;
        });
    }

    private async getPropertyRoomType(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {

        });
    }
    
    private async getPropertySize(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {

        });
    }
    
    private async getPropertyBathCount(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {

        });
    }
    
    private async getPropertyCost(subTargetPage:any) {
        return await subTargetPage.evaluate(() => {

        });
    }
}

module.exports = Padmapper;