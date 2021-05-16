class SearchUX {

    public view: any;
    public map: any;

    constructor() {
    }


    public setView(view: any) {
        this.view = view;
    }

    public setMap(map: any) {
        this.map = map;
    }

    public getView() {
        return this.view;
    }

    public getMap() {
        return this.map;
    }

    public clearList(listElement: HTMLElement) {
        listElement.innerHTML = "";
    }
}