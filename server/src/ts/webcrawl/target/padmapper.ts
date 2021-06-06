const CrawlTarget = require('./target');
const Sys = require("../../tools/system/system");


class Padmapper extends CrawlTarget {
    private browser: any;
    private targetURL: string;
    private rentalType: object;
    private rentalData: object;



    /**
     * @function        search
     * @description     Scan rental web application for properties in the area/district 
     */
    public async search() {
        let buildingData: string[] = this.rentalType['building'];
        let parameterPropertyCategories: string = this.rentalType['parameter'].property_categories;
        let parameterExcludeAirBnB: string = this.rentalType['parameter'].exclude_airbnb;

        await this.firstPass(buildingData, parameterPropertyCategories, parameterExcludeAirBnB);
    }

    public async getRentalData(): Promise<object> {
        return this.rentalData;
    }

    /**
     * @function        firstPass
     * @description     Scans and collects information for all rental properties for all districts
     * @param           {string[]} districtRegion array of districts or regions
     * @param           {string} districtProvince province code for the district
     * @param           {string[]} buildingData types of buildings stored in an array
     * @param           {string} parameterPropertyCategories types of properties
     * @param           {string} parameterExcludeAirBnB no airBnB
     */
    private async firstPass(
        buildingData: string[],
        parameterPropertyCategories: string,
        parameterExcludeAirBnB: string
    ) {
        let [targetPage]: any = await this.browser.pages();
        await this.basicPass(targetPage,buildingData, parameterPropertyCategories, parameterExcludeAirBnB, 1);
    }

    private async basicPass(
        targetPage: any,
        buildingData: string[],
        parameterPropertyCategories: string,
        parameterExcludeAirBnB: string,
        passType: number
    ) {
        let tempClientDataLength: number = this.getDataClientLength();
        // parameters for the targetURL
        let paramBBox: string;
        // set URL from the global variable
        let tempTargetURL: string;
        // property URL as an array
        let tempPropertyURL: Promise<string[]>;
        // number of property URLs
        let tempPropertyURLLength: number;
        // number of buildings to iterate over
        let tempBuildingDataLength: number;

        // cycle through province
        while (tempClientDataLength--) {
            let key = Object.keys(this.clientData[tempClientDataLength])[0];
            let value = Object.values(this.clientData[tempClientDataLength])[0];
            
            paramBBox = '&box=' + value;
            
            tempBuildingDataLength = buildingData.length;

            while (tempBuildingDataLength--) {
                // go to target site
                tempTargetURL = this.targetURL + parameterPropertyCategories + buildingData[tempBuildingDataLength] + parameterExcludeAirBnB + paramBBox;

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
                await this.getRentalPropertyData(targetPage, tempClientDataLength, key, buildingData[tempBuildingDataLength]);
            }
        }
        //console.log(this.rentalData);
    }

