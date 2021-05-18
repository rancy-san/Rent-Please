/**
 * @filename        search-ux.ts
 * @description     This class is a template for other classes that
 *                      retrieve data and require that data to be
 *                      update the map and view of OpenLayers.
 */

abstract class SearchUX {
    // map display components
    public view: any;
    // map object in its entirety
    public map: any;

    constructor() {
    }

    /**
     * @function        setView
     * @description     Store the map's view after map instantiation
     * @param           {any} view view object from map
     * @return          {void}
     */
    public setView(view: any):void {
        this.view = view;
    }

    /**
     * @function        setMap
     * @description     Store the map object to be used by other classes
     * @param           {any} map map object
     * @return          {void}
     */
    public setMap(map: any) {
        this.map = map;
    }

    /**
     * @function        getView
     * @description     retrieve view object
     * @return          {any}
     */
    public getView():any {
        return this.view;
    }

    /**
     * @function        getMap
     * @description     retrieve map object
     * @return          {any}
     */
    public getMap() {
        return this.map;
    }

    /**
     * @function        clearList
     * @description     Empty an element's HTML content.
     *                  Used to clear the HTML content of a list.
     * @param           {HTMLElement} listElement 
     * @returns         {any}
     */
    public clearList(listElement: HTMLElement) {
        listElement.innerHTML = "";
    }
}