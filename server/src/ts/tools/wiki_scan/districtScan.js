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
/**
 * Filename:        districtScan.ts
 * Description:     This file scans for data from the Wikipedia site for
 *                  some districts that exist for provinces and cities.
 *                  Saving the data is also performed.
 *
 */
// Wikipedia library
var Wikipedia = require('node-wikipedia');
// list of province names and codes
var ProvinceList = require('../../../json/provinceList');
var fs = require('fs');
var DistrictScan = /** @class */ (function () {
    /**
     * Description:     Storing initial data for the purpose of scanning for districts names
     */
    function DistrictScan() {
        this.district = {};
        this.searchTermPrimary = "Neighbourhoods in ";
        this.searchTermSecondary = [
            this.searchTermPrimary,
            "Communities in ",
            "Communities in the ",
            "List of neighbourhoods in"
        ];
        this.provinceNameKey = "province_name";
        this.provinceCodeKey = "province_code";
        this.subcategoryKey = "subcategories";
        this.subcategoryNameKey = "name";
        this.subcategoryPageKey = "pages";
        this.provinceName = ProvinceList[this.provinceNameKey];
    }
    /**
     * Function Name:   searchCategories
     * Description:     Perform a Wikipedia search for the district
     * @param           {string} districtName the name of a district, town or province
     */
    DistrictScan.prototype.searchCategories = function (districtName) {
        return __awaiter(this, void 0, void 0, function () {
            var category, p;
            return __generator(this, function (_a) {
                p = new Promise(function (resolve, reject) {
                    return Wikipedia.categories.tree(districtName, function (response) {
                        category = response;
                        resolve();
                    });
                });
                return [2 /*return*/, p.then(function () {
                        return category;
                    })];
            });
        });
    };
    /**
     * Function Name:   searchByProvince
     * Description:     Perform a search using province names in the search term
     */
    DistrictScan.prototype.searchByProvince = function () {
        return __awaiter(this, void 0, void 0, function () {
            var provinceNameLength, category, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        provinceNameLength = this.provinceName.length;
                        _c.label = 1;
                    case 1:
                        if (!provinceNameLength--) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.searchCategories(this.searchTermPrimary + this.provinceName[provinceNameLength])];
                    case 2:
                        category = _c.sent();
                        // initialize each province with empty object
                        this.district[this.provinceName[provinceNameLength]] = {};
                        // any results will be a subcategory leading to more subcategories or pages of districts
                        _a = this.district;
                        _b = this.provinceName[provinceNameLength];
                        return [4 /*yield*/, this.searchBySubcategory(category, provinceNameLength)];
                    case 3:
                        // any results will be a subcategory leading to more subcategories or pages of districts
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 1];
                    case 4:
                        fs.writeFile('districtData.txt', JSON.stringify(this.district, null, 4), function (err) {
                            console.log("DONE.");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Function Name:   searchBySubcategory
     * Description:     Recursive function performs deeper search of subcateogries within
     *                  subcatogeries until a page for a district is found.
     * @param           {object} category the Wikipedia JSON data for the category/subcategory
     *                  {number} provinceNameLength the index of the province targeted
     *                  used to perform a deeper search
     */
    DistrictScan.prototype.searchBySubcategory = function (category, provinceNameLength) {
        return __awaiter(this, void 0, void 0, function () {
            var tempCategoryData, subcategory, subcategoryName, searchTermSecondaryLength, subcategoryLength, _a, _b, searchTermSecondaryLength_1, tempSubcategoryName, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        tempCategoryData = {};
                        subcategory = category[this.subcategoryKey];
                        subcategoryName = category[this.subcategoryNameKey];
                        searchTermSecondaryLength = this.searchTermSecondary.length;
                        try {
                            // length may not exist if the subcategory is missing
                            subcategoryLength = subcategory.length;
                        }
                        catch (_f) {
                            // prevent future looping
                            subcategoryLength = 0;
                        }
                        if (!(subcategoryLength > 0)) return [3 /*break*/, 4];
                        tempCategoryData[subcategoryName] = [];
                        _e.label = 1;
                    case 1:
                        if (!subcategoryLength--) return [3 /*break*/, 3];
                        // recursive loop to perform another category search within the JSON data structure, and append data to array for the key in the object
                        _b = (_a = tempCategoryData[subcategoryName]).push;
                        return [4 /*yield*/, this.searchBySubcategory(subcategory[subcategoryLength], provinceNameLength)];
                    case 2:
                        // recursive loop to perform another category search within the JSON data structure, and append data to array for the key in the object
                        _b.apply(_a, [_e.sent()]);
                        return [3 /*break*/, 1];
                    case 3: 
                    // reutnr subcategory on finish data collection
                    return [2 /*return*/, tempCategoryData];
                    case 4:
                        tempCategoryData[subcategoryName] = null;
                        _e.label = 5;
                    case 5:
                        if (!(this.getPageLength(this.getPage(category)) > 0)) return [3 /*break*/, 9];
                        searchTermSecondaryLength_1 = this.searchTermSecondary.length;
                        _e.label = 6;
                    case 6:
                        if (!searchTermSecondaryLength_1--) return [3 /*break*/, 9];
                        if (!(subcategoryName.indexOf(this.searchTermSecondary[searchTermSecondaryLength_1]) >= 0)) return [3 /*break*/, 8];
                        tempSubcategoryName = void 0;
                        tempSubcategoryName = subcategoryName.replace(this.searchTermSecondary[searchTermSecondaryLength_1], "").replace(this.provinceName[provinceNameLength], "").replace(",", "").trim();
                        // enter the page JSON key
                        _c = tempCategoryData;
                        _d = subcategoryName;
                        return [4 /*yield*/, this.searchByPage(category, provinceNameLength, tempSubcategoryName)];
                    case 7:
                        // enter the page JSON key
                        _c[_d] = _e.sent();
                        return [3 /*break*/, 9];
                    case 8: return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, tempCategoryData];
                }
            });
        });
    };
    /**
     * Function Name:   searchByPage
     * Description:     Scan through the page/s avaiable by using the category that the pages belong in.
     *                  Pages with acceptable filter will be considered.
     * @param           {object} category the Wikipedia JSON data for the category/subcategory to access the page data
     *                  used to perform a deeper search
     */
    DistrictScan.prototype.searchByPage = function (category, provinceNameLength, tempSubcategoryName) {
        return __awaiter(this, void 0, void 0, function () {
            var tempPageData, page, pageLength, searchTermSecondaryLength;
            return __generator(this, function (_a) {
                tempPageData = [];
                page = this.getPage(category);
                pageLength = page.length;
                // cycle through all the pages of the subcategory
                while (pageLength--) {
                    searchTermSecondaryLength = this.searchTermSecondary.length;
                    // cycle through filters 
                    while (searchTermSecondaryLength--) {
                        // if the filter is match, exit and dont action on page value
                        if (page[pageLength].toLowerCase().indexOf(this.searchTermSecondary[searchTermSecondaryLength].toLowerCase()) >= 0) {
                            break;
                        }
                        // if no matches were found, action on page value
                        else if (searchTermSecondaryLength === 0) {
                            tempPageData.push(page[pageLength]);
                            //this.district[this.provinceName[provinceNameLength]][tempSubcategoryName].push(page[pageLength]);
                        }
                    }
                }
                return [2 /*return*/, tempPageData];
            });
        });
    };
    /**
     * Function Name:   getPage
     * Description:     Get the page object of the subcategory it belongs to
     * @param           {object} category the JSON data for the category/subcategory to access the page data
     *                  used to perform a deeper search
     */
    DistrictScan.prototype.getPage = function (category) {
        return category[this.subcategoryPageKey];
    };
    /**
     * Function Name:   getPageLength
     * Description:     Calculate and return the number of pages in the pages array
     * @param           {string[]} page contains an array of strings that describe the page name (district names)
     */
    DistrictScan.prototype.getPageLength = function (page) {
        return page.length;
    };
    return DistrictScan;
}());
module.exports = DistrictScan;
//# sourceMappingURL=districtScan.js.map