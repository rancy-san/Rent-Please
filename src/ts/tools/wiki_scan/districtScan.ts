const Wikipedia = require('node-wikipedia');
const ProvinceList = require('../../../json/provinceList');

class DistrictScan {
    private district: object
    private provinceName: string[];
    private provinceNameKey: string;
    private provinceCodeKey: string;
    private subcategoryKey: string;
    private subcategoryPageKey: string;
    private subcategoryNameKey: string;
    private searchTerm: string;

    constructor() {
        this.district = {};
        this.searchTerm = "Neighbourhoods in ";
        this.provinceNameKey = "province_name";
        this.provinceCodeKey = "province_code";
        this.subcategoryKey = "subcategories";
        this.subcategoryNameKey = "name";
        this.subcategoryPageKey = "pages";
        this.provinceName = ProvinceList[this.provinceNameKey];
    }

    private async searchPages(districtName: string) {
        return Wikipedia.page.data(
            districtName,
            { content: true },
            function (response) {
                return response;
            });
    }

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

    public async search() {
        await this.searchByProvince();
    }

    private async searchByProvince() {
        // get province length to scan districts
        let provinceNameLength: number = this.provinceName.length;
        // cycle through each province
        while (provinceNameLength--) {
            // get the list of categories for the province
            let category: object = await this.searchCategories(this.searchTerm + this.provinceName[provinceNameLength]);
            // initialize each province with empty object
            this.district[this.provinceName[provinceNameLength]] = {};
            this.searchBySubcategory(category);
        }
    }

    private async searchBySubcategory(category) {
        //console.log(category);
        // array of objects from the wiki response
        let subcategory: object[] = category[this.subcategoryKey];
        // store name of the subcategory element
        let subcategoryName: string = category[this.subcategoryNameKey];
        // number of objects in the array
        let subcategoryLength: number;

        try {
            //console.log(subcategory);
            subcategoryLength = subcategory.length;
        } catch {
            subcategoryLength = 0;
        }

        // recursive loop if again another subcategory
        if (subcategoryLength > 0) {
            // scan through subCategories
            while (subcategoryLength--) {
                await this.searchBySubcategory(subcategory[subcategoryLength]);
            }
        } else {
            console.log(subcategoryName);
            let page: string[] = category[this.subcategoryPageKey];
            let pageLength: number;

            try {
                pageLength = page.length;
            } catch {
                pageLength = 0;
            }

            if (pageLength > 0) {
                while (pageLength--) {
                    //console.log(page[pageLength]);
                }
            }
        }
    }
}

module.exports = DistrictScan;