class SearchUI {

    public prepareWrapper: HTMLElement;
    public resultWrapper: HTMLElement

    constructor() {
        this.prepareWrapper = document.getElementById("prepareWrapper") as HTMLElement;
        this.resultWrapper = document.getElementById("resultWrapper") as HTMLElement;
    }


    /*
    public getSearchTerm(): string {
        let searchField: any = document.getElementById("searchField");
        return searchField.value;
    }
    */
    
}