    private async getRentalPropertyData(targetPage: any, tempClientDataLength:number, key:string, buildingType:string) {
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
            this.rentalData[tempClientDataLength][propertyURL] = { "property": [] };

            
            // loop through the outer element for each room type
            await this.cycleThroughPropertyWrapper(targetPage, tempClientDataLength, propertyURL, propertyLength);

            process.stdout.write("Collecting " + key + "'s " + buildingType + " rental data... " + await system.percentLoaded(propertyTotalCount, propertyLength, 0) + "%                          \r\033[0G");
            await targetPage.waitForSelector(selectorBackBtn);
            // load element
            elementBackBtn = await targetPage.$$(selectorBackBtn);
            // go back
            await elementBackBtn[0].click();
            
        }
    }

    private async cycleThroughPropertyWrapper(targetPage: any, tempClientDataLength: number, propertyURL: string, propertyLength: number) {
        let rentalPropertyWrapper: HTMLElement[];
        let rentalPropertyWrapperLength: number;
        let selectorRoomWrapper: string = '*[class*=\"' + this.selectorList['property_room_wrapper'] + '\"]';
        let selectorError: boolean;

        try {
            // wait for list of rooms to appear
            await targetPage.waitForSelector(selectorRoomWrapper, { timeout: 500 });
            selectorError = false;
        } catch {
            // take different route if no room type to select
            this.rentalData[tempClientDataLength][propertyURL]['property'].push(await this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, null));
            selectorError = true;
        }
        if (!selectorError) {
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
                    await this.cycleThroughPropertyContainer(targetPage, tempClientDataLength, propertyURL, propertyLength, rentalPropertyWrapperLength);

                    // close room type container
                    await rentalPropertyWrapper[rentalPropertyWrapperLength].click();
                }
            }
        }
    }

    private async cycleThroughPropertyContainer(targetPage: any,tempClientDataLength: number, propertyURL: string, propertyLength: number, rentalPropertyWrapperLength: number) {
        let rentalPropertyRoomContainer: HTMLElement[];
        let rentalPropertyRoomContainerLength: number;
        let selectorRoomContainer: string = '*[class*=\"' + this.selectorList['property_room_container'] + '\"]';

        // wait for list of rooms to appear
        await targetPage.waitForSelector(selectorRoomContainer);

        rentalPropertyRoomContainer = await targetPage.$$(selectorRoomContainer);
        rentalPropertyRoomContainerLength = rentalPropertyRoomContainer.length;

        while (rentalPropertyRoomContainerLength--) {
            // store basic info and all amenities of each available suite
            this.rentalData[tempClientDataLength][propertyURL]['property'].push(await this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer[rentalPropertyRoomContainerLength]));
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
        let basicInformation: object = {};

        // property name
        basicInformation['building_name'] = await this.getPropertyName(targetPage, propertyLength);
        // property address
        basicInformation['building_address'] = await this.getPropertyAddress(targetPage, propertyLength);
        // building postal code
        basicInformation['building_postal_code'] = await this.getPropertyPostalCode(targetPage, propertyLength);
        // store building type
        basicInformation['building_type'] = await this.getPropertyBuildingType(targetPage);

        // if not null, get data like usual
        if (rentalPropertyRoomContainer) {
            // rent price
            basicInformation['rental_cost'] = await this.getPropertyCost(targetPage, rentalPropertyRoomContainer);
            // number of rooms
            basicInformation['bedroom_count'] = await this.getPropertyRoomType(targetPage, rentalPropertyRoomContainer);
            // size of suite
            basicInformation['floor'] = await this.getPropertySize(targetPage, rentalPropertyRoomContainer);
            // number of bathroom
            basicInformation['bathroom_count'] = await this.getPropertyBathCount(targetPage, rentalPropertyRoomContainer);
        }
        basicInformation = await this.getPropertyIconInformationDefault(targetPage, basicInformation);
        basicInformation = await this.getPropertyTagInformationDefault(targetPage, basicInformation);


        return basicInformation;
    }

    private async getPropertyTagInformationDefault(targetPage: any, basicInformation: object): Promise<object> {

        let selectorTagContainer: string = '*[class*=\"' + this.selectorList['property_basic_tag_default'] + '\"]';
        let tagContainer: HTMLElement[] = await targetPage.$$(selectorTagContainer);
        let tagContainerLength: number = tagContainer.length;

        try {
            // default data unless otherwise indicated by the rental listing
            basicInformation['lease_length'] = "Long";
            basicInformation['dogs_allowed'] = "NO";
            basicInformation['cats_allowed'] = "NO";

            await targetPage.waitForSelector(selectorTagContainer, { timeout: 500 });

            while (tagContainerLength--) {
                let tempTagContainer: HTMLElement = tagContainer[tagContainerLength];
                let tagContainerText: string = await targetPage.evaluate((tempTagContainer) => {
                    return tempTagContainer.innerText;
                }, tempTagContainer);

                // default inputs before obtainining data
                if (!basicInformation['lease_length']) {
                    if (tagContainerText == this.selectorInnerDataList['lease_length_tag']) {
                        basicInformation['lease_length'] = "Short";
                    }
                }
                if (!basicInformation['dogs_allowed'] && !basicInformation['cats_allowed']) {
                    if (tagContainerText == this.selectorInnerDataList['pets_allowed_tag']) {
                        basicInformation['dogs_allowed'] = "YES";
                        basicInformation['cats_allowed'] = "YES";
                    }
                }
            }
        } catch (e) {}
        return basicInformation;
    }

    private async getPropertyIconInformationDefault(targetPage: any, basicInformation: object): Promise<object> {

        let selectorIconContainer: string = '*[class*=\"' + this.selectorList['property_basic_icon_default'] + '\"]';
        let iconContainer: HTMLElement[] = await targetPage.$$(selectorIconContainer);
        let iconContainerLength: number = iconContainer.length;

        try {
            await targetPage.waitForSelector(selectorIconContainer, { timeout: 500 });

            while (iconContainerLength--) {
                let tempIconContainer: HTMLElement = iconContainer[iconContainerLength];
                let iconContainerText: string = await targetPage.evaluate((tempIconContainer: HTMLElement) => {
                    return tempIconContainer.innerText;
                }, tempIconContainer);
                let iconContainerSVGText: string = await targetPage.evaluate((tempIconContainer: HTMLElement) => {
                    return tempIconContainer.getElementsByTagName("svg")[0].getElementsByTagName("title")[0].innerHTML.toString();
                }, tempIconContainer);

                switch (iconContainerSVGText) {
                    case this.selectorInnerDataList['room_count_icon']: {
                        basicInformation['bedroom_count'] = iconContainerText.replace(/[^0-9]/g, '');
                        break;
                    }
                    case this.selectorInnerDataList['bathroom_count_icon']: {
                        basicInformation['bathroom_count'] = iconContainerText.replace(/[^0-9]/g, '');
                        break;
                    }
                    case this.selectorInnerDataList['floor_size_icon']: {
                        basicInformation['floor'] = iconContainerText.replace(/[^0-9]/g, '');
                        break;
                    }
                    case this.selectorInnerDataList['dogs1_allowed_icon']: {
                        if (iconContainerText != "NO INFO")
                            basicInformation['dogs_allowed'] = iconContainerText;
                        break;
                    }
                    case this.selectorInnerDataList['dogs2_allowed_icon']: {
                        if (iconContainerText != "NO INFO")
                            basicInformation['dogs_allowed'] = iconContainerText;
                        break;
                    }
                    case this.selectorInnerDataList['cats_allowed_icon']: {
                        if (iconContainerText != "NO INFO")
                            basicInformation['cats_allowed'] = iconContainerText;
                        break;
                    }
                }
            }
        } catch (e) {}


        return basicInformation;
    }

    private async getPropertyDataAmenities(targetPage: any, amenityType: string) {
        let amenity: string[] = [];
        let selectorAmenityContainer: string = '*[class*=\"' + this.selectorList['property_amenity_container'] + '\"]';
        let amenityContainer: HTMLElement[] = await targetPage.$$(selectorAmenityContainer);
        let amenityContainerLength: number = amenityContainer.length;

        try {
            await targetPage.waitForSelector(selectorAmenityContainer, { timeout: 500 });

            // cycle through either apartment or building or both amenity types
            while (amenityContainerLength--) {
                let tempAmenityContainer: HTMLElement = amenityContainer[amenityContainerLength];

                let amenityText: string = await targetPage.evaluate((tempAmenityContainer) => {
                    return tempAmenityContainer.innerText;
                }, tempAmenityContainer);

                if (amenityText.toLowerCase().includes(amenityType.toLowerCase())) {

                    let selectorAmenity: string = '*[class*=\"' + this.selectorList['property_amenity'] + '\"]';
                    let amenityLength: number = await targetPage.evaluate((selectorAmenityContainer: string, amenityContainerLength: number, selectorAmenity: string) => {
                        return document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity).length;
                    }, selectorAmenityContainer, amenityContainerLength, selectorAmenity);

                    amenity = await targetPage.evaluate((selectorAmenityContainer: string, amenityContainerLength: number, selectorAmenity: string, amenityLength: number) => {
                        let tempAmenity: string[] = [];
                        while (amenityLength--) {
                            let tempAmenityValue: string = (document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity)[amenityLength] as HTMLElement).innerText;
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

    private async getPropertyAttribute(targetPage: any, propertyLength: number, attributeValue: string) {
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
            let tempData: string = await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText.replace(/[^0-9]/g, '');
            }, rentalPropertyRoomContainer, selector);

            if (tempData === "")
                return "—";
            else
                return tempData;

        } catch {
            return "—";
        }
    }

    private async getPropertySize(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_floor'] + '\"]';

        try {
            let tempData: string = await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText.replace(/[^0-9]/g, '');
            }, rentalPropertyRoomContainer, selector);

            if (tempData === "")
                return "—";
            else
                return tempData;
        } catch {
            return "—";
        }
    }

    private async getPropertyBathCount(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_bath'] + '\"]';

        try {
            let tempData: string = await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText.replace(/[^0-9]/g, '');
            }, rentalPropertyRoomContainer, selector);

            if (tempData === "")
                return "—";
            else
                return tempData;
        } catch {
            return "—";
        }
    }

    private async getPropertyCost(targetPage: any, rentalPropertyRoomContainer: HTMLElement) {
        let selector: string = '*[class*=\"' + this.selectorList['property_cost'] + '\"]';

        try {
            let tempData: string = await targetPage.evaluate((rentalPropertyRoomContainer, selector) => {
                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText.replace(/[^0-9]/g, '');
            }, rentalPropertyRoomContainer, selector);

            if (tempData === "")
                return "—";
            else
                return tempData;
        } catch {
            return "—";
        }
    }

    private async getSelector(selector) {
        return '*[class*=\"' + selector + '\"]';
    }

}

module.exports = Padmapper;