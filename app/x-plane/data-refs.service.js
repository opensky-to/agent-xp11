"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRefsService = void 0;
var dgram_1 = require("dgram");
var rxjs_1 = require("rxjs");
var dataRef_1 = require("./dataRef");
var DataRefsService = /** @class */ (function () {
    /**
     * Start listening for messages from X-Plane
     * @public
     * @memberof DataRefsService
     */
    function DataRefsService() {
        var _this = this;
        /**
         * The list of subscribed datarefs
         * @public
         * @memberof DataRefsService
         */
        this.subscribedDataRefs = new rxjs_1.BehaviorSubject([]);
        /**
         * The udp client
         */
        this.client = dgram_1.createSocket('udp4');
        /**
         * X-Plane connected status
         */
        this.$connected = new rxjs_1.BehaviorSubject(false);
        this.client.on('message', function (message, remote) {
            _this.onMessage(message, remote);
        });
        // Subscribe to the ingame time dataref
        this.subscribeToDataRef('sim/time/zulu_time_sec');
        // Subscribe to connected
        this.$connected.subscribe(function (connected) {
            console.log("Connected: " + connected);
        });
        /**
         * Check if X-Plane is connected every 2 seconds
         */
        rxjs_1.timer(0, 2000).subscribe(function () {
            var _a;
            var difference = new Date().getTime() - ((_a = _this.lastConnected) === null || _a === void 0 ? void 0 : _a.getTime());
            // If difference is greater than 10 seconds and we are connected, disconnect
            if (difference > 10000) {
                if (_this.$connected.getValue()) {
                    _this.$connected.next(false);
                }
            }
            else {
                // if currently disconnected, connection is established
                if (!_this.$connected.value) {
                    _this.$connected.next(true);
                }
            }
        });
    }
    /**
     * Create a message to send to X-Plane
     * @param dataRef The dataref to subscribe to
     * @param index The index of the dataref
     * @param freq The frequency of the dataref
     * @returns The message to send to X-Plane
     * @private
     * @memberof DataRefsService
     * @example
     * createMessage('sim/time/zulu_time_sec', 0, 1);
     */
    DataRefsService.prototype.createMessage = function (dataRef, index, freq) {
        var message = Buffer.alloc(413);
        message.write('RREF\0');
        message.writeInt8(freq, 5);
        message.writeInt8(index, 9);
        message.write(dataRef, 13);
        return message;
    };
    /**
     * Subscribe to a dataref
     * @param dataRef The dataref to subscribe to
     * @param conversion The conversion to apply to the dataref
     * @public
     * @memberof DataRefsService
     * @example
     * subscribeToDataRef('sim/time/zulu_time_sec');
     * subscribeToDataRef('sim/time/elevation', CONVERSION.METER_TO_FEET);
     */
    DataRefsService.prototype.subscribeToDataRef = function (dataRef, conversion) {
        if (conversion === void 0) { conversion = dataRef_1.CONVERSION.NONE; }
        // If dataref is already subscribed, do nothing
        if (this.subscribedDataRefs.value.find(function (d) { return d.dataRef === dataRef; })) {
            return;
        }
        // Find next available index
        var index = 0;
        while (this.subscribedDataRefs.value.find(function (d) { return d.index === index; })) {
            index++;
        }
        // If dataref is not active, add it to the list of active datarefs
        var message = this.createMessage(dataRef, index, 1);
        this.client.send(message, 0, message.length, 49000, '127.0.0.1', function (err, bytes) {
            if (err) {
                console.error('Error', err);
            }
        });
        // Add dataref to the list of subscribed datarefs
        this.subscribedDataRefs.next(__spreadArray(__spreadArray([], this.subscribedDataRefs.value), [
            new dataRef_1.DataRef(index, dataRef, conversion),
        ]));
    };
    /**
     * On message handler
     * @param message The message received from X-Plane
     * @param _remote The remote info of the message
     */
    DataRefsService.prototype.onMessage = function (message, _remote) {
        var _this = this;
        var label = message.toString('utf8', 0, 4);
        if (label !== 'RREF') {
            return;
        }
        else {
            this.lastConnected = new Date();
            var offset = 9;
            var messages = [];
            // RREFs values are floats. They occupy 8 bytes. One message can contain several values,
            // depending on how many you asked for. Read every value by iterating over message and
            // increasing the offset by 8.
            while (offset < message.length) {
                var value = message.readFloatLE(offset);
                messages.push(value);
                offset += 8;
            }
            // loop through messages and apply conversion
            messages.forEach(function (value, index) {
                var dataRef = _this.subscribedDataRefs.value.find(function (ref) { return ref.index === index; });
                if (dataRef) {
                    var convertedValue = dataRef.convertValue(value);
                    dataRef.value = convertedValue;
                }
            });
            // Emit the new value
            this.subscribedDataRefs.next(this.subscribedDataRefs.value);
        }
    };
    return DataRefsService;
}());
exports.DataRefsService = DataRefsService;
//# sourceMappingURL=data-refs.service.js.map