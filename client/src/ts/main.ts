///<reference path='search-list-ux.ts' />
///<reference path='search-input-ui.ts' />
///<reference path='map.ts' />

window.onload = function () { 
    let searchListUX: SearchListUX;
    let searchInputUI: SearchInputUI;

    let view: any;

    let mapZoomOutButton: HTMLElement;
    let mapZoomInButton: HTMLElement;
    let mapZoomDisplay: HTMLElement;

    let longitude: number = -123.364722;
    let latitude: number = 48.428333;

    let map: Mapping = new Mapping(longitude, latitude);


    map.createMap();

    mapZoomOutButton = document.getElementsByClassName("ol-zoom-out")[0] as HTMLElement;
    mapZoomInButton = document.getElementsByClassName("ol-zoom-in")[0] as HTMLElement;
    mapZoomDisplay = document.getElementById('mapZoomDisplay') as HTMLElement;

    mapZoomOutButton.innerHTML = "<div id='zoomOutButton'>-</div>";
    mapZoomInButton.innerHTML = "<div id='zoomInButton'>+</div>";

    if(map.mapLoaded()) {
        map.addEventGetLonLatOnMapMove();
        map.addEventDisplayZoom(map.getView(), mapZoomDisplay);
        
        searchListUX = new SearchListUX();

        //view = map.getView();

        searchListUX.setMap(map.getMap());
        searchListUX.setView(map.getView());
        searchListUX.initLonlatDefault();

        searchInputUI = new SearchInputUI(searchListUX);

        //view.centerOn([-13734663.156961612, 6182672.176861948], map.getMap().getSize(), [674/2, 484/2]);

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