///<reference path='search-ux.ts' />
class SearchListUX extends SearchUX {

    constructor() {
        super();
    }

    public addEventAppendToPrepareData(
        buttonElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement,
        longitude: number, 
        latitude: number
    ): void {
        buttonElement.addEventListener("click", () => this.appendToPrepareData(elementResult, listElementData, listElementResult));
    }


    public addEventUpdateLonLat(
        buttonElement: HTMLElement, 
        longitude: number, 
        latitude: number,
    ): void {
        buttonElement.addEventListener("click", () => this.updateLonLat(longitude, latitude));
    }

    public appendToPrepareData(
        elementResult: HTMLElement, 
        listElementData: HTMLElement, 
        listElementResults: HTMLElement
    ): void {
        this.updateLonLat();
        listElementData.appendChild(elementResult);
        // @ts-ignore
        this.clearList(listElementResults);
    }

    private updateLonLat(longitude: number, latitude: number): void {
        // @ts-ignore
        this.view.centerOn(ol.proj.fromLonLat([longitude, latitude]), this.map.getSize(), [(this.map.getSize()[0] / 2), this.map.getSize()[1] / 2]);
    }
    
    public initLonlatDefault() {
        
        // @ts-ignore
        this.lonlat1Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[0], this.view.calculateExtent(this.map.getSize())[1]]);
        
        // @ts-ignore
        this.lonlat2Default = ol.proj.toLonLat([this.view.calculateExtent(this.map.getSize())[2], this.view.calculateExtent(this.map.getSize())[3]]);
        
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