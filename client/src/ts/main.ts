window.onload = function () {
    let longitude: number = -123.380578361318935;
    let latitude: number = 48.453718893086205;

    // @ts-ignore
    let map: Mapping = new Mapping(longitude, latitude);
    // @ts-ignore
    //let searchUI: SearchUI;
    // @ts-ignore
    let searchListUX: SearchListUX;
    // @ts-ignore
    let searchInputUI: SearchInputUI;

    let view: any;

    let mapZoomOutButton: Element;
    let mapZoomInButton: Element;

    map.createMap();

    mapZoomOutButton = document.getElementsByClassName("ol-zoom-out")[0];
    mapZoomInButton = document.getElementsByClassName("ol-zoom-in")[0];

    mapZoomOutButton.innerHTML = "<div id='zoomOutButton'>-</div>";
    mapZoomInButton.innerHTML = "<div id='zoomInButton'>+</div>";

    map.addEventGetLonLatOnMapMove();
    if(map.mapLoaded()) {
        // @ts-ignore
        //searchUI = new SearchUI();
        // @ts-ignore
        searchListUX = new SearchListUX();
        // @ts-ignore
        searchInputUI = new SearchInputUI();

        //view = map.getView();

        searchListUX.setMap(map.getMap());
        searchListUX.setView(map.getView());

        //view.centerOn([-13734663.156961612, 6182672.176861948], map.getMap().getSize(), [674/2, 484/2]);
        //searchUX.setMap(map.getView());
        // @ts-ignore
        //ol.proj.toLonLat(map.getMapEvent().values_.view.values_.center) = [-13734663.156961612, 6182672.176861948];

        //search.searchDistrict(searchUI.getSearchTerm());

        searchListUX.addEventSwitchTab(
            'tabSearchResults',
            'tabPrepareResults',
            'tabSearchResults',
            'prepareWrapper',
            'resultWrapper'
        );

        searchListUX.addEventSwitchTab(
            'tabPrepareResults',
            'tabSearchResults',
            'tabPrepareResults',
            'resultWrapper',
            'prepareWrapper'
        );
    }
}