export class DataRef {
  index: number;
  dataRef: string;
  conversion = CONVERSION.NONE;
  value?: number;

  convertValue(value: number): number {
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
  }

  constructor(index: number, dataRef: string, conversion: CONVERSION) {
    this.index = index;
    this.dataRef = dataRef;
    this.conversion = conversion;
  }
}

export enum CONVERSION {
  NONE,
  METER_TO_FEET,
  FEET_TO_METER,
  KNOTS_TO_MPS,
  MPS_TO_KNOTS,
}
