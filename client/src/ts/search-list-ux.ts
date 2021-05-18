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
        latitude: number,
    ): void {
        // add event to update the map's (x, y) position
        buttonElement.addEventListener("click", () => this.updateLonLat(longitude, latitude));
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
    

    /*
    public initLonlatDefault(): void {
        
        // @ts-ignore
        this.lonlat1Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[0], this.view.calculateExtent(this.map.getSize())[1]]);
        
        // @ts-ignore
        this.lonlat2Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[2], this.view.calculateExtent(this.map.getSize())[3]]);
        
    }
    */

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

}