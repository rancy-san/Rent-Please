///<reference path='search-ui.ts' />
class SearchListUI extends SearchUI {

    // @ts-ignore
    private searchListUX: SearchListUX;

    constructor() {
        super();
        // @ts-ignore
        this.searchListUX = new SearchListUX();
        
    }

    // GUI creation should be in its own class
    public createResultContainer(
        districtName: string,
        districtLat: number,
        districtLon: number,
        districtBBoxLon1: number,
        districtBBoxLat1: number,
        districtBBoxLon2: number,
        districtBBoxLat2: number
    ): void {

        let resultContainer: HTMLElement = this.createDIVButton("resultContainer");
        let resultNameContainer: HTMLElement = this.createDIVButton("resultNameContainer");
        let buttonContainer: HTMLElement = this.createDIVButton("buttonContainer");
        let addDistrictButtonContainer: HTMLElement = this.createDIVButton("addDistrictButtonContainer");
        let addDistrictIcon: HTMLElement = this.createDIVButton("addDistrictIcon");
        let geolocateButtonContainer: HTMLElement = this.createDIVButton("geolocateButtonContainer");
        let geoLocateIcon: HTMLElement = this.createDIVButton("geoLocateIcon");

        resultNameContainer.innerText = districtName;

        // add data to Prepare list event triggered
        // @ts-ignore
        this.searchListUX.addEventAppendToPrepareData(addDistrictButtonContainer, resultContainer, this.prepareWrapper, this.resultWrapper);
        this.searchListUX.addEventUpdateLonLat(geolocateButtonContainer);

        // nest icons in its respective container
        addDistrictButtonContainer.appendChild(addDistrictIcon);
        geolocateButtonContainer.appendChild(geoLocateIcon);

        // add buttons to button container
        buttonContainer.appendChild(geolocateButtonContainer);
        buttonContainer.appendChild(addDistrictButtonContainer);

        // place buttons on in the result found
        resultContainer.appendChild(resultNameContainer);
        resultContainer.appendChild(buttonContainer);

        // @ts-ignore
        this.resultWrapper.appendChild(resultContainer);
    }

    private createDIVButton(elementName: string): HTMLElement {
        let button: HTMLElement = document.createElement("DIV");
        button.className = elementName;

        return button;
    }

}