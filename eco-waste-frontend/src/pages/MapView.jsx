import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { mapAPI, routeAPI } from '../services/api';
import { useSelector } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapBoxMap from '../components/maps/MapBoxMap';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = () => {
  const { user } = useSelector((state) => state.auth);
  const [viewState, setViewState] = useState({
    longitude: 36.8219,
    latitude: -1.2921,
    zoom: 12
  });
  const [facilities, setFacilities] = useState([]);
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const mapRef = useRef();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyFacilities();
      loadActiveRoutes();
    }
  }, [userLocation, filterType]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lng: position.coords.longitude,
            lat: position.coords.latitude
          };
          setUserLocation(location);
          setViewState({
            ...viewState,
            longitude: location.lng,
            latitude: location.lat
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Use default Nairobi location
          setUserLocation({ lng: 36.8219, lat: -1.2921 });
        }
      );
    }
  };

  const loadNearbyFacilities = async () => {
    if (!userLocation) return;

    try {
      const response = await mapAPI.getNearbyFacilities({
        lng: userLocation.lng,
        lat: userLocation.lat,
        radius: 10000,
        type: filterType !== 'all' ? filterType : undefined
      });
      setFacilities(response.data.data);
    } catch (error) {
      console.error('Failed to load facilities');
    }
  };

  const loadActiveRoutes = async () => {
    if (!userLocation) return;

    try {
      const response = await routeAPI.getActiveRoutes({
        lng: userLocation.lng,
        lat: userLocation.lat,
        radius: 10000
      });
      setActiveRoutes(response.data.data);
    } catch (error) {
      console.error('Failed to load routes');
    }
  };

  const facilityTypes = [
    { value: 'all', label: 'All Facilities', icon: '📍' },
    { value: 'recycling_center', label: 'Recycling', icon: '♻️' },
    { value: 'e-waste', label: 'E-Waste', icon: '💻' },
    { value: 'compost', label: 'Compost', icon: '🌱' },
    { value: 'hazardous', label: 'Hazardous', icon: '⚠️' },
  ];

  const getFacilityIcon = (type) => {
    const icons = {
      recycling_center: '♻️',
      'e-waste': '💻',
      compost: '🌱',
      hazardous: '⚠️',
      transfer_station: '🏢'
    };
    return icons[type] || '📍';
  };

  const getDirections = async (facility) => {
    if (!userLocation) return;

    try {
      const response = await mapAPI.getDirections({
        start: userLocation,
        end: {
          lng: facility.location.coordinates[0],
          lat: facility.location.coordinates[1]
        }
      });

      // Open in Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${facility.location.coordinates[1]},${facility.location.coordinates[0]}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to get directions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="w-10 h-10" />
          Facility Finder
        </h1>
        <p className="text-blue-100 text-lg">
          Find nearby recycling centers and disposal facilities
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {facilityTypes.map((type) => (
            <Badge
              key={type.value}
              variant={filterType === type.value ? 'success' : 'default'}
              size="lg"
              icon={type.icon}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setFilterType(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden h-[600px]">
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              style={{ width: '100%', height: '100%' }}
              ref={mapRef}
            >
              <NavigationControl position="top-right" />
              <GeolocateControl
                position="top-right"
                trackUserLocation
                onGeolocate={(e) => {
                  setUserLocation({
                    lng: e.coords.longitude,
                    lat: e.coords.latitude
                  });
                }}
              />

              {/* User Location */}
              {userLocation && (
                <Marker
                  longitude={userLocation.lng}
                  latitude={userLocation.lat}
                  anchor="bottom"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-blue-500 rounded-full animate-ping opacity-75" />
                    <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                  </div>
                </Marker>
              )}

              {/* Facilities */}
              {facilities.map((facility) => (
                <Marker
                  key={facility._id}
                  longitude={facility.location.coordinates[0]}
                  latitude={facility.location.coordinates[1]}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedFacility(facility);
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="cursor-pointer text-3xl drop-shadow-lg"
                  >
                    {getFacilityIcon(facility.type)}
                  </motion.div>
                </Marker>
              ))}

              {/* Active Routes (trucks) */}
              {activeRoutes.map((route) => (
                route.currentLocation && (
                  <Marker
                    key={route._id}
                    longitude={route.currentLocation.coordinates[0]}
                    latitude={route.currentLocation.coordinates[1]}
                    anchor="center"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      setSelectedRoute(route);
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="cursor-pointer text-3xl drop-shadow-lg"
                    >
                      🚛
                    </motion.div>
                  </Marker>
                )
              ))}

              {/* Facility Popup */}
              {selectedFacility && (
                <Popup
                  longitude={selectedFacility.location.coordinates[0]}
                  latitude={selectedFacility.location.coordinates[1]}
                  anchor="bottom"
                  onClose={() => setSelectedFacility(null)}
                  closeOnClick={false}
                  className="facility-popup"
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-1">{selectedFacility.name}</h3>
                    <Badge variant="info" size="sm" className="mb-2">
                      {selectedFacility.type.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-2">{selectedFacility.address}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      📏 {selectedFacility.distanceKm} km away
                    </p>
                    <Button
                      size="sm"
                      onClick={() => getDirections(selectedFacility)}
                      icon={<Navigation className="w-4 h-4" />}
                    >
                      Get Directions
                    </Button>
                  </div>
                </Popup>
              )}

              {/* Route Popup */}
              {selectedRoute && (
                <Popup
                  longitude={selectedRoute.currentLocation.coordinates[0]}
                  latitude={selectedRoute.currentLocation.coordinates[1]}
                  anchor="bottom"
                  onClose={() => setSelectedRoute(null)}
                  closeOnClick={false}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-1">{selectedRoute.name}</h3>
                    <Badge variant="success" size="sm" className="mb-2">
                      {selectedRoute.status}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Collecting: {selectedRoute.wasteType}
                    </p>
                  </div>
                </Popup>
              )}
            </Map>
          </Card>
        </div>

        {/* Facilities List */}
        <div>
          <Card title="Nearby Facilities" icon="📍">
            <div className="space-y-3 max-h-[540px] overflow-y-auto">
              {facilities.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No facilities found nearby</p>
                </div>
              ) : (
                facilities.map((facility) => (
                  <motion.div
                    key={facility._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedFacility(facility);
                      setViewState({
                        ...viewState,
                        longitude: facility.location.coordinates[0],
                        latitude: facility.location.coordinates[1],
                        zoom: 15
                      });
                    }}
                    className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFacilityIcon(facility.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{facility.name}</h4>
                          <Badge variant="default" size="sm">
                            {facility.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {facility.distanceKm} km
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {facility.address}
                    </p>

                    {facility.phone && (
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {facility.phone}
                      </p>
                    )}

                    {facility.hours && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {facility.hours.monday || 'Check hours'}
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(facility);
                      }}
                      icon={<Navigation className="w-4 h-4" />}
                    >
                      Directions
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* Active Routes */}
          {activeRoutes.length > 0 && (
            <Card title="Active Collection Routes" icon="🚛" className="mt-6">
              <div className="space-y-2">
                {activeRoutes.map((route) => (
                  <div
                    key={route._id}
                    className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{route.name}</span>
                      <Badge variant="success" size="sm">Live</Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Collecting: {route.wasteType}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;