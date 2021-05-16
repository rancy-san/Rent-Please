///<reference path='search-ux.ts' />
class SearchListUX extends SearchUX {

    private zoomDefault: number;
    private zoomNew: number;
    private lonlat1Default: number[];
    private lonlat2Default: number[];

    constructor() {
        super();
        this.zoomDefault = 0;
        this.zoomNew = 0;
        this.lonlat1Default = [0,0];
        this.lonlat2Default = [0,0];
    }

    public addEventAppendToPrepareData(
        buttonElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement
    ): void {
        buttonElement.addEventListener("click", () => this.appendToPrepareData(elementResult, listElementData, listElementResult));
    }


    public addEventUpdateLonLat(buttonElement: HTMLElement, longitude: number, latitude: number): void {
        buttonElement.addEventListener("click", () => this.updateLonLat(longitude, latitude));
    }

    public addEventUpdateBBox(
        buttonElement: HTMLElement,
        districtBBoxLon1: number,
        districtBBoxLat1: number,
        districtBBoxLon2: number,
        districtBBoxLat2: number
    ): void {
        buttonElement.addEventListener("click", () => this.updateBBox(
            districtBBoxLon1,
            districtBBoxLat1,
            districtBBoxLon2,
            districtBBoxLat2
        ));
    }

    public appendToPrepareData(elementResult: HTMLElement, listElementData: HTMLElement, listElementResults: HTMLElement): void {
        listElementData.appendChild(elementResult);
        // @ts-ignore
        this.clearList(listElementResults);
    }

    private updateLonLat(longitude: number, latitude: number): void {
        // @ts-ignore
        this.view.centerOn(ol.proj.fromLonLat([longitude, latitude]), this.map.getSize(), [(this.map.getSize()[0] / 2), this.map.getSize()[1] / 2]);
    }

    public initZoomDefault() {
        this.zoomDefault = this.view.getZoom();
    }
    
    public initLonlatDefault() {
        
        // @ts-ignore
        this.lonlat1Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[0], this.view.calculateExtent(this.map.getSize())[1]]);
        
        // @ts-ignore
        this.lonlat2Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[2], this.view.calculateExtent(this.map.getSize())[3]]);
        
    }

    private updateBBox(
        districtBBoxLon1: number,
        districtBBoxLat1: number,
        districtBBoxLon2: number,
        districtBBoxLat2: number
    ) {
        /*
        // (y2 - y1) / (x2 - x1)
        let m1 = (districtBBoxLat2 - districtBBoxLat1) / (districtBBoxLon2 - districtBBoxLon1);
        let m2 = (this.lonlat2Default[1] - this.lonlat1Default[1]) / (this.lonlat2Default[0] - this.lonlat1Default[0]);

        this.zoomNew = m1 / m2;
        console.log(m1);
        console.log(m2);
        */
        this.view.setZoom((this.zoomDefault + this.zoomNew));
    }

    public addEventSwitchTab(
        buttonElementName: string,
        activeTab: string,
        inactiveTab: string,
        activeList: string,
        inactiveList: string
    ) {
        (document.getElementById(buttonElementName) as HTMLElement).addEventListener("click", () => this.switchTab(activeTab, inactiveTab, activeList, inactiveList));
    }


    public switchTab(
        activeTab: string,
        inactiveTab: string,
        activeList: string,
        inactiveList: string
    ): void {
        this.activateTab(inactiveTab, inactiveList);
        this.deactivateTab(activeTab, activeList);
    }

    private activateTab(inactiveTabID: string, inactiveListID: string) {

        let inactiveTab: HTMLElement = document.getElementById(inactiveTabID) as HTMLElement;
        let inactiveList: HTMLElement = document.getElementById(inactiveListID) as HTMLElement;

        inactiveTab.style.backgroundColor = "#FFF";
        inactiveTab.style.opacity = "1";

        inactiveList.style.display = "block";

    }

    private deactivateTab(activeTabID: string, activeListID: string) {
        let activeTab: HTMLElement = document.getElementById(activeTabID) as HTMLElement;
        let activeList: HTMLElement = document.getElementById(activeListID) as HTMLElement;

        activeTab.style.backgroundColor = "#F3F3F3";
        activeTab.style.opacity = "0.45";

        activeList.style.display = "none";
    }

}