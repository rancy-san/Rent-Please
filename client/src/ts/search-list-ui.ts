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
        let lonlat:number[];
        super();
        this.searchListUX = searchListUX;
        // @ts-ignore
        lonlat = ol.proj.toLonLat(this.searchListUX.getView().getCenter());
        // default container
        this.createResultContainer("Custom District", 0, 0, true);
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
        districtLon: number,
        isDefaultItem: boolean
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
        let removeDistrictIcon: HTMLElement = this.createDIVButton("removeDistrictIcon");
        // geolocate button
        let geolocateButtonContainer: HTMLElement = this.createDIVButton("geolocateButtonContainer");
        let geoLocateIcon: HTMLElement = this.createDIVButton("geoLocateIcon");
        let lonlatContainer: HTMLElement = this.createDIVButton("lanlatContainer");
        let lonContainer: HTMLElement = this.createDIVButton("lonContainer");
        let latContainer: HTMLElement = this.createDIVButton("latContainer");
        let lonHeader: HTMLElement = this.createDIVButton("lonHeader");
        let latHeader: HTMLElement = this.createDIVButton("latHeader");
        let lon:HTMLElement = this.createDIVButton("lon");
        let lat:HTMLElement = this.createDIVButton("lat");

        resultNameContainer.innerText = districtName;
        resultNameContainer.contentEditable = "true";


        
        if (!isDefaultItem) {
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
                districtLon,
                districtLat
            );
            // add an event to update the map longitude and latitude
            this.searchListUX.addEventUpdateLonLat(
                geolocateButtonContainer,
                districtLon,
                districtLat,
            );
        } else {
            // update lon lat for default element
            this.searchListUX.addEventUpdateDefaultElementLonLat(geolocateButtonContainer,resultContainer);
            // update appending data for default element
            this.searchListUX.addEventAppendDefaultElementToPrepareData(
                addDistrictButtonContainer,
                removeDistrictButtonContainer,
                resultContainer,
                this.prepareWrapper,
                this.resultWrapper);
        }

        // add the ability to remove item from another list
        this.searchListUX.addEventRemoveFromPrepareData(removeDistrictButtonContainer, resultContainer);

        /*
        async () => {
            new Promise<void>(resolve => {
                resolve();
            }).then(()=> {
                
            });
        }
        */

       // set longitude and latitude values
        latHeader.innerText = "Latitude: ";
        lonHeader.innerText = "Longitude: ";
        lat.innerText = districtLat.toString();
        lon.innerText = districtLon.toString();

        // nest values for latitude
        latContainer.appendChild(latHeader);
        latContainer.appendChild(lat);

        // nest values for longitude
        lonContainer.appendChild(lonHeader);
        lonContainer.appendChild(lon);

        lonlatContainer.appendChild(latContainer);
        lonlatContainer.appendChild(lonContainer);

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
        resultContainer.appendChild(lonlatContainer);

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