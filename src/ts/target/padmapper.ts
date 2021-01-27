const AbstractTarget = require('./target');

class Padmapper extends AbstractTarget {
    public async search() {
        console.log("OK");
    }
}

module.exports = Padmapper;