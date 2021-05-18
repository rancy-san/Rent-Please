/**
 * @filename        search-list-ui.ts
 * @description     Class allowing creation of list items onto the DOM
 */

///<reference path='search-ui.ts' />
///<reference path='search-list-ux.ts' />
class SearchListUI extends SearchUI {

    private searchListUX: SearchListUX;

    /**
     * @description     Store list UX to be used on list UI
     * @param           {SearchListUX} searchListUX 
     */
    constructor(searchListUX: SearchListUX) {
        super();
        this.searchListUX = searchListUX;

    }

    /**
     * @function        createResultContainer  
     * @description     Create UI elements for 1 list item, and append it to the DOM.
     *                  List item includes UX functionality such as geolocation,
     *                      add to list, and remove from list
     * @param           {string} districtName name from search result
     * @param           {number} districtLat latitude from search result
     * @param           {number} districtLon longitude from search result
     * @return          {void}
     */
    // GUI creation should be in its own class
    public createResultContainer(
        districtName: string,
        districtLat: number,
        districtLon: number
    ): void {
        // 1 result item
        let resultContainer: HTMLElement = this.createDIVButton("resultContainer");
        let resultNameContainer: HTMLElement = this.createDIVButton("resultNameContainer");

        // container to nest all buttons below
        let buttonContainer: HTMLElement = this.createDIVButton("buttonContainer");
        // add button
        let addDistrictButtonContainer: HTMLElement = this.createDIVButton("addDistrictButtonContainer");
        let addDistrictIcon: HTMLElement = this.createDIVButton("addDistrictIcon");
        // delete/remove button
        let removeDistrictButtonContainer: HTMLElement = this.createDIVButton("removeDistrictButtonContainer");
        let removeDistrictIcon:HTMLElement = this.createDIVButton("removeDistrictIcon");
        // geolocate button
        let geolocateButtonContainer: HTMLElement = this.createDIVButton("geolocateButtonContainer");
        let geoLocateIcon: HTMLElement = this.createDIVButton("geoLocateIcon");

        resultNameContainer.innerText = districtName;

        // store some data on the DOM
        resultContainer.setAttribute("data-districtName", districtName);
        resultContainer.setAttribute("data-districtLat", districtLat.toString());
        resultContainer.setAttribute("data-districtLon", districtLon.toString());

        // add an event that adds data to the other list
        this.searchListUX.addEventAppendToPrepareData(
            addDistrictButtonContainer,
            removeDistrictButtonContainer,
            resultContainer, 
            this.prepareWrapper, 
            this.resultWrapper,
            districtLat,
            districtLon
        );

        // add the ability to remove item from another list
        this.searchListUX.addEventRemoveFromPrepareData(removeDistrictButtonContainer, resultContainer);

        // add an event to update the map longitude and latitude
        this.searchListUX.addEventUpdateLonLat(
            geolocateButtonContainer, 
            districtLat, 
            districtLon
        );

        // nest icons in its respective container
        addDistrictButtonContainer.appendChild(addDistrictIcon);
        removeDistrictButtonContainer.appendChild(removeDistrictIcon);
        geolocateButtonContainer.appendChild(geoLocateIcon);

        // add buttons to button container
        buttonContainer.appendChild(geolocateButtonContainer);
        buttonContainer.appendChild(removeDistrictButtonContainer);
        buttonContainer.appendChild(addDistrictButtonContainer);

        // place buttons on in the result found
        resultContainer.appendChild(resultNameContainer);
        resultContainer.appendChild(buttonContainer);
        
        this.resultWrapper.appendChild(resultContainer);
    }

    /**
     * @function        createDIVButton
     * @description     Create the element with a className (1 item out of many)
     * @param           {string} elementName class name of the element
     * @return          {HTMLElement}
     */
    private createDIVButton(elementName: string): HTMLElement {
        let button: HTMLElement = document.createElement("DIV");
        button.className = elementName;

        return button;
    }

}