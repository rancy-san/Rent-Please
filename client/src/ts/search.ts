/**
    @interface      result
    @description    naming convention for JSON keys output by Geogratis
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

/**
    @filename       search.ts
    @description    Fetch open source geolocation data (Geogratis)
 */

class Searching {

    private geolocationURL: string;
    private searchListUI: SearchListUI;

    constructor(searchListUX: SearchListUX) {
        this.geolocationURL = "http://geogratis.gc.ca/services/geolocation/en/locate?q=";
        this.searchListUI = new SearchListUI(searchListUX);
    }

    /**
     * @function        searchDistrict
     * @description     Fetch and return geolocation from Geogratis 
     *                      using user input data on the DOM.
     * @param           {string} searchTerm user's input
     */
    public searchDistrict(searchTerm: string): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = (() => this.handleCallback(xhr));
        xhr.open("GET", (this.geolocationURL + searchTerm), true);
        xhr.send();
    }

    /**
     * @function        handleCallback
     * @description     Handle the results sent from the server
     *                  Create list items for the DOM with search results.
     * @param xhr 
     */
    public handleCallback(xhr: XMLHttpRequest): void {
        let searchData: result[];
        let searchDataLength: number;

        // successful callback from server
        if (xhr.readyState == 4 && xhr.status == 200) {
            // callback is in JSON format
            searchData = JSON.parse(xhr.responseText);
            searchDataLength = searchData.length;

            // ensure that there is data to work with
            if (searchDataLength > 0) {
                // loop through data
                for (let i: number = 0; i < searchDataLength; i++) {
                    // the fetched data obtained should be stored somewhere instead of being used right away
                    this.searchListUI.createResultContainer(
                        searchData[i].title,
                        searchData[i].geometry.coordinates[0],
                        searchData[i].geometry.coordinates[1],
                        false
                    );
                }
            }
        }
    }
}