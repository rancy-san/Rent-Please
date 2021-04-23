var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AbstractTarget = require('./target');
var Sys = require("../../tools/system/system");
var Padmapper = /** @class */ (function (_super) {
    __extends(Padmapper, _super);
    function Padmapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Function Name:   search
     * Description:     Scan rental web application for properties in the area/district
     */
    Padmapper.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            var districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        districtRegion = this.districtList['region'];
                        districtProvince = this.districtList['province'];
                        buildingData = this.rentalType['building'];
                        parameterPropertyCategories = this.rentalType['parameter'].property_categories;
                        parameterExcludeAirBnB = this.rentalType['parameter'].exclude_airbnb;
                        return [4 /*yield*/, this.firstPass(districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Function Name:   firstPass
     * Description:     Scans and collects information for all rental properties for all districts
     * @param {string[]} districtRegion array of districts or regions
     * @param {string} districtProvince province code for the district
     * @param {string[]} buildingData types of buildings stored in an array
     * @param {string} parameterPropertyCategories types of properties
     * @param {string} parameterExcludeAirBnB no airBnB
     */
    Padmapper.prototype.firstPass = function (districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB) {
        return __awaiter(this, void 0, void 0, function () {
            var targetPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.pages()];
                    case 1:
                        targetPage = (_a.sent())[0];
                        return [4 /*yield*/, this.basicPass(targetPage, districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB, 1)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.secondPass = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Padmapper.prototype.basicPass = function (targetPage, districtRegion, districtProvince, buildingData, parameterPropertyCategories, parameterExcludeAirBnB, passType) {
        return __awaiter(this, void 0, void 0, function () {
            var tempDistrictProvinceLength, tempDistrictRegionLength, paramDistrict, tempTargetURL, tempPropertyURL, tempPropertyURLLength, tempBuildingDataLength, selector, elementMapBtn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDistrictProvinceLength = districtProvince.length;
                        _a.label = 1;
                    case 1:
                        if (!tempDistrictProvinceLength--) return [3 /*break*/, 13];
                        tempDistrictRegionLength = districtRegion.length;
                        _a.label = 2;
                    case 2:
                        if (!tempDistrictRegionLength--) return [3 /*break*/, 12];
                        paramDistrict = '/' + districtRegion[tempDistrictRegionLength].trim().replace(' ', '-') + '-' + districtProvince[tempDistrictProvinceLength];
                        paramDistrict = paramDistrict.toLowerCase();
                        tempBuildingDataLength = buildingData.length;
                        console.log("Working on region... " + districtRegion[tempDistrictRegionLength]);
                        _a.label = 3;
                    case 3:
                        if (!tempBuildingDataLength--) return [3 /*break*/, 11];
                        // go to target site
                        tempTargetURL = this.targetURL + paramDistrict + parameterPropertyCategories + buildingData[tempBuildingDataLength] + parameterExcludeAirBnB;
                        return [4 /*yield*/, targetPage.goto(tempTargetURL, { waituntil: 'networkidle2' })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.checkEndOfPropertyList(targetPage)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.checkMapType(targetPage)];
                    case 6:
                        if (!!(_a.sent())) return [3 /*break*/, 9];
                        if (!(passType === 2)) return [3 /*break*/, 9];
                        selector = '*[class*=\"' + this.selectorList['map_button'] + '\"]';
                        return [4 /*yield*/, targetPage.$$(selector)];
                    case 7:
                        elementMapBtn = _a.sent();
                        // go back
                        return [4 /*yield*/, elementMapBtn[0].click()];
                    case 8:
                        // go back
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        console.log("Building type: " + buildingData[tempBuildingDataLength]);
                        return [4 /*yield*/, this.getRentalPropertyData(targetPage, districtRegion, tempDistrictRegionLength)];
                    case 10:
                        _a.sent();
                        console.log("\r\n");
                        return [3 /*break*/, 3];
                    case 11:
                        console.log(this.rentalData[districtRegion[tempDistrictRegionLength]]);
                        return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 1];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getRentalPropertyData = function (targetPage, districtRegion, tempDistrictRegionLength) {
        return __awaiter(this, void 0, void 0, function () {
            var selectorProperty, property, propertyLength, propertyTotalCount, elementBackBtn, selectorBackBtn, system, propertyURL, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        selectorProperty = '*[class*=\"' + this.selectorList['property'] + '\"]';
                        return [4 /*yield*/, targetPage.$$(selectorProperty)];
                    case 1:
                        property = _d.sent();
                        propertyLength = property.length;
                        propertyTotalCount = propertyLength;
                        selectorBackBtn = '*[class*=\"' + this.selectorList['property_backBtn'] + '\"]';
                        system = new Sys();
                        _d.label = 2;
                    case 2:
                        if (!propertyLength--) return [3 /*break*/, 11];
                        propertyURL = void 0;
                        // wait for page to be loaded
                        return [4 /*yield*/, targetPage.waitForSelector(selectorProperty)];
                    case 3:
                        // wait for page to be loaded
                        _d.sent();
                        // open rental data
                        return [4 /*yield*/, property[propertyLength].click()];
                    case 4:
                        // open rental data
                        _d.sent();
                        return [4 /*yield*/, this.getPropertyURL(targetPage)];
                    case 5:
                        // URL for rental property as JSON key
                        propertyURL = _d.sent();
                        this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL] = { "property": [] };
                        // loop through the outer element for each room type
                        return [4 /*yield*/, this.cycleThroughPropertyWrapper(targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength)];
                    case 6:
                        // loop through the outer element for each room type
                        _d.sent();
                        _b = (_a = process.stdout).write;
                        _c = "Collecting rental data... ";
                        return [4 /*yield*/, system.percentLoaded(propertyTotalCount, propertyLength, 0)];
                    case 7:
                        _b.apply(_a, [_c + (_d.sent()) + "%\r\033[0G"]);
                        return [4 /*yield*/, targetPage.waitForSelector(selectorBackBtn)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, targetPage.$$(selectorBackBtn)];
                    case 9:
                        // load element
                        elementBackBtn = _d.sent();
                        // go back
                        return [4 /*yield*/, elementBackBtn[0].click()];
                    case 10:
                        // go back
                        _d.sent();
                        return [3 /*break*/, 2];
                    case 11:
                        console.log(this.rentalData);
                        return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.cycleThroughPropertyWrapper = function (targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            var rentalPropertyWrapper, rentalPropertyWrapperLength, selectorRoomWrapper, selectorError, _a, _b, _c, rentalPropertyRoomContainerCheck, selectorPropertyRoomContainerCheck;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        selectorRoomWrapper = '*[class*=\"' + this.selectorList['property_room_wrapper'] + '\"]';
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 5]);
                        // wait for list of rooms to appear
                        return [4 /*yield*/, targetPage.waitForSelector(selectorRoomWrapper, { timeout: 500 })];
                    case 2:
                        // wait for list of rooms to appear
                        _d.sent();
                        selectorError = false;
                        return [3 /*break*/, 5];
                    case 3:
                        _a = _d.sent();
                        // take different route if no room type to select
                        _c = (_b = this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property']).push;
                        return [4 /*yield*/, this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, null)];
                    case 4:
                        // take different route if no room type to select
                        _c.apply(_b, [_d.sent()]);
                        selectorError = true;
                        return [3 /*break*/, 5];
                    case 5:
                        if (!!selectorError) return [3 /*break*/, 14];
                        return [4 /*yield*/, targetPage.$$(selectorRoomWrapper)];
                    case 6:
                        // get list of rooms
                        rentalPropertyWrapper = _d.sent();
                        // get number of elements for list of rooms
                        rentalPropertyWrapperLength = rentalPropertyWrapper.length;
                        _d.label = 7;
                    case 7:
                        if (!rentalPropertyWrapperLength--) return [3 /*break*/, 14];
                        rentalPropertyRoomContainerCheck = void 0;
                        selectorPropertyRoomContainerCheck = '*[class*=\"' + this.selectorList['property_room_type_check'] + '\"]';
                        ;
                        // wait for list of rooms to appear
                        return [4 /*yield*/, targetPage.waitForSelector(selectorPropertyRoomContainerCheck)];
                    case 8:
                        // wait for list of rooms to appear
                        _d.sent();
                        return [4 /*yield*/, targetPage.evaluate(function (selectorPropertyRoomContainerCheck, rentalPropertyWrapperLength) {
                                return document.querySelectorAll(selectorPropertyRoomContainerCheck)[rentalPropertyWrapperLength].innerText;
                            }, selectorPropertyRoomContainerCheck, rentalPropertyWrapperLength)];
                    case 9:
                        rentalPropertyRoomContainerCheck = _d.sent();
                        if (!(rentalPropertyRoomContainerCheck.toLowerCase() != "unavailable")) return [3 /*break*/, 13];
                        // open property room type
                        return [4 /*yield*/, rentalPropertyWrapper[rentalPropertyWrapperLength].click()];
                    case 10:
                        // open property room type
                        _d.sent();
                        // loop through the room types
                        return [4 /*yield*/, this.cycleThroughPropertyContainer(targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength, rentalPropertyWrapperLength)];
                    case 11:
                        // loop through the room types
                        _d.sent();
                        // close room type container
                        return [4 /*yield*/, rentalPropertyWrapper[rentalPropertyWrapperLength].click()];
                    case 12:
                        // close room type container
                        _d.sent();
                        _d.label = 13;
                    case 13: return [3 /*break*/, 7];
                    case 14:
                        console.log(this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property']);
                        return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.cycleThroughPropertyContainer = function (targetPage, districtRegion, tempDistrictRegionLength, propertyURL, propertyLength, rentalPropertyWrapperLength) {
        return __awaiter(this, void 0, void 0, function () {
            var rentalPropertyRoomContainer, rentalPropertyRoomContainerLength, selectorRoomContainer, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        selectorRoomContainer = '*[class*=\"' + this.selectorList['property_room_container'] + '\"]';
                        // wait for list of rooms to appear
                        return [4 /*yield*/, targetPage.waitForSelector(selectorRoomContainer)];
                    case 1:
                        // wait for list of rooms to appear
                        _c.sent();
                        return [4 /*yield*/, targetPage.$$(selectorRoomContainer)];
                    case 2:
                        rentalPropertyRoomContainer = _c.sent();
                        rentalPropertyRoomContainerLength = rentalPropertyRoomContainer.length;
                        _c.label = 3;
                    case 3:
                        if (!rentalPropertyRoomContainerLength--) return [3 /*break*/, 6];
                        return [4 /*yield*/, targetPage.evaluate(function (selectorRoomContainer, rentalPropertyRoomContainerLength) {
                                return document.querySelectorAll(selectorRoomContainer)[rentalPropertyRoomContainerLength].children[1].children[0].children[0].children[0].children[0].innerText;
                            }, selectorRoomContainer, rentalPropertyRoomContainerLength)];
                    case 4:
                        _c.sent();
                        // store basic info and all amenities of each available suite
                        _b = (_a = this.rentalData[districtRegion[tempDistrictRegionLength]][propertyURL]['property']).push;
                        return [4 /*yield*/, this.getRentalPropertyDataObject(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer[rentalPropertyRoomContainerLength])];
                    case 5:
                        // store basic info and all amenities of each available suite
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getRentalPropertyDataObject = function (targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var rentalProperty, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        rentalProperty = {};
                        _a = rentalProperty;
                        _b = 'basic_information';
                        return [4 /*yield*/, this.getPropertyDataBasicInformation(targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer)];
                    case 1:
                        _a[_b] = _g.sent();
                        _c = rentalProperty;
                        _d = 'apartment_amenities';
                        return [4 /*yield*/, this.getPropertyDataApartmentAmenities(targetPage, propertyLength)];
                    case 2:
                        _c[_d] = _g.sent();
                        _e = rentalProperty;
                        _f = 'building_amenities';
                        return [4 /*yield*/, this.getPropertyDataBuildingAmenities(targetPage, propertyLength)];
                    case 3:
                        _e[_f] = _g.sent();
                        return [2 /*return*/, rentalProperty];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyDataBasicInformation = function (targetPage, propertyLength, rentalPropertyWrapperLength, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var basicInformation, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        basicInformation = {};
                        // property name
                        _a = basicInformation;
                        _b = 'building_name';
                        return [4 /*yield*/, this.getPropertyName(targetPage, propertyLength)];
                    case 1:
                        // property name
                        _a[_b] = _s.sent();
                        // property address
                        _c = basicInformation;
                        _d = 'building_address';
                        return [4 /*yield*/, this.getPropertyAddress(targetPage, propertyLength)];
                    case 2:
                        // property address
                        _c[_d] = _s.sent();
                        // building postal code
                        _e = basicInformation;
                        _f = 'building_postal_code';
                        return [4 /*yield*/, this.getPropertyPostalCode(targetPage, propertyLength)];
                    case 3:
                        // building postal code
                        _e[_f] = _s.sent();
                        if (!rentalPropertyRoomContainer) return [3 /*break*/, 9];
                        // store building type
                        _g = basicInformation;
                        _h = 'building_type';
                        return [4 /*yield*/, this.getPropertyBuildingType(targetPage)];
                    case 4:
                        // store building type
                        _g[_h] = _s.sent();
                        // number of rooms
                        _j = basicInformation;
                        _k = 'room';
                        return [4 /*yield*/, this.getPropertyRoomType(targetPage, rentalPropertyRoomContainer)];
                    case 5:
                        // number of rooms
                        _j[_k] = _s.sent();
                        // rent price
                        _l = basicInformation;
                        _m = 'cost';
                        return [4 /*yield*/, this.getPropertyCost(targetPage, rentalPropertyRoomContainer)];
                    case 6:
                        // rent price
                        _l[_m] = _s.sent();
                        // size of suite
                        _o = basicInformation;
                        _p = 'sqft';
                        return [4 /*yield*/, this.getPropertySize(targetPage, rentalPropertyRoomContainer)];
                    case 7:
                        // size of suite
                        _o[_p] = _s.sent();
                        // number of bathroom
                        _q = basicInformation;
                        _r = 'bathroom';
                        return [4 /*yield*/, this.getPropertyBathCount(targetPage, rentalPropertyRoomContainer)];
                    case 8:
                        // number of bathroom
                        _q[_r] = _s.sent();
                        _s.label = 9;
                    case 9: return [2 /*return*/, basicInformation];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyDataAmenities = function (targetPage, amenityType) {
        return __awaiter(this, void 0, void 0, function () {
            var amenity, selectorAmenityContainer, amenityContainer, amenityContainerLength, tempAmenityContainer, amenityText, selectorAmenity, amenityLength, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        amenity = [];
                        selectorAmenityContainer = '*[class*=\"' + this.selectorList['property_amenity_container'] + '\"]';
                        return [4 /*yield*/, targetPage.$$(selectorAmenityContainer)];
                    case 1:
                        amenityContainer = _b.sent();
                        amenityContainerLength = amenityContainer.length;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, targetPage.waitForSelector(selectorAmenityContainer, { timeout: 500 })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!amenityContainerLength--) return [3 /*break*/, 9];
                        tempAmenityContainer = amenityContainer[amenityContainerLength];
                        return [4 /*yield*/, targetPage.evaluate(function (tempAmenityContainer) {
                                return tempAmenityContainer.innerText;
                            }, tempAmenityContainer)];
                    case 5:
                        amenityText = _b.sent();
                        if (!amenityText.toLowerCase().includes(amenityType.toLowerCase())) return [3 /*break*/, 8];
                        selectorAmenity = '*[class*=\"' + this.selectorList['property_amenity'] + '\"]';
                        return [4 /*yield*/, targetPage.evaluate(function (selectorAmenityContainer, amenityContainerLength, selectorAmenity) {
                                return document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity).length;
                            }, selectorAmenityContainer, amenityContainerLength, selectorAmenity)];
                    case 6:
                        amenityLength = _b.sent();
                        return [4 /*yield*/, targetPage.evaluate(function (selectorAmenityContainer, amenityContainerLength, selectorAmenity, amenityLength) {
                                var tempAmenity = [];
                                while (amenityLength--) {
                                    var tempAmenityValue = document.querySelectorAll(selectorAmenityContainer)[amenityContainerLength].querySelectorAll(selectorAmenity)[amenityLength].innerText;
                                    tempAmenity.push(tempAmenityValue);
                                }
                                return tempAmenity;
                            }, selectorAmenityContainer, amenityContainerLength, selectorAmenity, amenityLength)];
                    case 7:
                        amenity = _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, amenity];
                    case 10:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyDataApartmentAmenities = function (targetPage, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPropertyDataAmenities(targetPage, 'apartment amenities')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyDataBuildingAmenities = function (targetPage, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPropertyDataAmenities(targetPage, 'building amenities')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Padmapper.prototype.checkMapType = function (targetPage) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, mapExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['map'] + '\"]';
                        return [4 /*yield*/, targetPage.evaluate(function (selector) {
                                try {
                                    if (document.querySelectorAll(selector).length)
                                        return true;
                                    else
                                        return false;
                                }
                                catch (_a) {
                                    return false;
                                }
                            }, selector)];
                    case 1:
                        mapExists = _a.sent();
                        return [2 /*return*/, mapExists];
                }
            });
        });
    };
    /**
     * Description      Requests for more rental properties until end of list reached
     * @param           {any} targetPage holds browser property for single tab/page
     * @returns         {boolean} endOfList value determined when end of page marker found
     */
    Padmapper.prototype.checkEndOfPropertyList = function (targetPage) {
        return __awaiter(this, void 0, void 0, function () {
            var endOfList, selector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_end'] + '\"]';
                        _a.label = 1;
                    case 1: 
                    // page down to reveal more properties from lazy loading
                    return [4 /*yield*/, targetPage.keyboard.press('End')];
                    case 2:
                        // page down to reveal more properties from lazy loading
                        _a.sent();
                        return [4 /*yield*/, targetPage.evaluate(function (selector) {
                                try {
                                    // 0 = false until true/found = 1
                                    if (document.querySelectorAll(selector).length)
                                        return true;
                                    else
                                        return false;
                                }
                                catch (_a) {
                                    return false;
                                }
                            }, selector)];
                    case 3:
                        // find end of page marker
                        endOfList = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (endOfList === false) return [3 /*break*/, 1];
                        _a.label = 5;
                    case 5: return [2 /*return*/, endOfList];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyURL = function (targetPage) {
        return __awaiter(this, void 0, void 0, function () {
            var selector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_URL'] + '\"]';
                        return [4 /*yield*/, targetPage.waitForSelector(selector)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, targetPage.evaluate(function (selector) {
                                try {
                                    var tempURL = document.querySelectorAll(selector)[0].children[0].href;
                                    return tempURL.substring(0, tempURL.indexOf("#back="));
                                }
                                catch (_a) {
                                    return "—";
                                }
                            }, selector)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyAttribute = function (targetPage, propertyLength, attributeValue) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, attribute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_container'] + '\"]';
                        attribute = '[itemprop=' + attributeValue + ']';
                        return [4 /*yield*/, targetPage.evaluate(function (selector, propertyLength, attribute) {
                                return document.querySelectorAll(selector)[propertyLength].querySelectorAll(attribute)[0].getAttribute("content");
                            }, selector, propertyLength, attribute)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyName = function (targetPage, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            var attributeValue, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attributeValue = this.attributeList['property_name'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getPropertyAttribute(targetPage, propertyLength, attributeValue)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyAddress = function (targetPage, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            var attributeValue, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attributeValue = this.attributeList['property_address'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getPropertyAttribute(targetPage, propertyLength, attributeValue)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyPostalCode = function (targetPage, propertyLength) {
        return __awaiter(this, void 0, void 0, function () {
            var attributeValue, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attributeValue = this.attributeList['property_postal_code'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getPropertyAttribute(targetPage, propertyLength, attributeValue)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyBuildingType = function (targetPage) {
        return __awaiter(this, void 0, void 0, function () {
            var buildingType;
            return __generator(this, function (_a) {
                buildingType = targetPage.url();
                // remove junk strings, get building type
                buildingType = buildingType.substring(buildingType.indexOf("property-categories="), buildingType.length);
                buildingType = buildingType.substring(0, buildingType.indexOf("&exclude-airbnb"));
                buildingType = buildingType.replace("property-categories=", "");
                return [2 /*return*/, buildingType];
            });
        });
    };
    Padmapper.prototype.getPropertyRoomType = function (targetPage, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_room_type'] + '\"]';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, targetPage.evaluate(function (rentalPropertyRoomContainer, selector) {
                                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
                            }, rentalPropertyRoomContainer, selector)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertySize = function (targetPage, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_sqft'] + '\"]';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, targetPage.evaluate(function (rentalPropertyRoomContainer, selector) {
                                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
                            }, rentalPropertyRoomContainer, selector)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyBathCount = function (targetPage, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_bath'] + '\"]';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, targetPage.evaluate(function (rentalPropertyRoomContainer, selector) {
                                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
                            }, rentalPropertyRoomContainer, selector)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getPropertyCost = function (targetPage, rentalPropertyRoomContainer) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        selector = '*[class*=\"' + this.selectorList['property_cost'] + '\"]';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, targetPage.evaluate(function (rentalPropertyRoomContainer, selector) {
                                return rentalPropertyRoomContainer.querySelectorAll(selector)[0].innerText;
                            }, rentalPropertyRoomContainer, selector)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, "—"];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Padmapper.prototype.getSelector = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, '*[class*=\"' + selector + '\"]'];
            });
        });
    };
    return Padmapper;
}(AbstractTarget));
module.exports = Padmapper;
//# sourceMappingURL=padmapper.js.map