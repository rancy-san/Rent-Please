/**
 * @filename        search-list-ux.ts
 * @description     Contains functions that adds events to passed in elements.
 *                  Click events either add the element to another list,
 *                      remove an element from a list, display the geolocation
 *                      of an element, display/hide another list
 */

///<reference path='search-ux.ts' />
class SearchListUX extends SearchUX {

    /**
     * @description     Call constructor from extended class
     */
    constructor() {
        super();
    }

    /**
     * @function        addEventAppendToPrepareData
     * @description     Click event triggers adding elements to a list
     * @param           {HTMLElement} buttonAddElement add button from DOM
     * @param           {HTMLElement} buttonRemoveElement remove/delete button from DOM
     * @param           {HTMLElement} elementResult 1 item of the search result
     * @param           {HTMLElement} listElementData list of added/saved search results
     * @param           {HTMLElement} listElementResult list of search results
     * @param           {number} longitude longtitude of the search result
     * @param           {number} latitude latitude of the search result
     * @return          {void}
     */
    public addEventAppendToPrepareData(
        buttonAddElement: HTMLElement,
        buttonRemoveElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement,
        longitude: number, 
        latitude: number
    ): void {
        // add click event to add the search result to another list
        buttonAddElement.addEventListener("click", () => this.appendToPrepareData(buttonAddElement, buttonRemoveElement, elementResult, listElementData, listElementResult, longitude, latitude));
    }

    /**
     * @function        addEventRemoveFromPrepareData
     * @description     Click event that triggers removal of the added data
     * @param           {HTMLElement} buttonRemoveElement delete button
     * @param           {HTMLElement} elementResult element of the list on the DOM
     * @return          {void}
     */
    public addEventRemoveFromPrepareData(buttonRemoveElement: HTMLElement, 
        elementResult: HTMLElement): void {
        buttonRemoveElement.addEventListener("click", () => this.removeFromPrepareData(elementResult));
    }

    /**
     * @function        addEventUpdateLonLat
     * @description     Click event on geolocation button triggers the
     *                      movement of the map to lock on (x, y)
     * @param           {HTMLElement} buttonElement add button
     * @param           {number} longitude longitude of the current view/map
     * @param           {number} latitude latitude of the current view/map
     * @return          {void}
     */
    public addEventUpdateLonLat(
        buttonElement: HTMLElement, 
        longitude: number, 
        latitude: number
    ): void {
        // add event to update the map's (x, y) position
        buttonElement.addEventListener("click", () => this.updateLonLat(longitude, latitude));
    }

    public addEventAppendDefaultElementToPrepareData(
        buttonAddElement: HTMLElement,
        buttonRemoveElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement
        ) {
            buttonAddElement.addEventListener("click", ()=> this.appendDefaultElementToPrepareData(buttonAddElement, buttonRemoveElement, elementResult, listElementData, listElementResult));
        }
    
    public addEventUpdateDefaultElementLonLat(buttonElement: HTMLElement, defaultElement:HTMLElement): void {
        buttonElement.addEventListener("click", () => this.updateDefaultElementLonLat( defaultElement));
    }

    /**
     * @function        removeFromPrepareData
     * @description     Remove the element from a list
     * @param           {HTMLElement} elementResult a list element
     * @return          {void}
     */
    public removeFromPrepareData(elementResult:HTMLElement): void {
        elementResult.remove();
    }

    /**
     * @function        appendToPrepareData
     * @description     Change map position.
     *                  Hide the add button, and display the remove button.
     *                  Move the added result to another list.
     *                  Clear the result list.
     * @param           {HTMLElement} buttonAddElement add button
     * @param           {HTMLElement} buttonRemoveElement delete button
     * @param           {HTMLElement} elementResult element of the 1 result list item
     * @param           {HTMLElement} listElementData element of the prepare list
     * @param           {HTMLElement} listElementResults element of the result list
     * @param           {number} longitude value of the current 1 item
     * @param           {number} latitude value of the current 1 item
     * @returns         {void}
     */
    public appendToPrepareData(
        buttonAddElement: HTMLElement,
        buttonRemoveElement: HTMLElement,
        elementResult: HTMLElement, 
        listElementData: HTMLElement, 
        listElementResults: HTMLElement,
        longitude: number, 
        latitude: number
    ): void {
    
        // change map target based on longitude and latitude
        this.updateLonLat(longitude, latitude);

        // switch from add button to delete button
        buttonAddElement.style.display = "none";
        buttonRemoveElement.style.display = "block";
        // add list item to the list
        listElementData.appendChild(elementResult);


        
        // get bounding box after lonlat update
        elementResult.setAttribute("data-boundingBox", this.getBoundingBox().toString());

        // clear list
        this.clearList(listElementResults);
    }

