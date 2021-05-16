///<reference path='search-ui.ts' />
///<reference path='search-list-ux.ts' />
class SearchInputUI extends SearchUI{
    
    // @ts-ignore
    private searchInputUX: SearchInputUX;

    constructor(searchListUX: SearchListUX) {
        super();
        let searchButton: HTMLElement = document.getElementById('searchIcon') as HTMLElement;
        let searchInput: HTMLInputElement = document.getElementById('searchField') as HTMLInputElement;

        // @ts-ignore
        this.searchInputUX = new SearchInputUX(searchListUX);
        // @ts-ignore
        this.searchInputUX.addEventSearchDistrict(searchButton, searchInput, this.resultWrapper);
    }

}