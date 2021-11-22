import { createSocket, RemoteInfo } from 'dgram';
import { BehaviorSubject, timer } from 'rxjs';
import { CONVERSION, DataRef } from './dataRef';

export class DataRefsService {
  /**
   * The list of subscribed datarefs
   * @public
   * @memberof DataRefsService
   */
  public subscribedDataRefs = new BehaviorSubject<DataRef[]>([]);

  /**
   * The udp client
   */
  private client = createSocket('udp4');

  /**
   * X-Plane connected status
   */
  public $connected = new BehaviorSubject(false);

  /**
   * The last time X-Plane was connected
   */
  private lastConnected: Date;

  /**
   * Start listening for messages from X-Plane
   * @public
   * @memberof DataRefsService
   */
  constructor() {
    this.client.on('message', (message, remote) => {
      this.onMessage(message, remote);
    });

    // Subscribe to the ingame time dataref
    this.subscribeToDataRef('sim/time/zulu_time_sec');

    // Subscribe to connected
    this.$connected.subscribe(connected => {});

    /**
     * Check if X-Plane is connected every 2 seconds
     */
    timer(0, 2000).subscribe(() => {
      const difference = new Date().getTime() - this.lastConnected?.getTime();
      // If difference is greater than 10 seconds and we are connected, disconnect
      if (difference > 10000) {
        if (this.$connected.getValue()) {
          this.$connected.next(false);
        }
      } else {
        // if currently disconnected, connection is established
        if (!this.$connected.value) {
          this.$connected.next(true);
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
  private createMessage(dataRef: string, index: number, freq: number) {
    const message = Buffer.alloc(413);
    message.write('RREF\0');
    message.writeInt8(freq, 5);
    message.writeInt8(index, 9);
    message.write(dataRef, 13);
    return message;
  }

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
  public subscribeToDataRef(
    dataRef: string,
    conversion: CONVERSION = CONVERSION.NONE
  ) {
    // If dataref is already subscribed, do nothing
    if (this.subscribedDataRefs.value.find(d => d.dataRef === dataRef)) {
      return;
    }

    // Find next available index
    let index = 0;
    while (this.subscribedDataRefs.value.find(d => d.index === index)) {
      index++;
    }

    // If dataref is not active, add it to the list of active datarefs
    const message = this.createMessage(dataRef, index, 1);
    this.client.send(
      message,
      0,
      message.length,
      49000,
      '127.0.0.1',
      (err, bytes) => {
        if (err) {
          console.error('Error', err);
        }
      }
    );

    // Add dataref to the list of subscribed datarefs
    this.subscribedDataRefs.next([
      ...this.subscribedDataRefs.value,
      new DataRef(index, dataRef, conversion),
    ]);
  }

  /**
   * On message handler
   * @param message The message received from X-Plane
   * @param _remote The remote info of the message
   */
  private onMessage(message: Buffer, _remote: RemoteInfo) {
    const label = message.toString('utf8', 0, 4);
    if (label !== 'RREF') {
      return;
    } else {
      this.lastConnected = new Date();
      let offset = 9;
      let messages = [];

      // RREFs values are floats. They occupy 8 bytes. One message can contain several values,
      // depending on how many you asked for. Read every value by iterating over message and
      // increasing the offset by 8.
      while (offset < message.length) {
        const value = message.readFloatLE(offset);
        messages.push(value);

        offset += 8;
      }

      // loop through messages and apply conversion
      messages.forEach((value, index) => {
        const dataRef = this.subscribedDataRefs.value.find(
          ref => ref.index === index
        );

        if (dataRef) {
          const convertedValue = dataRef.convertValue(value);
          dataRef.value = convertedValue;
        }
      });

      // Emit the new value
      this.subscribedDataRefs.next(this.subscribedDataRefs.value);
    }
  }
}
