import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

import { useCities } from '../contexts/CitiesContext';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { useUrlPosition } from '../hooks/useUrlPosition';

import Button from './Button';

import styles from './Map.module.css';

const Map = () => {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([39, 34]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();
  const [mapLat, mapLng] = useUrlPosition();
  const navigate = useNavigate();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  const handleButtonClick = () => {
    getPosition();
    if (geoLocationPosition) {
      navigate(`form?lat=${geoLocationPosition.lat}&lng=${geoLocationPosition.lng}`);
    }
  };

  return (
    <div className={styles.mapContainer}>
      <Button type='position' onClick={handleButtonClick}>
        {isLoadingPosition ? 'Loading...' : 'Use your position'}
      </Button>
      <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map(city => (
          <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

const ChangeCenter = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();
  useMapEvents({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
};

export default Map;
