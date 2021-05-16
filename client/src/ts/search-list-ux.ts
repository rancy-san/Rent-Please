///<reference path='search-ux.ts' />
class SearchListUX extends SearchUX {

    constructor() {
        super();
    }

    public addEventAppendToPrepareData(
        buttonElement: HTMLElement,
        elementResult: HTMLElement,
        listElementData: HTMLElement,
        listElementResult: HTMLElement
    ): void {
        buttonElement.addEventListener("click", () => this.appendToPrepareData(elementResult, listElementData, listElementResult));
    }


    public addEventUpdateLonLat(buttonElement: HTMLElement): void {
        buttonElement.addEventListener("click", () => this.updateLonLat());
    }
    
    public appendToPrepareData(elementResult: HTMLElement, listElementData: HTMLElement, listElementResults: HTMLElement): void {
        listElementData.appendChild(elementResult);
        // @ts-ignore
        this.clearList(listElementResults);
    }
    
    private updateLonLat(): void {
        // @ts-ignore
        console.log(this.view);
        // @ts-ignore
       //this.view.centerOn([-13734663.156961612, 6182672.176861948], this.map.getMap().getSize(), [674/2, 484/2]);
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