const axios = require('axios');
const geolib = require('geolib');
const Municipality = require('../models/Municipality');

class MapService {
  constructor() {
    this.mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    this.mapboxBaseUrl = 'https://api.mapbox.com';
  }

  // Get nearby facilities
  async getNearbyFacilities(lng, lat, radius = 5000, type = null, municipalityId) {
    try {
      const municipality = await Municipality.findById(municipalityId);
      
      if (!municipality) {
        return [];
      }

      // Filter facilities within radius
      const nearbyFacilities = municipality.facilities.filter(facility => {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: lng },
          {
            latitude: facility.location.coordinates[1],
            longitude: facility.location.coordinates[0]
          }
        );

        const withinRadius = distance <= radius;
        const matchesType = !type || facility.type === type;

        return withinRadius && matchesType;
      });

      // Calculate distances and sort
      const facilitiesWithDistance = nearbyFacilities.map(facility => {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: lng },
          {
            latitude: facility.location.coordinates[1],
            longitude: facility.location.coordinates[0]
          }
        );

        return {
          ...facility.toObject(),
          distance: distance, // in meters
          distanceKm: (distance / 1000).toFixed(2)
        };
      });

      // Sort by distance
      facilitiesWithDistance.sort((a, b) => a.distance - b.distance);

      return facilitiesWithDistance;
    } catch (error) {
      console.error('Get nearby facilities error:', error);
      throw error;
    }
  }

  // Get directions between two points
  async getDirections(start, end, profile = 'driving') {
    try {
      const url = `${this.mapboxBaseUrl}/directions/v5/mapbox/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}`;

      const response = await axios.get(url, {
        params: {
          access_token: this.mapboxToken,
          geometries: 'geojson',
          overview: 'full',
          steps: true
        }
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        
        return {
          distance: route.distance, // meters
          duration: route.duration, // seconds
          geometry: route.geometry,
          steps: route.legs[0].steps.map(step => ({
            instruction: step.maneuver.instruction,
            distance: step.distance,
            duration: step.duration
          }))
        };
      }

      throw new Error('No route found');
    } catch (error) {
      console.error('Get directions error:', error);
      throw new Error('Failed to get directions');
    }
  }

  // Optimize route with multiple waypoints
  async optimizeRoute(waypoints) {
    try {
      if (waypoints.length < 2) {
        throw new Error('At least 2 waypoints required');
      }

      // Format coordinates for Mapbox
      const coordinates = waypoints
        .map(wp => `${wp.lng},${wp.lat}`)
        .join(';');

      const url = `${this.mapboxBaseUrl}/optimized-trips/v1/mapbox/driving/${coordinates}`;

      const response = await axios.get(url, {
        params: {
          access_token: this.mapboxToken,
          geometries: 'geojson',
          overview: 'full',
          steps: true,
          source: 'first', // Start from first waypoint
          destination: 'last' // End at last waypoint
        }
      });

      if (response.data.trips && response.data.trips.length > 0) {
        const trip = response.data.trips[0];
        
        return {
          distance: trip.distance, // meters
          duration: trip.duration, // seconds
          geometry: trip.geometry,
          waypoints: response.data.waypoints.map((wp, idx) => ({
            originalIndex: idx,
            waypointIndex: wp.waypoint_index,
            location: wp.location
          }))
        };
      }

      throw new Error('Route optimization failed');
    } catch (error) {
      console.error('Optimize route error:', error);
      throw new Error('Failed to optimize route');
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    try {
      const url = `${this.mapboxBaseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

      const response = await axios.get(url, {
        params: {
          access_token: this.mapboxToken,
          limit: 1
        }
      });

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        
        return {
          address: feature.place_name,
          coordinates: {
            lng: feature.center[0],
            lat: feature.center[1]
          }
        };
      }

      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocode error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lng, lat) {
    try {
      const url = `${this.mapboxBaseUrl}/geocoding/v5/mapbox.places/${lng},${lat}.json`;

      const response = await axios.get(url, {
        params: {
          access_token: this.mapboxToken,
          limit: 1
        }
      });

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].place_name;
      }

      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return 'Unknown location';
    }
  }

  // Calculate ETA based on distance and current speed
  calculateETA(distanceMeters, averageSpeedKmh = 30) {
    const distanceKm = distanceMeters / 1000;
    const timeHours = distanceKm / averageSpeedKmh;
    const timeMinutes = Math.round(timeHours * 60);
    
    return {
      minutes: timeMinutes,
      eta: new Date(Date.now() + timeMinutes * 60 * 1000)
    };
  }

  // Check if point is within municipality boundary
  isPointInMunicipality(point, municipalityBoundary) {
    // Simplified check - in production use turf.js or similar
    // For now, just return true
    return true;
  }
}

module.exports = new MapService();
