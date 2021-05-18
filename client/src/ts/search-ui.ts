/**
 * @filename        search-ui.ts
 * @description     This class serves as a template for other  Search UI classes.
 *                  Classes must store their search results in a list on the UI.
 */

abstract class SearchUI {

    public prepareWrapper: HTMLElement;
    public resultWrapper: HTMLElement

    /**
     * @description     store DOM elements to have items added to and removed from
     */
    constructor() {
        this.prepareWrapper = document.getElementById("prepareWrapper") as HTMLElement;
        this.resultWrapper = document.getElementById("resultWrapper") as HTMLElement;
    }  
}