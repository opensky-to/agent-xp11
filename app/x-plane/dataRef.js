"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONVERSION = exports.DataRef = void 0;
var DataRef = /** @class */ (function () {
    function DataRef(index, dataRef, conversion) {
        this.conversion = CONVERSION.NONE;
        this.index = index;
        this.dataRef = dataRef;
        this.conversion = conversion;
    }
    DataRef.prototype.convertValue = function (value) {
        switch (this.conversion) {
            case CONVERSION.NONE:
                return value; // no conversion  (default)
            case CONVERSION.METER_TO_FEET:
                return value * 3.28084; // meters to feet
            case CONVERSION.FEET_TO_METER:
                return value / 3.28084; // feet to meters
            case CONVERSION.KNOTS_TO_MPS:
                return value * 0.514444; // knots to m/s
            case CONVERSION.MPS_TO_KNOTS:
                return value / 0.514444; // m/s to knots
        }
    };
    return DataRef;
}());
exports.DataRef = DataRef;
var CONVERSION;
(function (CONVERSION) {
    CONVERSION[CONVERSION["NONE"] = 0] = "NONE";
    CONVERSION[CONVERSION["METER_TO_FEET"] = 1] = "METER_TO_FEET";
    CONVERSION[CONVERSION["FEET_TO_METER"] = 2] = "FEET_TO_METER";
    CONVERSION[CONVERSION["KNOTS_TO_MPS"] = 3] = "KNOTS_TO_MPS";
    CONVERSION[CONVERSION["MPS_TO_KNOTS"] = 4] = "MPS_TO_KNOTS";
})(CONVERSION = exports.CONVERSION || (exports.CONVERSION = {}));
//# sourceMappingURL=dataRef.js.map