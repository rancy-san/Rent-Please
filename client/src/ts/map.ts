class Mapping {
    private longitude: number;
    private latitude: number;
    private zoomDefault: number;
    private zoomMin: number;
    private zoomMax: number;
    private map:any;

    constructor(longitute: number, latitude: number) {
        this.longitude = longitute;
        this.latitude = latitude;

        this.zoomDefault = 12;
        this.zoomMin = 15;
        this.zoomMax = 12.2688228803426;

    }

    public createMap():void {
        // @ts-ignore
        this.map = new ol.Map({
            target: 'map',
            // @ts-ignore
            view: new ol.View({
                // @ts-ignore
                center: ol.proj.fromLonLat([this.longitude, this.latitude]),
                // const
                zoom: this.zoomDefault
            }),
            layers: [
                // @ts-ignore
                new ol.layer.Tile({
                    // @ts-ignore
                    source: new ol.source.OSM()
                })
            ]
        });
    }

    public addEventGetLonLatOnMapMove():void {
        this.map.on('moveend', this.getLonLatMap);
    }

    private getLonLatMap(event:any):void {
        
            let map:any = event.map;
            let view :any= map.getView();
            let center:number = view.getCenter();
            
            // @ts-ignore
            console.log(ol.proj.toLonLat([map.getView().calculateExtent(map.getSize())[0], map.getView().calculateExtent(map.getSize())[1]]));
            
            // @ts-ignore
            console.log(ol.proj.toLonLat([map.getView().calculateExtent(map.getSize())[2], map.getView().calculateExtent(map.getSize())[3]]));
    }
}

window.onload = function () {
    let longitude:number = -123.380578361318935;
    let latitude:number = 48.453718893086205;

    let map:Mapping = new Mapping(longitude, latitude);
     // @ts-ignore
    let search:Searching = new Searching();

    let mapZoomOutButton:Element;
    let mapZoomInButton:Element;
    
    map.createMap();
    
    mapZoomOutButton = document.getElementsByClassName("ol-zoom-out")[0];
    mapZoomInButton = document.getElementsByClassName("ol-zoom-in")[0];

    mapZoomOutButton.innerHTML = "<div id='zoomOutButton'>-</div>";
    mapZoomInButton.innerHTML = "<div id='zoomInButton'>+</div>";

    map.addEventGetLonLatOnMapMove();

    search.searchDistrict();

}