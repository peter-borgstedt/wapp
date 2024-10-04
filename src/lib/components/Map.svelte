<script module lang="ts">
  let storedMapContainer: HTMLDivElement;
  let map: maplibregl.Map;
</script>

<script lang="ts">
  import { untrack } from "svelte";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { deviceStore } from "$lib/stores/device.svelte";
  let mapContainer: HTMLDivElement;

  $effect(() => {
    untrack(() => {
      if (storedMapContainer) {
        mapContainer.replaceWith(storedMapContainer);
      } else {
        storedMapContainer = mapContainer;
        map = new maplibregl.Map({
          container: "map",
          style: "https://api.maptiler.com/maps/bright/style.json?key=KJavAf9Akn2MfpcLdMa8",
          center: [17.0754, 59.6367], // Coordinates for Enköping, Sweden
          zoom: 14, // Adjusted zoom level for better view of the city
          attributionControl: false,
          fadeDuration: 0,
        });

        // map.addControl(new maplibregl.NavigationControl());

        map.on("load", () => {
          addDevicesToMap();
          map.resize();
        });

        document.addEventListener('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
          console.log("fullscreenchange", e);
        }, false);
      }
    })
  });

  async function addDevicesToMap() {
    // Load and add distinct images for each device
    for (const device of deviceStore.devices) {
      const image = await map.loadImage(device.imageUrl);
      map.addImage(`avatar-${device.id}`, image.data);
    }

    // Add a single source with features for all devices
    map.addSource("devices", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: deviceStore.devices.map(device => ({
          type: "Feature",
          properties: {
            id: device.id,
            name: device.name,
            imageUrl: device.imageUrl,
            battery: device.battery,
            lastSeen: device.lastSeen,
          },
          geometry: {
            type: "Point",
            coordinates: [device.location.longitude, device.location.latitude]
          }
        }))
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      clusterProperties: {
        'imageUrl': ['concat', ['get', 'imageUrl']]
      }
    });

    // Add a layer for clusters
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "devices",
      filter: ["has", "point_count"],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6', 100,
          '#f1f075', 750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, 100, 30, 750, 40
        ]
      }
    });

    // Add a layer for cluster counts
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "devices",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });

    // Add a layer for the white circle background
    map.addLayer({
      id: "unclustered-point-background",
      type: "circle",
      source: "devices",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "white",
        "circle-radius": 30,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#888"
      }
    });

    // Add a layer for unclustered points (device images)
    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "devices",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": ["concat", "avatar-", ["get", "id"]],
        "icon-size": 0.07,
        "icon-anchor": "center",
        "icon-offset": [0, 10],
        "icon-allow-overlap": true
      }
    });

    // Add click event listener to the clusters
    map.on('click', 'clusters', async (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      const geometry = features[0].geometry as GeoJSON.Point;

      const source = map.getSource('devices') as maplibregl.GeoJSONSource;
      if (source) {
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({ center: geometry.coordinates as maplibregl.LngLatLike , zoom });
      }
    });

    // Add click event listener to the unclustered points
    map.on('click', 'unclustered-point', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const deviceId = feature.properties.id;
        const device = deviceStore.devices.find(d => d.id === deviceId);

        if (device) {
          console.log('Clicked device:', device);
          deviceStore.selectDevice(device.id);

          // Get the popup menu element
          const popupMenu = document.getElementById('popup-menu-overlay');
          console.log('Popup menu:', popupMenu);
          let offsetY = 0;

          if (popupMenu) {
            // Calculate the offset based on the popup menu height
            offsetY = -popupMenu.offsetHeight;
          }

          // Center the map on the clicked point with offset
          map.easeTo({
            center: (e.features[0].geometry as GeoJSON.Point).coordinates as maplibregl.LngLatLike,
            offset: [0, offsetY],
            duration: 500
          });
        }
      }
    });

    // Change the cursor to a pointer when hovering over a cluster
    map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '');

    // Change the cursor to a pointer when hovering over an unclustered point
    map.on('mouseenter', 'unclustered-point', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'unclustered-point', () => map.getCanvas().style.cursor = '');
  }

  $effect(() => {
    // Clear existing markers (if any)
    untrack(() => {
      if (map) {
        map.getCanvasContainer().querySelectorAll(".maplibregl-marker").forEach((marker) => marker.remove());
      }
    })
  });
</script>

<div id="map" bind:this={mapContainer}></div>

<style>
  #map {
    width: 100%;
    height: 100%;
  }
</style>
