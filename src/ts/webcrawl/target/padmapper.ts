const AbstractTarget = require('./target');

class Padmapper extends AbstractTarget {
    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private districtList: object;
    private selectorList: object;

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
        await targetPage.goto(tempTargetURL);
        // loop here
        // grab available rental data from list (make sure it is not map view), then go to next district (don't select building rental type yet so that data is specific to district)
        if(!await this.checkMapType) {
            await this.checkEndOfPropertyList(targetPage);
        }


        // [0].children[0].children.length

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
        let selector:string = '*[class^=\"' + this.selectorList['property_list_end'] + '\"]';
        
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

    private async getProperty(targetPage: any) {
        
    }
}

module.exports = Padmapper;