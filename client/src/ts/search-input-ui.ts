///<reference path='search-ui.ts' />
class SearchInputUI extends SearchUI{
    
    // @ts-ignore
    private searchInputUX: SearchInputUX;

    constructor() {
        super();
        let searchButton: HTMLElement = document.getElementById('searchIcon') as HTMLElement;
        let searchInput: HTMLInputElement = document.getElementById('searchField') as HTMLInputElement;

        // @ts-ignore
        this.searchInputUX = new SearchInputUX();
        // @ts-ignore
        this.searchInputUX.addEventSearchGeolocation(searchButton, searchInput, this.resultWrapper);
    }

}