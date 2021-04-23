
/**
 * Filename:        districtScan.ts
 * Description:     This file scans for data from the Wikipedia site for
 *                  some districts that exist for provinces and cities.
 *                  Saving the data is also performed.
 * 
 */
// Wikipedia library
const Wikipedia = require('node-wikipedia');
// list of province names and codes
const ProvinceList = require('../../../json/provinceList');
const fs = require('fs');

class DistrictScan {
    // list of district information collected from Wikipedia
    private district: object
    // province name from the province list
    private provinceName: string[];
    // the JSON key for the province
    private provinceNameKey: string;
    // the JSON key for the province code
    private provinceCodeKey: string;
    // JSON key for selecting the subcategory in the Wikipedia response
    private subcategoryKey: string;
    // JSON key for selecting the page of a subcategory in the Wikipedia response
    private subcategoryPageKey: string;
    // JSON key for selecting the subcategory's name in the Wikipedia response
    private subcategoryNameKey: string;
    // primary filter for searching
    private searchTermPrimary: string;
    // secondary filter for parsing
    private searchTermSecondary: string[];

    /**
     * Description:     Storing initial data for the purpose of scanning for districts names
     */
    constructor() {
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
    private async searchCategories(districtName: string) {
        let category;
        let p = new Promise<void>((resolve, reject) => {
            return Wikipedia.categories.tree(
                districtName,
                function (response) {
                    category = response;
                    resolve();
                });
        });

        return p.then(() => {
            return category;
        });
    }

    /**
     * Function Name:   searchByProvince
     * Description:     Perform a search using province names in the search term
     */
    private async searchByProvince() {
        // get province length to scan districts
        let provinceNameLength: number = this.provinceName.length;
        // cycle through each province
        while (provinceNameLength--) {
            // get the list of categories for the province
            let category: object = await this.searchCategories(this.searchTermPrimary + this.provinceName[provinceNameLength]);
            // initialize each province with empty object
            this.district[this.provinceName[provinceNameLength]] = {};
            // any results will be a subcategory leading to more subcategories or pages of districts
            this.district[this.provinceName[provinceNameLength]] = await this.searchBySubcategory(category, provinceNameLength);
        }

        
        fs.writeFile('districtData.txt', JSON.stringify(this.district, null, 4), function(err){
            console.log("DONE.");
        });
        
    }

    /**
     * Function Name:   searchBySubcategory
     * Description:     Recursive function performs deeper search of subcateogries within 
     *                  subcatogeries until a page for a district is found.
     * @param           {object} category the Wikipedia JSON data for the category/subcategory 
     *                  {number} provinceNameLength the index of the province targeted
     *                  used to perform a deeper search 
     */
    private async searchBySubcategory(category: object, provinceNameLength: number) {
        // store current object data in tempCategory
        let tempCategoryData: object = {};
        // array of objects from the wiki response
        let subcategory: object[] = category[this.subcategoryKey];
        // store name of the subcategory element
        let subcategoryName: string = category[this.subcategoryNameKey];
        let searchTermSecondaryLength = this.searchTermSecondary.length;
        // number of objects in the array
        let subcategoryLength: number;

        try {
            // length may not exist if the subcategory is missing
            subcategoryLength = subcategory.length;
        } catch {
            // prevent future looping
            subcategoryLength = 0;
        }

        // recursive loop if again another subcategory
        if (subcategoryLength > 0) {
            tempCategoryData[subcategoryName] = [];
            // scan through subCategories
            while (subcategoryLength--) {
               
                // recursive loop to perform another category search within the JSON data structure, and append data to array for the key in the object
                tempCategoryData[subcategoryName].push(await this.searchBySubcategory(subcategory[subcategoryLength], provinceNameLength));
            }
            // reutnr subcategory on finish data collection
            return tempCategoryData;
        } else {
            tempCategoryData[subcategoryName] = null;
        }

        // search through existing pages that are not dependent of the existance of a recursive loop
        if (this.getPageLength(this.getPage(category)) > 0) {
            // determine number of filters
            let searchTermSecondaryLength = this.searchTermSecondary.length;
            // cycle through filters
            while (searchTermSecondaryLength--) {
                
                // accept pages only if the subcategory contains the correct text (ignore non-district data)
                if (subcategoryName.indexOf(this.searchTermSecondary[searchTermSecondaryLength]) >= 0) {
                    let tempSubcategoryName: string;
                    tempSubcategoryName = subcategoryName.replace(this.searchTermSecondary[searchTermSecondaryLength], "").replace(this.provinceName[provinceNameLength],"").replace(",","").trim();
                    // enter the page JSON key
                    tempCategoryData[subcategoryName] = await this.searchByPage(category, provinceNameLength, tempSubcategoryName);
                   break;
                }
            }
        }
        return tempCategoryData;
    }

    /**
     * Function Name:   searchByPage
     * Description:     Scan through the page/s avaiable by using the category that the pages belong in.
     *                  Pages with acceptable filter will be considered.
     * @param           {object} category the Wikipedia JSON data for the category/subcategory to access the page data
     *                  used to perform a deeper search 
     */
    private async searchByPage(category: object, provinceNameLength: number, tempSubcategoryName: string) {
        let tempPageData: string[] = [];
        // page data from the subcategory/category
        let page: string[] = this.getPage(category);
        // number of pages
        let pageLength: number = page.length;

        // cycle through all the pages of the subcategory
        while (pageLength--) {
            // store filter length
            let searchTermSecondaryLength = this.searchTermSecondary.length;
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
        return tempPageData;
    }
    /**
     * Function Name:   getPage
     * Description:     Get the page object of the subcategory it belongs to
     * @param           {object} category the JSON data for the category/subcategory to access the page data
     *                  used to perform a deeper search
     */
    private getPage(category: object): string[] {
        return category[this.subcategoryPageKey];
    }

    /**
     * Function Name:   getPageLength
     * Description:     Calculate and return the number of pages in the pages array
     * @param           {string[]} page contains an array of strings that describe the page name (district names)
     */
    private getPageLength(page: string[]): number {
        return page.length;
    }
}

module.exports = DistrictScan;