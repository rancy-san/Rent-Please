class SearchUX {

    public view: any;
    public map: any;


    public setView(view: any) {
        this.view = view;
    }

    public setMap(map: any) {
        this.map = map;
    }

    public clearList(listElement: HTMLElement) {
        listElement.innerHTML = "";
    }
}