    private appendDefaultElementToPrepareData(buttonAddElement:HTMLElement, buttonRemoveElement:HTMLElement, elementResult: HTMLElement, listElementData:HTMLElement, listElementResults:HTMLElement) {
        // clone the DIV element
        let defaultItem:HTMLElement = elementResult.cloneNode(true) as HTMLElement;
        // get cloned elements within cloned element to later re-add events to those elements
        let defaultItemName: HTMLElement = defaultItem.children[0] as HTMLElement;
        let button:HTMLElement = defaultItem.children[1] as HTMLElement;
        let addButton: HTMLElement = button.children[2] as HTMLElement;
        let removeButton:HTMLElement = button.children[1] as HTMLElement;
        let geolocateButton:HTMLElement = button.children[0] as HTMLElement;

        let defaultLatitude: number = parseFloat((defaultItem.children[2].children[0].children[1] as HTMLElement).innerText);
        let defaultLongitude: number = parseFloat((defaultItem.children[2].children[1].children[1] as HTMLElement).innerText);


        // re-add events
        this.addEventAppendDefaultElementToPrepareData(addButton, removeButton, defaultItem, listElementData, listElementResults);
        
        this.addEventRemoveFromPrepareData(removeButton, defaultItem);
        this.addEventUpdateDefaultElementLonLat(geolocateButton, defaultItem);
        
        defaultItem.style.display = "none";

        // switch from add button to delete button
        buttonAddElement.style.display = "none";
        buttonRemoveElement.style.display = "block";
        // add list item to the list
        listElementData.appendChild(elementResult);
        // set name back to default
        (defaultItem.children[0] as HTMLElement).innerText = "Custom District";

         
        // get bounding box after lonlat update
        elementResult.setAttribute("data-boundingBox", this.getBoundingBox().toString());
 

        listElementResults.insertBefore(defaultItem, listElementResults.firstChild);

        // clear list
        this.clearList(listElementResults);
    }

    /**
     * @function        updateLonLat
     * @description     Update the longitude and latitude of the map position
     * @param           {number} longitude current map longitude
     * @param           {number} latitude current map latitude
     * @return          {void}
     */
    private updateLonLat(longitude: number, latitude: number): void {
        // @ts-ignore
        this.view.centerOn(ol.proj.fromLonLat([longitude, latitude]), this.map.getSize(), [(this.map.getSize()[0] / 2), this.map.getSize()[1] / 2]);
    }

    private updateDefaultElementLonLat(defaultElement: HTMLElement): void {
        let defaultLatitude: number = parseFloat((defaultElement.children[2].children[0].children[1] as HTMLElement).innerText);
        let defaultLongitude: number = parseFloat((defaultElement.children[2].children[1].children[1] as HTMLElement).innerText);

        // @ts-ignore
        this.view.centerOn(ol.proj.fromLonLat([defaultLongitude, defaultLatitude]), this.map.getSize(), [(this.map.getSize()[0] / 2), this.map.getSize()[1] / 2]);
    }

    /**
     * @function        addEventSwitchTab
     * @description     Clicking triggers tab switching between lists
     * @param           {string} buttonElementName tab button
     * @param           {string} activeTab tab is that iactive
     * @param           {string} inactiveTab tab that is inactive
     * @param           {string} activeList list that is active
     * @param           {string} inactiveList list that is hiding
     * @return          {void}
     */
    public addEventSwitchTab(
        buttonElementName: string,
        activeTab: string,
        inactiveTab: string,
        activeList: string,
        inactiveList: string
    ) : void{
        (document.getElementById(buttonElementName) as HTMLElement).addEventListener("click", () => this.switchTab(activeTab, inactiveTab, activeList, inactiveList));
    }

    /**
     * @function        switchTab
     * @description     Turn on/off tabs based on passed parameter
     * @param           {string} activeTab current tab that's displayed
     * @param           {string} inactiveTab hidden/inactive tab
     * @param           {string} activeList current list that's displayed
     * @param           {string} inactiveList hidden/inactive list
     * @return          {void}
     */
    public switchTab(
        activeTab: string,
        inactiveTab: string,
        activeList: string,
        inactiveList: string
    ): void {
        this.activateTab(inactiveTab, inactiveList);
        this.deactivateTab(activeTab, activeList);
    }

    /**
     * @function        activateTab
     * @description     Display the inactive tab by changing the display type
     *                      and increase the element's visibility.
     * @param           {string} inactiveTabID DOM ID of the hidden tab
     * @param           {string} inactiveListID DOM ID of the hidden list
     * @return          {void}
     */
    private activateTab(inactiveTabID: string, inactiveListID: string): void {
        let inactiveTab: HTMLElement = document.getElementById(inactiveTabID) as HTMLElement;
        let inactiveList: HTMLElement = document.getElementById(inactiveListID) as HTMLElement;
        // increase element visibility
        inactiveTab.style.backgroundColor = "#FFF";
        inactiveTab.style.opacity = "1";

        inactiveList.style.display = "block";
    }

    /**
     * @function        deactivateTab
     * @description     Hide the active tab by changing the display type
     *                      and dimming the visibility of the element.
     * @param           {string} activeTabID DOM ID of the active tab
     * @param           {string} activeListID DOM ID of the active list
     * @return          {void}
     */
    private deactivateTab(activeTabID: string, activeListID: string): void {
        let activeTab: HTMLElement = document.getElementById(activeTabID) as HTMLElement;
        let activeList: HTMLElement = document.getElementById(activeListID) as HTMLElement;
        // decrease element visibility
        activeTab.style.backgroundColor = "#F3F3F3";
        activeTab.style.opacity = "0.45";

        activeList.style.display = "none";
    }

    private getCenter() {
        return this.view.getCenter();
    }

    private getBoundingBox(): number[] {
        let boundingBox: number[];
        let lonlat1: number[];
        let lonlat2: number[];

        boundingBox = [0, 0, 0, 0];

        // @ts-ignore
        lonlat1 = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[0], this.view.calculateExtent(this.map.getSize())[1]]);

        // @ts-ignore
        lonlat2 = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[2], this.view.calculateExtent(this.map.getSize())[3]]);

        boundingBox[0] = lonlat1[0];
        boundingBox[1] = lonlat1[1];
        boundingBox[2] = lonlat2[0];
        boundingBox[3] = lonlat2[1];

        return boundingBox;
    }

}