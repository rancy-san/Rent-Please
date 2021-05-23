/**
 * @filedname       main.ts
 * @description     When the DOM window loads, this file will
 *                      begin loading the OpenLayers map and
 *                      prepare the DOM elements to be responsive,
 *                      and respond to map movement.
 */

///<reference path='search-list-ux.ts' />
///<reference path='search-input-ui.ts' />
///<reference path='map.ts' />
///<reference path='client.ts' />

window.onload = function () { 
    let client: Client;
    let searchListUX: SearchListUX;
    let searchInputUI: SearchInputUI;

    let view: any;
    // OpenLayers zoom buttons
    let mapZoomOutButton: HTMLElement;
    let mapZoomInButton: HTMLElement;
    let mapZoomDisplay: HTMLElement;
    // default map coordinates
    let longitude: number = -123.364722;
    let latitude: number = 48.428333;
    // instantiate the Mapping object to being working with the map
    let map: Mapping = new Mapping(longitude, latitude);

    // create the Openlayers map
    map.createMap();

    // obtain zoom buttons from OpenLayers
    mapZoomOutButton = document.getElementsByClassName("ol-zoom-out")[0] as HTMLElement;
    mapZoomInButton = document.getElementsByClassName("ol-zoom-in")[0] as HTMLElement;
    mapZoomDisplay = document.getElementById('mapZoomDisplay') as HTMLElement;

    // replace default text data to make the buttons clearer
    mapZoomOutButton.innerHTML = "<div id='zoomOutButton'>-</div>";
    mapZoomInButton.innerHTML = "<div id='zoomInButton'>+</div>";

    client = new Client();
    client.requestReport();

    // ensure map is loaded before obtaining and setting map data
    if(map.mapLoaded()) {

        // respond to zoom actions on the map
        map.addEventDisplayZoom(map.getView(), mapZoomDisplay);
        // add extra functionality to the list
        searchListUX = new SearchListUX();
        // pass the map and view object to the following objects
        searchListUX.setMap(map.getMap());
        searchListUX.setView(map.getView());

        searchInputUI = new SearchInputUI(searchListUX);
        // add events to the static UI components
        searchListUX.addEventSwitchTab(
            'tabSearchResults',
            'tabPrepareResults',
            'tabSearchResults',
            'prepareWrapper',
            'resultWrapper'
        );

        // add events to the static UI components
        searchListUX.addEventSwitchTab(
            'tabPrepareResults',
            'tabSearchResults',
            'tabPrepareResults',
            'resultWrapper',
            'prepareWrapper'
        );

        // default lonlat
        map.setDisplayDefaultElementLonLat('resultContainer');
        // respond to movement actions to the OpenLayers map
        map.addEventGetLonLatOnMapMove();
        // append the default district to the DOM
        map.addEventDisplayDefaultDistrict('resultContainer');
    }
}