///<reference path='search-ux.ts' />
class SearchListUX extends SearchUX {

    constructor() {
        super();
    }

    public addEventAppendToPrepareData(
        buttonAddElement: HTMLElement,
        buttonRemoveElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement,
        longitude: number, 
        latitude: number
    ): void {
        buttonAddElement.addEventListener("click", () => this.appendToPrepareData(buttonAddElement, buttonRemoveElement, elementResult, listElementData, listElementResult, longitude, latitude));
    }

    public addEventRemoveFromPrepareData(buttonRemoveElement: HTMLElement, 
        elementResult: HTMLElement): void {
        buttonRemoveElement.addEventListener("click", () => this.removeFromPrepareData(elementResult));
    }

    public addEventUpdateLonLat(
        buttonElement: HTMLElement, 
        longitude: number, 
        latitude: number,
    ): void {
        buttonElement.addEventListener("click", () => this.updateLonLat(longitude, latitude));
    }

    public removeFromPrepareData(elementResult:HTMLElement): void {
        elementResult.remove();
    }

    public appendToPrepareData(
        buttonAddElement: HTMLElement,
        buttonRemoveElement: HTMLElement,
        elementResult: HTMLElement, 
        listElementData: HTMLElement, 
        listElementResults: HTMLElement,
        longitude: number, 
        latitude: number
    ): void {
        this.updateLonLat(longitude, latitude);

        
        // @ts-ignore
        console.log(ol.proj.toLonLat([this.getView().calculateExtent(this.getMap().getSize())[0], this.getView().calculateExtent(this.getMap().getSize())[1]]));
        
        buttonAddElement.style.display = "none";
        buttonRemoveElement.style.display = "block";

        listElementData.appendChild(elementResult);
        // @ts-ignore
        this.clearList(listElementResults);
    }

    private updateLonLat(longitude: number, latitude: number): void {
        // @ts-ignore
        this.view.centerOn(ol.proj.fromLonLat([longitude, latitude]), this.map.getSize(), [(this.map.getSize()[0] / 2), this.map.getSize()[1] / 2]);
    }
    
    public initLonlatDefault(): void {
        
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
    ) : void{
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

    private activateTab(inactiveTabID: string, inactiveListID: string): void {

        let inactiveTab: HTMLElement = document.getElementById(inactiveTabID) as HTMLElement;
        let inactiveList: HTMLElement = document.getElementById(inactiveListID) as HTMLElement;

        inactiveTab.style.backgroundColor = "#FFF";
        inactiveTab.style.opacity = "1";

        inactiveList.style.display = "block";

    }

    private deactivateTab(activeTabID: string, activeListID: string): void {
        let activeTab: HTMLElement = document.getElementById(activeTabID) as HTMLElement;
        let activeList: HTMLElement = document.getElementById(activeListID) as HTMLElement;

        activeTab.style.backgroundColor = "#F3F3F3";
        activeTab.style.opacity = "0.45";

        activeList.style.display = "none";
    }

}