///<reference path='search-ux.ts' />
class SearchInputUX extends SearchUX {
    
    public addEventSearchGeolocation(buttonElement: HTMLElement, inputElement: HTMLInputElement, listElementResults: HTMLElement) {
        buttonElement.addEventListener("click", () => this.searchGeolocation(inputElement,  listElementResults));
    }

    public searchGeolocation(inputElement: HTMLInputElement, listElementResult: HTMLElement) {
        // @ts-ignore
        let search:Searching = new Searching();
        search.searchDistrict(inputElement.value);
        // @ts-ignore
        this.clearList(listElementResult);
    }

}