import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';


interface Coordinates {
  latitude: number;
  longitude: number;
}


interface RoutePoint extends Coordinates {}

export default function App(): React.ReactElement {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [route, setRoute] = useState<RoutePoint[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

 
  const [region, setRegion] = useState<Region>({
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });


const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'User-Agent': 'RouteEX/52.0.0' , 
          'Accept-Language': 'en' 
        }
      }
    );
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`Geocoding request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    console.log('Geocoding Result:', data);
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error(`Could not find coordinates for ${address}`);
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    setErrorMsg(`Error finding location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

const getRoute = async (originCoords: Coordinates, destCoords: Coordinates): Promise<RoutePoint[] | null> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destCoords.longitude},${destCoords.latitude}?overview=full&geometries=geojson`,
      {
        headers: {
          'User-Agent': 'RouteEX/52.0.0' 
        }
      }
    );
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`Routing request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
    } else {
      throw new Error('Could not calculate route');
    }
  } catch (error) {
    console.error('Routing error:', error);
    setErrorMsg(`Error calculating route: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

  
  const handleTrackRoute = async (): Promise<void> => {
    if (!origin || !destination) {
      setErrorMsg('Please enter both origin and destination');
      return;
    }

    setErrorMsg(null);
    
    try {
      console.log("origin",origin)
      const originCoords = await geocodeAddress(origin);
      const destCoords = await geocodeAddress(destination);
      console.log("originCoords",originCoords)
      
      if (!originCoords || !destCoords) {
        return;
      }
      
      const routeData = await getRoute(originCoords, destCoords);
      
      if (routeData) {
        setRoute(routeData);
        

        const minLat = Math.min(originCoords.latitude, destCoords.latitude);
        const maxLat = Math.max(originCoords.latitude, destCoords.latitude);
        const minLng = Math.min(originCoords.longitude, destCoords.longitude);
        const maxLng = Math.max(originCoords.longitude, destCoords.longitude);
        

        mapRef.current?.animateToRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: (maxLat - minLat) * 1.5,
          longitudeDelta: (maxLng - minLng) * 1.5,
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Error calculating route');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Origin (e.g., Indore)"
          value={origin}
          onChangeText={setOrigin}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination (e.g., Shirdi)"
          value={destination}
          onChangeText={setDestination}
        />
        <TouchableOpacity style={styles.button} onPress={handleTrackRoute}>
          <Text style={styles.buttonText}>Track Route</Text>
        </TouchableOpacity>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        provider="google"
      >
        {route && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="#1E88E5"
          />
        )}
        
        {origin && route && route.length > 0 && (
          <Marker
            coordinate={route[0]}
            title={origin}
            pinColor="#4CAF50"
          />
        )}
        
        {destination && route && route.length > 0 && (
          <Marker
            coordinate={route[route.length - 1]}
            title={destination}
            pinColor="#F44336"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50, // For status bar
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});