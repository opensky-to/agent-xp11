"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XplaneService = void 0;
var rxjs_1 = require("rxjs");
var data_refs_service_1 = require("./data-refs.service");
var dataRef_1 = require("./dataRef");
var XplaneService = /** @class */ (function () {
    function XplaneService() {
        this.$connectionStatus = new rxjs_1.BehaviorSubject(false);
        this.datarefService = new data_refs_service_1.DataRefsService();
        this.$connectionStatus = this.datarefService.$connected;
        /**
         * Subscribe to dataRefs
         */
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/latitude');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/longitude');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/elevation', dataRef_1.CONVERSION.METER_TO_FEET);
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/vh_ind_fpm');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/theta');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/phi');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/psi');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/groundspeed', dataRef_1.CONVERSION.MPS_TO_KNOTS);
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/indicated_airspeed');
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/true_airspeed', dataRef_1.CONVERSION.MPS_TO_KNOTS);
        this.datarefService.subscribeToDataRef('sim/flightmodel/position/y_agl', dataRef_1.CONVERSION.METER_TO_FEET);
        this.datarefService.subscribeToDataRef('sim/time/sim_speed');
        this.datarefService.subscribeToDataRef('sim/time/paused');
    }
    return XplaneService;
}());
exports.XplaneService = XplaneService;
//# sourceMappingURL=x-plane.service.js.map