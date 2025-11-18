// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

export const useGeolocation = (watch = false) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
      setLoading(false);
    };

    const fail = (err) => {
      setError(err.message);
      setLoading(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(success, fail, options);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(success, fail, options);
    }
  };

  useEffect(() => {
    if (watch) {
      return getLocation();
    }
  }, [watch]);

  return { location, error, loading, getLocation };
};

