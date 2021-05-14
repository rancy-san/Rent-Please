class SearchUI {
    // GUI creation should be in its own class
    public createResultContainer(
        districtName: string,
        districtLat: number,
        districtLon: number,
        districtBBoxLon1: number,
        districtBBoxLat1: number,
        districtBBoxLon2: number,
        districtBBoxLat2: number
    ):void {

        // @ts-ignore
        let resultWrapper:HTMLElement = document.getElementById("resultWrapper");
        let resultContainer:HTMLElement = document.createElement("DIV");
        let resultNameContainer:HTMLElement = document.createElement("DIV");

        let buttonContainer:HTMLElement = document.createElement("DIV");
        let geolocateButtonContainer:HTMLElement = document.createElement("DIV");
        let geoLocateIcon:HTMLElement = document.createElement("DIV");


        resultContainer.className = "resultContainer";
        resultNameContainer.className = "resultNameContainer";
        buttonContainer.className = "buttonContainer";
        geolocateButtonContainer.className = "geolocateButtonContainer";
        geoLocateIcon.className = "geoLocateIcon";

        resultNameContainer.innerText = districtName;

        geolocateButtonContainer.appendChild(geoLocateIcon);
        buttonContainer.appendChild(geolocateButtonContainer);

        resultContainer.appendChild(resultNameContainer);
        resultContainer.appendChild(buttonContainer);

        resultWrapper.appendChild(resultContainer);
    }

    public getSearchTerm():string {
        let searchField: any = document.getElementById("searchField");
        return searchField.value;
    }
}