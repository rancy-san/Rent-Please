const Wikipedia = require('node-wikipedia');

class NeighbourhoodFinder {
    constructor() {
        Wikipedia.categories.tree(
            "Neighbourhoods_in_Ottawa",
            function(response) {
                console.log(response);
            });
    }
}

module.exports = NeighbourhoodFinder;