var System = /** @class */ (function () {
    function System() {
    }
    System.prototype.percentLoaded = function (total, count, decimalPlaces) {
        return (((total - count) / total) * 100).toFixed(decimalPlaces);
    };
    return System;
}());
module.exports = System;
//# sourceMappingURL=system.js.map