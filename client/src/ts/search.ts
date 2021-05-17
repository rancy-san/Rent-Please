/*
    Structure name: result
    Description:    naming convention for JSON keys output by Geogratis
                    4 keys because these will be the most important data
*/

///<reference path='search-list-ux.ts' />
///<reference path='search-list-ui.ts' />

interface result {
    title: string;
    bbox: number[];
    geometry: any;
    coordinates: number[];
}

/*
    Structure Name:     Searching
    Description:        Fetch open source geolocation data (Geogratis)

 */

class Searching {

    private geolocationURL: string;
    private searchListUI: SearchListUI;

    constructor(searchListUX: SearchListUX) {
        this.geolocationURL = "http://geogratis.gc.ca/services/geolocation/en/locate?q=";
        this.searchListUI = new SearchListUI(searchListUX);
    }

    /**
     * Structure Name:  searchDistrict
     * Description:     fetch and return geolocation from Geogratis using user input data
     */
    public searchDistrict(searchTerm: string): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = (() => this.handleCallback(xhr));
        xhr.open("GET", (this.geolocationURL + searchTerm), true);
        xhr.send();
    }

    public handleCallback(xhr: XMLHttpRequest): void {
        let searchData: result[];
        let searchDataLength: number;

        if (xhr.readyState == 4 && xhr.status == 200) {
            searchData = JSON.parse(xhr.responseText);
            searchDataLength = searchData.length;

            if (searchDataLength > 0) {
                for (let i: number = 0; i < searchDataLength; i++) {
                    // the fetched data obtained should be stored somewhere instead of being used right away
                    this.searchListUI.createResultContainer(
                        searchData[i].title,
                        searchData[i].geometry.coordinates[0],
                        searchData[i].geometry.coordinates[1]
                    );
                }
            }
        }
    }
}