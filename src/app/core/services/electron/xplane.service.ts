import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import { BehaviorSubject } from 'rxjs';
import { IPC_EVENTS } from '../../../../../app/ipc/ipc-events.enum';
import { DataRef } from '../../../../../app/x-plane/dataRef';

@Injectable({
  providedIn: 'root',
})
export class XplaneService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;

  xplaneConnected = new BehaviorSubject<boolean>(null);
  dataRefs = new BehaviorSubject<DataRef[]>([]);

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      const xplaneStatus: boolean = this.ipcRenderer.sendSync(
        IPC_EVENTS.X_PLANE_CONNECTION_STATUS_REQUEST
      );
      this.xplaneConnected.next(xplaneStatus);

      this.ipcRenderer.on(
        IPC_EVENTS.X_PLANE_DATAREFS,
        (event, dataRefs: DataRef[]) => {
          this.dataRefs.next(dataRefs);
        }
      );

      this.ipcRenderer.on(
        IPC_EVENTS.X_PLANE_CONNECTION_STATUS,
        (event, status: boolean) => {
          this.xplaneConnected.next(status);
        }
      );
    }
  }

  /**
   * Gets dataref value for given dataref name
   */
  getDataRefValue(dataRefName: string): number {
    let value = null;
    this.dataRefs.value.forEach(dataRef => {
      if (dataRef.dataRef === dataRefName) {
        value = dataRef.value;
        return;
      }
    });
    return value;
  }
}
