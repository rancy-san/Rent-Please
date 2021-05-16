class Mapping {
    private longitude: number;
    private latitude: number;
    private zoomDefault: number;
    private zoomMin: number;
    private zoomMax: number;
    private map: any;
    private view: any;
    
    constructor(longitute: number, latitude: number) {
        this.longitude = longitute;
        this.latitude = latitude;

        this.zoomDefault = 13;
        this.zoomMin = 15;
        this.zoomMax = 12.2688228803426;

    }

    public createMap(): void {
        this.createView();
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

    private createView() {
        // @ts-ignore
        this.view = new ol.View({
            // @ts-ignore
            center: ol.proj.fromLonLat([this.longitude, this.latitude]),
            // const
            zoom: this.zoomDefault
        });
    }

    public addEventGetLonLatOnMapMove(): void {
        this.map.on('moveend', this.getLonLatMap);
    }

    public mapLoaded(): boolean {
        return this.map.once('postrender', function () {
            return true;
        });
    }

    private getLonLatMap(event: any): void {
        let map:any = event.map;

        let view: any = map.getView();
        let center: number = view.getCenter();

        /*
        // @ts-ignore
        console.log(ol.proj.toLonLat([map.getView().calculateExtent(map.getSize())[0], map.getView().calculateExtent(map.getSize())[1]]));

        // @ts-ignore
        console.log(ol.proj.toLonLat([map.getView().calculateExtent(map.getSize())[2], map.getView().calculateExtent(map.getSize())[3]]));
*/

    }

    public getView(): any {
        return this.view;
    }

    public getMap(): any {
        return this.map;
    }

}