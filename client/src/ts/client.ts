class Client {
    private connectionIP: string;
    private connectionPort: string;
    private reportFilename: string;
    private appOverlayContainer: HTMLElement;

    constructor() {
        this.connectionIP = "localhost";
        this.connectionPort = ":3000";
        this.reportFilename = "";
        this.appOverlayContainer = document.getElementById("appOverlayContainer") as HTMLElement;
    }

    private requestReport(data:object) {
        
        let xhr = new XMLHttpRequest();
        
        // open connection with server calling specialized function
        xhr.open('POST', 'http://' + this.connectionIP + this.connectionPort + '/generateReport', true);
        // tell the server what type of data that is being sent (i.e. key1=value1&key2=value2)
        xhr.setRequestHeader('Content-Type', 'application/json');

        // when AJAX request listener ready, perform action with server response
        xhr.onload = (() => {
            if (xhr.status === 200) {
                this.reportFilename = xhr.responseText;
                this.createDownloadLink();
            }
            // display error message if unsuccessful
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
            this.appOverlayContainer.style.display = "none";
        });
        // send nothing to kick start the conversation
        xhr.send(JSON.stringify(data))
        
        this.appOverlayContainer.style.display = "block";
    }

    private requestReportDownload() {
        let xhr = new XMLHttpRequest();
        
        // open connection with server calling specialized function
        xhr.open('POST', 'http://' + this.connectionIP + this.connectionPort + '/downloadReport', true);
        // tell the server what type of data that is being sent (i.e. key1=value1&key2=value2)
        xhr.setRequestHeader('Content-Type', 'application/json');

        // when AJAX request listener ready, perform action with server response
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                this.reportFilename = xhr.responseText;
                if(this.reportFilename)
                    this.createDownloadLink();
            }
            // display error message if unsuccessful
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        let test: object = {"filename":"Rent, Please! 2021-06-10 10꞉54꞉33 135190.csv"};
        // send nothing to kick start the conversation
        xhr.send(JSON.stringify(test));
    }


    private createDownloadLink() {
        let generateReportButtonLink: any = document.getElementById("generateReportButtonLink");
        generateReportButtonLink.href = this.reportFilename;
        generateReportButtonLink.click();
        generateReportButtonLink.href = "";
        this.reportFilename = null as any;
    }

    public addEventGenerateReport(elementButton: HTMLElement) {
        elementButton.addEventListener('click', ()=> this.prepareData());
    }

    private prepareData() {
        let prepareWrapper: HTMLElement = document.getElementById("prepareWrapper") as HTMLElement;
        if (prepareWrapper.children.length > 0) {
            let dataContainer: any = (prepareWrapper as HTMLElement).children;
            let dataContainerLength = dataContainer.length;
            let data: any = {};

            while (dataContainerLength--) {
                let tempData: any = {};
                let tempName: string = (dataContainer[dataContainerLength].children[0] as HTMLElement).innerText;
                let tempBBox: string = (dataContainer[dataContainerLength] as HTMLElement).getAttribute('data-boundingbox') as string;

                tempData[tempName] = tempBBox;
                data[dataContainerLength] = tempData;
            }
            this.requestReport(data)
        }
    }
}