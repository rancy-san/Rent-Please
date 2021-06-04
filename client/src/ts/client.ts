class Client {
    private connectionIP: string;
    private connectionPort: string;

    constructor() {
        this.connectionIP = "localhost";
        this.connectionPort = ":3000";
    }

    private requestReport(data:object) {
        let xhr = new XMLHttpRequest();
        
        // open connection with server calling specialized function
        xhr.open('POST', 'http://' + this.connectionIP + this.connectionPort + '/generateReport', true);
        // tell the server what type of data that is being sent (i.e. key1=value1&key2=value2)
        xhr.setRequestHeader('Content-Type', 'application/json');

        // when AJAX request listener ready, perform action with server response
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            }
            // display error message if unsuccessful
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        // send nothing to kick start the conversation
        xhr.send(JSON.stringify(data));
    }

    public addEventGenerateReport(elementButton: HTMLElement) {
        elementButton.addEventListener('click', ()=> this.prepareData());
    }

    private prepareData() {

        let dataContainer: any = (document.getElementById("prepareWrapper") as HTMLElement).children;
        let dataContainerLength = dataContainer.length;
        let data:any = {};

        while(dataContainerLength--) {
            let tempData :any= {};
            let tempName:string = (dataContainer[dataContainerLength].children[0] as HTMLElement).innerText;
            let tempBBox:string = (dataContainer[dataContainerLength] as HTMLElement).getAttribute('data-boundingbox') as string;

            tempData[tempName] = tempBBox;
            data[dataContainerLength] = tempData;
        }
        this.requestReport(data)
    }
}