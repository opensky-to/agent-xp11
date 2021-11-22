import { Component, OnInit, ViewChild } from '@angular/core';
import { icon, MapOptions, marker, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { XplaneService } from '../core/services/electron/xplane.service';
import 'leaflet-rotatedmarker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    layers: [
      tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution:
            // eslint-disable-next-line max-len
            '<a href="http://cartodb.com/attributions">© CartoDB</a> <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap</a> Not for real world navigation',
        }
      ),
    ],
    zoom: 5,
    center: [-50.505, -0.09],
  };

  mapCenter: L.LatLng;

  planeMarker: L.Marker;

  private dataRefsSubscription: Subscription;

  private map?: L.Map;

  constructor(private readonly xplaneService: XplaneService) {
    /**
     * Subscribe to Xplane connected status
     * If connected, subscribe to Xplane data
     * If disconnected, unsubscribe from Xplane data
     */
    this.xplaneService.xplaneConnected.subscribe(isConnected => {
      if (isConnected) {
        /**
         * If the plane marker is not created, create it
         */
        if (!this.planeMarker) {
          this.planeMarker = marker([0, 0], {
            icon: icon({
              iconUrl: 'assets/opensky/plane.svg',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            }),
          });

          /**
           * Add the plane marker to the map
           */
          this.options.layers.push(this.planeMarker);
        }
        this.dataRefsSubscription = this.xplaneService.dataRefs.subscribe(
          data => {
            /**
             * Update mapposition
             */
            this.updatePosition();
          }
        );
      } else {
        this.dataRefsSubscription.unsubscribe();
      }
    });
  }

  /**
   * Set map on map ready
   */
  onMapReady(map: L.Map) {
    this.map = map;
  }

  updatePosition() {
    /**
     * Get lat, lon and heading from Xplane data
     */
    const lat = this.xplaneService.getDataRefValue(
      'sim/flightmodel/position/latitude'
    );
    const lon = this.xplaneService.getDataRefValue(
      'sim/flightmodel/position/longitude'
    );
    const heading = this.xplaneService.getDataRefValue(
      'sim/flightmodel/position/psi'
    );
    /**
     * If either lat, long or heading is not defined, return
     */
    if (!lat || !lon || !heading) {
      return;
    }

    /**
     * Update the plane marker position
     */
    this.planeMarker.setLatLng([lat, lon]);
    this.planeMarker.setRotationAngle(heading);

    /**
     * Update the map position
     */
    if (this.map) {
      this.map.panTo([lat, lon]);
    }
  }

  ngOnInit(): void {}
}
