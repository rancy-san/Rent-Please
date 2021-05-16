///<reference path='search-ux.ts' />
///<reference path='search-list-ux.ts' />
class SearchInputUX extends SearchUX {

    // @ts-ignore
    private searchListUX: SearchListUX;

    constructor(searchListUX: SearchListUX) {
        super();
        this.searchListUX = searchListUX;
    }

    public addEventSearchDistrict(
        buttonElement: HTMLElement,
        inputElement: HTMLInputElement,
        listElementResults: HTMLElement
    ) {
        buttonElement.addEventListener("click", () => this.searchDistrict(inputElement, listElementResults));
    }

    public searchDistrict(inputElement: HTMLInputElement, listElementResult: HTMLElement) {
        // @ts-ignore
        let search: Searching = new Searching(this.searchListUX);
        search.searchDistrict(inputElement.value);
        // @ts-ignore
        this.clearList(listElementResult);
    }

}