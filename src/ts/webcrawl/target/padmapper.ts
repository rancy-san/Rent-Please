const AbstractTarget = require('./target');
const Sys = require("../../tools/system");


class Padmapper extends AbstractTarget {
    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private districtList: object;
    private selectorList: object;
    private objectList: object;
    private rentalData: object;

    /**
     * Function Name:   search
     * Description:     Scan rental web application for properties in the area/district 
     */
    public async search() {
        let districtRegion: string[] = this.districtList['region'];
        let districtProvince: string = this.districtList['province'];
        let buildingData: string[] = this.rentalType['building'];
        let parameterPropertyCategories: string = this.rentalType['parameter'].property_categories;
        let parameterExcludeAirBnB: string = this.rentalType['parameter'].exclude_airbnb;

        await this.firstPass(districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB);
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
        parameterPropertyCategories: string,
        parameterExcludeAirBnB: string
    ) {

        let [targetPage]: any = await this.browser.pages();

        await this.basicPass(targetPage, districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB, 1);

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
        parameterExcludeAirBnB: string,
        passType: number
    ) {
        // number of districts to iterate over
        let tempDistrictRegionLength = districtRegion.length;
        // parameters for the targetURL
        let paramDistrict: string;
        // set first tab to variable
        // set URL from the global variable
        let tempTargetURL: string;
        // property URL as an array
        let tempPropertyURL: Promise<string[]>;
        // number of property URLs
        let tempPropertyURLLength: number;
        // number of buildings to iterate over
        let tempBuildingDataLength: number;

        // cycle through all districts
        while (tempDistrictRegionLength--) {
            paramDistrict = '/' + districtRegion[tempDistrictRegionLength].trim().replace(' ', '-') + '-' + districtProvince;
            paramDistrict = paramDistrict.toLowerCase();
            tempBuildingDataLength = buildingData.length;

            console.log("Working on region... " + districtRegion[tempDistrictRegionLength]);

            while (tempBuildingDataLength--) {
                // go to target site
                tempTargetURL = this.targetURL + paramDistrict + parameterPropertyCategories + buildingData[tempBuildingDataLength] + parameterExcludeAirBnB;

                await targetPage.goto(tempTargetURL, { waituntil: 'networkidle2' });

                // Map must be turned on for 2nd pass data
                if (!await this.checkMapType(targetPage)) {
                    // show map only if there is no map and passType is 2
                    if (passType === 2) {
                        let selector: string = '*[class*=\"' + this.selectorList['map_button'] + '\"]';
                        let elementMapBtn: HTMLElement[] = await targetPage.$$(selector);
                        // go back
                        await elementMapBtn[0].click();
                    }
                }

                console.log("Building type: " + buildingData[tempBuildingDataLength]);
                await this.getRentalPropertyData(targetPage, districtRegion, tempDistrictRegionLength);

                console.log("\r\n");
            }

            console.log(this.rentalData[districtRegion[tempDistrictRegionLength]]);
        }
    }
    private async getRentalPropertyData(targetPage: any, districtRegion: object, tempDistrictRegionLength: number) {
        let selectorProperty: string = '*[class*=\"' + this.selectorList['property'] + '\"]';
        let property: HTMLElement[] = await targetPage.$$(selectorProperty);
        let propertyLength: number = property.length;
        let elementBackBtn: HTMLElement[];
        let selectorBackBtn: string = '*[class*=\"' + this.selectorList['property_backBtn'] + '\"]';


        while (propertyLength--) {
            let propertyURL: string;
            let rentalPropertyWrapper: HTMLElement[];
            let rentalPropertyWrapperLength: number;
            let selectorRoomWrapper: string = '*[class*=\"' + this.selectorList['property_room_wrapper'] + '\"]';

            // wait for page to be loaded
            await targetPage.waitForSelector(selectorProperty);
            // open rental data
            await property[propertyLength].click();
            // URL for rental property as JSON key
            propertyURL = await this.getPropertyURL(targetPage);

            this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL] = { "property": [] };

            // wait for list of rooms to appear
            await targetPage.waitForSelector(selectorRoomWrapper);
            // get list of rooms
            rentalPropertyWrapper = await targetPage.$$(selectorRoomWrapper);
            // get number of elements for list of rooms
            rentalPropertyWrapperLength = rentalPropertyWrapper.length;

            // cycle through the list of rooms
            while (rentalPropertyWrapperLength--) {
                let rentalPropertyRoomContainerCheck: string;
                let selectorPropertyRoomContainerCheck = '*[class*=\"' + this.selectorList['property_room_type_check'] + '\"]';;

                // wait for list of rooms to appear
                await targetPage.waitForSelector(selectorPropertyRoomContainerCheck);
                rentalPropertyRoomContainerCheck = await targetPage.evaluate((selectorPropertyRoomContainerCheck, rentalPropertyWrapperLength: number) => {
                    return document.querySelectorAll(selectorPropertyRoomContainerCheck)[rentalPropertyWrapperLength].innerText;
                }, selectorPropertyRoomContainerCheck, rentalPropertyWrapperLength);

                if (rentalPropertyRoomContainerCheck.toLowerCase() != "unavailable") {

                    let rentalPropertyRoomContainer: HTMLElement[];
                    let rentalPropertyRoomContainerLength: number;
                    let selectorRoomContainer: string = '*[class*=\"' + this.selectorList['property_room_container'] + '\"]';
                    await targetPage.waitForTimeout(1000);

                    // open property room type
                    await rentalPropertyWrapper[rentalPropertyWrapperLength].click();

                    // wait for list of rooms to appear
                    await targetPage.waitForSelector(selectorRoomContainer);

                    rentalPropertyRoomContainer = await targetPage.$$(selectorRoomContainer);
                    rentalPropertyRoomContainerLength = rentalPropertyRoomContainer.length;

                    while (rentalPropertyRoomContainerLength--) {
                        await targetPage.evaluate((selectorRoomContainer, rentalPropertyRoomContainerLength) => {
                            return document.querySelectorAll(selectorRoomContainer)[rentalPropertyRoomContainerLength].children[1].children[0].children[0].children[0].children[0].innerText;
                        }, selectorRoomContainer, rentalPropertyRoomContainerLength);
                        // store basic info and all amenities of each available suite
                        this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property'].push(await this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer[rentalPropertyRoomContainerLength]));
                    }

                    await targetPage.waitForTimeout(1000);

                    // close room type container
                    await rentalPropertyWrapper[rentalPropertyWrapperLength].click();
                }
            }

            console.log(await this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property']);

            await targetPage.waitForSelector(selectorBackBtn);
            // load element
            elementBackBtn = await targetPage.$$(selectorBackBtn);
            // go back
            await elementBackBtn[0].click();
        }
    }

