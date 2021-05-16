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
        districtLon: number
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

        // add data to Prepare list event triggered
        // @ts-ignore
        this.searchListUX.addEventAppendToPrepareData(
            addDistrictButtonContainer, 
            resultContainer, 
            this.prepareWrapper, 
            this.resultWrapper,
            districtLat,
            districtLon
        );

        this.searchListUX.addEventUpdateLonLat(
            geolocateButtonContainer, 
            districtLat, 
            districtLon
        );

        /*
        
        this.searchListUX.addEventUpdateBBox(
            geolocateButtonContainer,
            districtBBoxLon1,
            districtBBoxLat1,
            districtBBoxLon2,
            districtBBoxLat2
        );

        */
        

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