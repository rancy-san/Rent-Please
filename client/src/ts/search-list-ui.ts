///<reference path='search-ui.ts' />
///<reference path='search-list-ux.ts' />
class SearchListUI extends SearchUI {

    // @ts-ignore
    private searchListUX: SearchListUX;

    constructor(searchListUX: SearchListUX) {
        // @ts-ignore
        super();
        this.searchListUX = searchListUX;
        
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
        
        resultContainer.setAttribute("data-districtName", districtName);
        resultContainer.setAttribute("data-districtLat", districtLat.toString());
        resultContainer.setAttribute("data-districtLon", districtLon.toString());
        resultContainer.setAttribute("data-districtBBoxLon1", districtBBoxLon1.toString());
        resultContainer.setAttribute("data-districtBBoxLat1", districtBBoxLat1.toString());
        resultContainer.setAttribute("data-districtBBoxLon2", districtBBoxLon2.toString());
        resultContainer.setAttribute("data-districtBBoxLat2", districtBBoxLat2.toString());

        // add data to Prepare list event triggered
        // @ts-ignore
        this.searchListUX.addEventAppendToPrepareData(addDistrictButtonContainer, resultContainer, this.prepareWrapper, this.resultWrapper);
        this.searchListUX.addEventUpdateLonLat(geolocateButtonContainer, districtLat, districtLon);

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