    private async getRentalPropertyDataObject(targetPage: any, propertyLength: number, rentalPropertyWrapperLength: number, rentalPropertyRoomContainer: HTMLElement) {
        let rentalProperty: object = {};
        rentalProperty['basic_information'] = await this.getPropertyDataBasicInformation(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer);
        rentalProperty['apartment_amenities'] = await this.getPropertyDataApartmentAmenitites(targetPage, propertyLength);
        rentalProperty['building_amenities'] = await this.getPropertyDataBuildingAmenities(targetPage, propertyLength);

        return rentalProperty;
    }

    private async getPropertyDataBasicInformation(targetPage: any, propertyLength: number, rentalPropertyWrapperLength: number, rentalPropertyRoomContainer: HTMLElement) {
        let basicInformation = {};
        // property name
        basicInformation['building_name'] = await this.getPropertyName(targetPage, propertyLength);
        // property address
        basicInformation['building_address'] = await this.getPropertyAddress(targetPage, propertyLength);
        // building postal code
        basicInformation['building_postal_code'] = await this.getPropertyPostalCode(targetPage, propertyLength);
        // store building type
        basicInformation['building_type'] = await this.getPropertyBuildingType(targetPage);

        // number of rooms
        basicInformation['room'] = await this.getPropertyRoomType(targetPage, rentalPropertyRoomContainer);
        // rent price
        basicInformation['cost'] = await this.getPropertyCost(targetPage, rentalPropertyRoomContainer);
        // size of suite
        basicInformation['sqft'] = await this.getPropertySize(targetPage, rentalPropertyRoomContainer);
        // number of bathroom
        basicInformation['bathroom'] = await this.getPropertyBathCount(targetPage, rentalPropertyRoomContainer);


        return basicInformation;
    }

