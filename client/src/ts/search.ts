interface result {
    title: string;
    bbox: number[];
    geometry: any;
    coordinates: number[];
}

class Searching {
    public createResultContainer(
        districtName: string,
        districtLat: number,
        districtLon: number,
        districtBBoxLon1: number,
        districtBBoxLat1: number,
        districtBBoxLon2: number,
        districtBBoxLat2: number
    ) {

        // @ts-ignore
        let resultWrapper:HTMLElement = document.getElementById("resultWrapper");
        let resultContainer:HTMLElement = document.createElement("DIV");
        let resultNameContainer:HTMLElement = document.createElement("DIV");

        let buttonContainer:HTMLElement = document.createElement("DIV");
        let geolocateButtonContainer:HTMLElement = document.createElement("DIV");
        let geoLocateIcon:HTMLElement = document.createElement("DIV");

        resultContainer.className = "resultContainer";
        resultNameContainer.className = "resultNameContainer";
        geolocateButtonContainer.className = "geolocateButtonContainer";
        geoLocateIcon.className = "geoLocateIcon";

        resultNameContainer.innerText = districtName;

        geolocateButtonContainer.appendChild(geoLocateIcon);

        resultContainer.appendChild(resultNameContainer);
        resultContainer.appendChild(geolocateButtonContainer);
        resultWrapper.appendChild(resultContainer);
    }

    public searchDistrict() {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        let searchField: any = document.getElementById("searchField");

        xhr.onreadystatechange = (() => this.handleCallback(xhr));
        xhr.open("GET", ("http://geogratis.gc.ca/services/geolocation/en/locate?q=" + searchField.value), true);
        xhr.send();
    }

    public handleCallback(xhr: XMLHttpRequest) {
        let searchData: result[];
        let searchDataLength: number;

        if (xhr.readyState == 4 && xhr.status == 200) {
            searchData = JSON.parse(xhr.responseText);
            searchDataLength = searchData.length;


            for (let i: number = 0; i < searchDataLength; i++) {
                this.createResultContainer(
                    searchData[i].title,
                    searchData[i].geometry.coordinates[0],
                    searchData[i].geometry.coordinates[1],
                    searchData[i].bbox[0],
                    searchData[i].bbox[1],
                    searchData[i].bbox[2],
                    searchData[i].bbox[3]
                );
            }

            //console.log(searchData);
            //console.log(searchData[0].geometry.coordinates);
        }
    }
}