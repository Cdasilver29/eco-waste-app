// src/components/maps/MapBoxMap.jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Use Vite env variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapBoxMap = ({ center = [36.8219, -1.2921], zoom = 10 }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => map.remove();
  }, [center, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
    />
  );
};

export default MapBoxMap;

