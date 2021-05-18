/**
 * @filename        search-input-ux.ts
 * @description     Handles the UX functionality of the search input.
 *                  Request a search of the user's input to the Search class
 */

///<reference path='search-ux.ts' />
///<reference path='search-list-ux.ts' />
///<reference path='search.ts' />
class SearchInputUX extends SearchUX {

    private searchListUX: SearchListUX;

    /**
     * @description     Set the UX object for this class to be passed on
     * @param           {SearchListUX} searchListUX 
     */
    constructor(searchListUX: SearchListUX) {
        super();
        this.searchListUX = searchListUX;
    }

    /**
     * @function        addEventSearchDistrict
     * @description     Add event triggering search function
     * @param           {HTMLElement} buttonElement button triggering this function execution
     * @param           {HTMLInputElement} inputElement input box containing user input
     * @param           {HTMLElement} listElementResults list of results/output
     * @return          {void}
     */
    public addEventSearchDistrict(
        buttonElement: HTMLElement,
        inputElement: HTMLInputElement,
        listElementResults: HTMLElement
    ) {
        buttonElement.addEventListener("click", () => this.searchDistrict(inputElement, listElementResults));
    }

    /**
     * @function        searchDistrict
     * @description     Call function to search geolocations using the user's input
     * @param           {HTMLInputElement} inputElement input box on the DOM
     * @param           {HTMLElement} listElementResult search result list
     * @return          {void}
     */
    public searchDistrict(inputElement: HTMLInputElement, listElementResult: HTMLElement) {
        // create Searching object and request data from user's input
        let search: Searching = new Searching(this.searchListUX);
        search.searchDistrict(inputElement.value);

        // clear previous results if any
        this.clearList(listElementResult);
    }

}