    private async getPropertyDataApartmentAmenitites(targetPage: any, propertyLength: number) {
        let apartmentAmenity: string[];
        try {
            apartmentAmenity = await this.getPropertyObjectKey(targetPage, this.objectList['apartment_amenity'], propertyLength);
            if (apartmentAmenity === null || apartmentAmenity.length < 1) {
                return [];
            }
            else
                return apartmentAmenity;
        } catch {
            return [];
        }
    }

    private async getPropertyDataBuildingAmenities(targetPage: any, propertyLength:number) {
        let buildingAmenity: string[];
        try {
            buildingAmenity = await this.getPropertyObjectKey(targetPage, this.objectList['building_amenity'], propertyLength);
            if(buildingAmenity === null || buildingAmenity.length < 1) {
                return [];
            }
             else
                return buildingAmenity;
        } catch {
            return [];
        }
    }

    private async checkMapType(targetPage: any) {
        let selector: string = '*[class*=\"' + this.selectorList['map'] + '\"]';
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
        let selector: string = '*[class*=\"' + this.selectorList['property_end'] + '\"]';

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

    private async getPropertyObjectKey(targetPage: any, key: string, propertyLength: number) {

        return await targetPage.evaluate((key, propertyLength) => {
            //@ts-ignore
            return __PRELOADED_STATE__["currentSearch"]["listables"]["listables"][propertyLength][key];
        }, key, propertyLength);
    }
    private async getSinglePropertyURL(targetPage: any) {
        return await this.getPropertyURL(targetPage);
    }


    private async getPropertyURL(targetPage: any) {
        let selector: string = '*[class*=\"' + this.selectorList['property_URL'] + '\"]';
        await targetPage.waitForSelector(selector);
        return await targetPage.evaluate((selector) => {
            try {
                let tempURL: string = document.querySelectorAll(selector)[0].children[0].href;
                return tempURL.substring(0, tempURL.indexOf("#back="));
            } catch {
                return "No property URL";
            }
        }, selector);
    }


    private async getPropertyName(targetPage: any, propertyLength: number) {
        try {
            return await this.getPropertyObjectKey(targetPage, this.objectList['property_name'], propertyLength);
        } catch {
            return "No property name.";
        }
    }

    private async getPropertyAddress(targetPage: any, propertyLength: number) {
        try {
            return await this.getPropertyObjectKey(targetPage, this.objectList['property_address'], propertyLength);
        } catch {
            return "No property address.";
        }
    }

    private async getPropertyPostalCode(targetPage: any, propertyLength: number) {
        try {
            return await this.getPropertyObjectKey(targetPage, this.objectList['property_postal_code'], propertyLength);
        } catch {
            return "No property postal code.";
        }
    }

    private async getPropertyBuildingType(targetPage: any) {
        let buildingType: string = targetPage.url();

        // remove junk strings, get building type
        buildingType = buildingType.substring(buildingType.indexOf("property-categories="), buildingType.length);
        buildingType = buildingType.substring(0, buildingType.indexOf("&exclude-airbnb"));
        buildingType = buildingType.replace("property-categories=", "");

        return buildingType;
    }

    private async getPropertyRoomType(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_room_type'] + '\"]';
        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);

        } catch {
            return "No property room type.";
        }
    }

    private async getPropertySize(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_sqft'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "No property size.";
        }
    }

    private async getPropertyBathCount(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_bath'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "No property bath count.";
        }
    }

    private async getPropertyCost(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_cost'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "No property cost.";
        }
    }

}

module.exports = Padmapper;