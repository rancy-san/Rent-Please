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
        let districtProvince: string[] = this.districtList['province'];
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
     * @param {string} parameterPropertyCategories types of properties
     * @param {string} parameterExcludeAirBnB no airBnB
     */
    private async firstPass(
        districtRegion: string[],
        districtProvince: string[],
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
        districtProvince: string[],
        buildingData: string[],
        parameterPropertyCategories: string,
        parameterExcludeAirBnB: string,
        passType: number
    ) {
        let tempDistrictProvinceLength:number = districtProvince.length;
        // number of districts to iterate over
        let tempDistrictRegionLength:number;
        // parameters for the targetURL
        let paramDistrict: string;
        // set URL from the global variable
        let tempTargetURL: string;
        // property URL as an array
        let tempPropertyURL: Promise<string[]>;
        // number of property URLs
        let tempPropertyURLLength: number;
        // number of buildings to iterate over
        let tempBuildingDataLength: number;

        // cycle through province
        while (tempDistrictProvinceLength--) {
            tempDistrictRegionLength = districtRegion.length;
            // cycle through all districts
            while (tempDistrictRegionLength--) {
                paramDistrict = '/' + districtRegion[tempDistrictRegionLength].trim().replace(' ', '-') + '-' + districtProvince[tempDistrictProvinceLength];
                paramDistrict = paramDistrict.toLowerCase();
                tempBuildingDataLength = buildingData.length;

                console.log("Working on region... " + districtRegion[tempDistrictRegionLength]);

                while (tempBuildingDataLength--) {
                    // go to target site
                    tempTargetURL = this.targetURL + paramDistrict + parameterPropertyCategories + buildingData[tempBuildingDataLength] + parameterExcludeAirBnB;

                    await targetPage.goto(tempTargetURL, { waituntil: 'networkidle2' });

                    await this.checkEndOfPropertyList(targetPage);

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
    }

    private async getRentalPropertyData(targetPage: any, districtRegion: object, tempDistrictRegionLength: number) {
        let selectorProperty: string = '*[class*=\"' + this.selectorList['property'] + '\"]';
        let property: HTMLElement[] = await targetPage.$$(selectorProperty);
        let propertyLength: number = property.length;
        let propertyTotalCount: number = propertyLength;
        let elementBackBtn: HTMLElement[];
        let selectorBackBtn: string = '*[class*=\"' + this.selectorList['property_backBtn'] + '\"]';
        let system: (typeof Sys) = new Sys();


        while (propertyLength--) {
            let propertyURL: string;

            // wait for page to be loaded
            await targetPage.waitForSelector(selectorProperty);
            // open rental data
            await property[propertyLength].click();
            // URL for rental property as JSON key
            propertyURL = await this.getPropertyURL(targetPage);
            this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL] = { "property": [] };

            // loop through the outer element for each room type
            await this.cycleThroughPropertyWrapper(targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength);

            process.stdout.write("Collecting rental data... " + await system.percentLoaded(propertyTotalCount, propertyLength, 0) + "%\r\033[0G");

            await targetPage.waitForSelector(selectorBackBtn);
            // load element
            elementBackBtn = await targetPage.$$(selectorBackBtn);
            // go back
            await elementBackBtn[0].click();
        }
        console.log(this.rentalData);
    }

    private async cycleThroughPropertyWrapper(targetPage: any, districtRegion: object, tempDistrictRegionLength: number, propertyURL: string, propertyLength: number) {
        let rentalPropertyWrapper: HTMLElement[];
        let rentalPropertyWrapperLength: number;
        let selectorRoomWrapper: string = '*[class*=\"' + this.selectorList['property_room_wrapper'] + '\"]';
        let selectorError:boolean;

        try {
            // wait for list of rooms to appear
            await targetPage.waitForSelector(selectorRoomWrapper, { timeout: 500 });
            selectorError = false;
        } catch {
            // take different route if no room type to select
            this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property'].push(await this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, null));
            selectorError = true;
        }
        if(!selectorError) {
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
                    // open property room type
                    await rentalPropertyWrapper[rentalPropertyWrapperLength].click();

                    // loop through the room types
                    await this.cycleThroughPropertyContainer(targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength, rentalPropertyWrapperLength);

                    // close room type container
                    await rentalPropertyWrapper[rentalPropertyWrapperLength].click();
                }
            }
        }
        console.log(this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property']);
    }

    private async cycleThroughPropertyContainer(targetPage: any, districtRegion: object, tempDistrictRegionLength: number, propertyURL: string, propertyLength: number, rentalPropertyWrapperLength: number) {
        let rentalPropertyRoomContainer: HTMLElement[];
        let rentalPropertyRoomContainerLength: number;
        let selectorRoomContainer: string = '*[class*=\"' + this.selectorList['property_room_container'] + '\"]';

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
    }

    private async getRentalPropertyDataObject(targetPage: any, propertyLength: number, rentalPropertyWrapperLength: number, rentalPropertyRoomContainer: HTMLElement) {
        let rentalProperty: object = {};
        rentalProperty['basic_information'] = await this.getPropertyDataBasicInformation(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer);
        rentalProperty['apartment_amenities'] = await this.getPropertyDataApartmentAmenities(targetPage, propertyLength);
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

        // if not null, get data like usual
        if (rentalPropertyRoomContainer) {
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
        }


        return basicInformation;
    }

    private async getPropertyDataAmenities(targetPage:any, amenityType:string) {
        let amenity:string[] = [];
        let selectorAmenityContainer:string = '*[class*=\"' + this.selectorList['property_amenity_container'] + '\"]';
        let amenityContainer:HTMLElement[] = await targetPage.$$(selectorAmenityContainer);
        let amenityContainerLength:number = amenityContainer.length;

        try {
            await targetPage.waitForSelector(selectorAmenityContainer, { timeout: 500 });

            // cycle through either apartment or building or both amenity types
            while (amenityContainerLength--) {
                let tempAmenityContainer:HTMLElement = amenityContainer[amenityContainerLength];

                let amenityText:string = await targetPage.evaluate((tempAmenityContainer) => {
                    return tempAmenityContainer.innerText;
                }, tempAmenityContainer);

                if (amenityText.toLowerCase().includes(amenityType.toLowerCase())) {
                    
                    let selectorAmenity: string = '*[class*=\"' + this.selectorList['property_amenity'] + '\"]';
                    let amenityLength: number = await targetPage.evaluate((selectorAmenityContainer:string, amenityContainerLength:number, selectorAmenity:string) => {
                        return document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity).length;
                    }, selectorAmenityContainer, amenityContainerLength, selectorAmenity);

                    amenity = await targetPage.evaluate((selectorAmenityContainer:string, amenityContainerLength:number, selectorAmenity:string, amenityLength:number) => {
                        let tempAmenity:string[] = [];
                        while(amenityLength--) {
                            let tempAmenityValue:string = (document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity)[amenityLength] as HTMLElement).innerText;
                            tempAmenity.push(tempAmenityValue);
                        }
                        return tempAmenity;
                    }, selectorAmenityContainer, amenityContainerLength, selectorAmenity, amenityLength);
                }
            }

            return amenity;
        } catch {
            return [];
        }
    }

    private async getPropertyDataApartmentAmenities(targetPage: any, propertyLength: number) {
        return await this.getPropertyDataAmenities(targetPage, 'apartment amenities');
    }

    private async getPropertyDataBuildingAmenities(targetPage: any, propertyLength: number) {
        return await this.getPropertyDataAmenities(targetPage, 'building amenities');
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

        // loop until end of page marker found
        do {
            // page down to reveal more properties from lazy loading
            await targetPage.keyboard.press('End');
            // find end of page marker
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

    private async getPropertyURL(targetPage: any) {
        let selector: string = '*[class*=\"' + this.selectorList['property_URL'] + '\"]';
        await targetPage.waitForSelector(selector);
        return await targetPage.evaluate((selector) => {
            try {
                let tempURL: string = document.querySelectorAll(selector)[0].children[0].href;
                return tempURL.substring(0, tempURL.indexOf("#back="));
            } catch {
                return "—";
            }
        }, selector);
    }

    private async getPropertyAttribute(targetPage: any, propertyLength: number, attributeValue:string) {
        let selector: string = '*[class*=\"' + this.selectorList['property_container'] + '\"]';
        let attribute: string = '[itemprop=' + attributeValue + ']';

        return await targetPage.evaluate((selector, propertyLength, attribute) => {
            return document.querySelectorAll(selector)[propertyLength].querySelectorAll(attribute)[0].getAttribute("content");
        }, selector, propertyLength, attribute);
    }

    private async getPropertyName(targetPage: any, propertyLength: number) {
        let attributeValue: string = this.attributeList['property_name'];
        try {
            return await this.getPropertyAttribute(targetPage, propertyLength, attributeValue);
        } catch {
            return "—";
        }
    }

    private async getPropertyAddress(targetPage: any, propertyLength: number) {
        let attributeValue: string = this.attributeList['property_address'];
        try {
            return await this.getPropertyAttribute(targetPage, propertyLength, attributeValue);
        } catch {
            return "—";
        }
    }

    private async getPropertyPostalCode(targetPage: any, propertyLength: number) {
        let attributeValue: string = this.attributeList['property_postal_code'];
        try {
            return await this.getPropertyAttribute(targetPage, propertyLength, attributeValue);
        } catch {
            return "—";
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
            return "—";
        }
    }

    private async getPropertySize(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_sqft'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "—";
        }
    }

    private async getPropertyBathCount(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_bath'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "—";
        }
    }

    private async getPropertyCost(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_cost'] + '\"]';

        try {
            return await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
            }, rentalPropertyRoomContainer, selector);
        } catch {
            return "—";
        }
    }

}

module.exports = Padmapper;