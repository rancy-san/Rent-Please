class System {
    constructor() {}
    
    private percentLoaded(total, count, decimalPlaces) {
        return (((total-count)/total)*100).toFixed(decimalPlaces)
    }
}

module.exports = System;