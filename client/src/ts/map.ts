/**
 *  @filename       map.ts
 *  @description    Handles initializing of the Open Layers map.
 *                  Handles obtaining from and updating to the map.
 *                  Adds a user-interaction component to obtaining
 *                      the bounding box (BBox), longitude and latitude.
 */

class Mapping {
    // map location's east/west distance from prime meridian 
    private longitude: number;
    // map location's north/south distance from equator
    private latitude: number;
    // default zoom value when map initializes display
    private zoomDefault: number;
    // minimum zoom level allowed
    private zoomMin: number;
    // maximum zoom level allowed
    private zoomMax: number;
    // map object as a whole
    private map: any;
    // map's view object. A component for obtaining or modifying visuals
    private view: any;

    /**
     * @description     Initialize the initial map data to be displayed onload
     * @param           {number} longitude initial map longitude 
     * @param           {number} latitude initial map latitude
     */
    constructor(longitute: number, latitude: number) {
        this.longitude = longitute;
        this.latitude = latitude;

        // default static values to optimize webcrawl rental applications (BBox) 
        this.zoomDefault = 13;
        this.zoomMin = 15;
        this.zoomMax = 12.2688228803426;

    }

    /**
     * @function        createMap
     * @description     Create the map to be displayed on the DOM.
     *                  Uses the OpenLayers JavaScript front-end library.
     * @return          {void}
     */
    public createMap(): void {
        // create custom view to have the object used in other Typescript classes
        this.createView();
        // create a new map object with a custom view for the 'map' DOM element
        // @ts-ignore
        this.map = new ol.Map({
            target: 'map',
            // @ts-ignore
            view: this.view,
            layers: [
                // @ts-ignore
                new ol.layer.Tile({
                    // @ts-ignore
                    source: new ol.source.OSM()
                })
            ]
        });
    }

    /**
    * @function         createView
    * @description      Create custom view to have the object used 
    *                       in other Typescript classes.
    *                   Sets the default zoom and location display of the map.
    * @return           {void}
    */
    private createView(): void {
        // @ts-ignore
        this.view = new ol.View({
            // @ts-ignore
            center: ol.proj.fromLonLat([this.longitude, this.latitude]),
            // const
            zoom: this.zoomDefault
        });
    }

    /**
     * @function        addEventGetLonLatOnMapMove
     * @description     Listen for map drag/movement
     * @return          {void}
     */
    public addEventGetLonLatOnMapMove(elementName:string): void {
        // get longitude and latitude on map onload/move/drag
        this.map.on('moveend', this.getLonLatMap);
        this.map.on('pointerdrag', () => this.displayDefaultElement(elementName));
    }

    /**
     * @function        addEventDisplayZoom
     * @description     Listen for zoom out/in changes on the map
     * @param           {any} view object for the visual aspect of the map
     * @param           {HTMLElement} mapZoomDisplay element to display zoom%
     * @return          {void}
     */
    public addEventDisplayZoom(view: any, mapZoomDisplay: HTMLElement): void {
        // mouse wheel scroll up or down
        this.map.on('wheel', () => this.displayZoom(view, mapZoomDisplay));
        // zoom in button on the DOM
        document.getElementsByClassName('ol-zoom-in')[0].addEventListener('click', () => this.displayZoom(view, mapZoomDisplay));
        // zoom out button on the DOM
        document.getElementsByClassName('ol-zoom-out')[0].addEventListener('click', () => this.displayZoom(view, mapZoomDisplay));
    }

    /**
     * @function        displayZoom
     * @description     Convert zoom level and display it on the DOM
     * @param           {any} view object for the visual aspect of the map
     * @param           {HTMLElement} mapZoomDisplay element to display zoom% 
     * @return          {void}
     */
    public displayZoom(view: any, mapZoomDisplay: HTMLElement): void {
        setTimeout(() => mapZoomDisplay.innerText = (Math.round((this.zoomDefault / view.getZoom()) * 100) + "%"), 250);
    }

    /**
     * @function        mapLoaded
     * @description     Returns whether the map has loaded on the DOM
     * @returns         {boolean}
     */
    public mapLoaded(): boolean {
        return this.map.once('postrender', function () {
            return true;
        });
    }

    /**
    * @function        getLonLatMap
    * @description     Set default values when the map loads on the DOM
    * @param           {any} event 
    * @return          {void}
    */
    private getLonLatMap(event: any): void {
        this.map = event.map;
        this.view = this.map.getView();
    }

    private displayDefaultElement(elementName:string):void {
        (document.getElementsByClassName(elementName)[0] as HTMLElement).style.display = "block";
    }

    /**
     * @function        getView
     * @description     return the view object for use in other classes
     * @returns         {any}
     */
    public getView(): any {
        return this.view;
    }

    /**
     * @function        getMap
     * @description     return the map object for use in other classes
     * @returns         {any}
     */
    public getMap(): any {
        return this.map;
    }
}