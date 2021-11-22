import { timeStamp } from 'console';
import { BehaviorSubject, timer } from 'rxjs';
import { DataRefsService } from './data-refs.service';
import { CONVERSION } from './dataRef';

export class XplaneService {
  public datarefService: DataRefsService;

  public $connectionStatus = new BehaviorSubject(false);

  constructor() {
    this.datarefService = new DataRefsService();
    this.$connectionStatus = this.datarefService.$connected;

    /**
     * Subscribe to dataRefs
     */
    this.datarefService.subscribeToDataRef('sim/flightmodel/position/latitude');
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/longitude'
    );
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/elevation',
      CONVERSION.METER_TO_FEET
    );
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/vh_ind_fpm'
    );
    this.datarefService.subscribeToDataRef('sim/flightmodel/position/theta');
    this.datarefService.subscribeToDataRef('sim/flightmodel/position/phi');
    this.datarefService.subscribeToDataRef('sim/flightmodel/position/psi');
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/groundspeed',
      CONVERSION.MPS_TO_KNOTS
    );
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/indicated_airspeed'
    );
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/true_airspeed',
      CONVERSION.MPS_TO_KNOTS
    );
    this.datarefService.subscribeToDataRef(
      'sim/flightmodel/position/y_agl',
      CONVERSION.METER_TO_FEET
    );
    this.datarefService.subscribeToDataRef('sim/time/sim_speed');
    this.datarefService.subscribeToDataRef('sim/time/paused');
  }
}
