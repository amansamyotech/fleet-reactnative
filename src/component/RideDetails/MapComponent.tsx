import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";
import { useFocusEffect } from "@react-navigation/native";

interface MapComponentProps {
  bookingId?: string;
  booking?: any;
}

const MapComponent: React.FC<MapComponentProps> = ({ bookingId, booking }) => {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSentRef = useRef<number>(0);
  const webviewRef = useRef<WebView>(null);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [startPoint, setStartPoint] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [endPoint, setEndPoint] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [rideStatus, setRideStatus] = useState<string>(
    booking?.tripStatus || ""
  );

  useEffect(() => {
    if (booking?.tripStatus) {
      setRideStatus(booking.tripStatus);
    }
  }, [booking]);

  useEffect(() => {
    const fetchLatLng = async () => {
      try {
        if (booking?.tripStartLoc) {
          const geoStart = await Location?.geocodeAsync(booking?.tripStartLoc);
          if (geoStart.length > 0) {
            setStartPoint({
              latitude: geoStart[0].latitude,
              longitude: geoStart[0].longitude,
            });
          }
        }

        if (booking?.tripEndLoc) {
          const geoEnd = await Location.geocodeAsync(booking.tripEndLoc);
          if (geoEnd.length > 0) {
            setEndPoint({
              latitude: geoEnd[0].latitude,
              longitude: geoEnd[0].longitude,
            });
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    fetchLatLng();
  }, [booking]);

  useEffect(() => {
    let isMounted = true;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied"
        );
        return;
      }

      const initialLoc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: initialLoc.coords.latitude,
        longitude: initialLoc.coords.longitude,
      };
      if (isMounted) {
        setLocation(coords);
        sendLocationToBackend(coords.latitude, coords.longitude);
      }

      if (!intervalRef.current) {
        intervalRef.current = setInterval(async () => {
          const loc = await Location.getCurrentPositionAsync({});
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          if (isMounted) {
            setLocation(coords);
            sendLocationToBackend(coords.latitude, coords.longitude);

            if (webviewRef.current) {
              webviewRef.current.injectJavaScript(`
                if(window.updateLiveMarker) {
                  window.updateLiveMarker(${coords.latitude}, ${coords.longitude});
                }
              `);
            }
          }
        }, 5000);
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    if (!bookingId) return;

    const now = Date.now();
    if (now - lastSentRef.current < 4500) return;
    lastSentRef.current = now;

    try {
      await rideTimelineServices.saveLocation(bookingId, latitude, longitude);
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const handleJourney = async () => {
    if (!bookingId) return router.replace("/rideDetails");
    if (bookingId) {
      try {
        await rideTimelineServices.updateTripStatus(bookingId, {
          tripStatus: "Completed",
        });
        setRideStatus("Completed");
        router.replace("/(main)/(home)");
      } catch (error) {
        console.error("Error updating trip status:", error);
      }
    } else {
      router.replace("/rideDetails");
    }
  };

  const handleCancel = async () => {
    if (!bookingId) return router.replace("/rideDetails");
    if (bookingId) {
      try {
        await rideTimelineServices.updateTripStatus(bookingId, {
          tripStatus: "Cancelled",
        });
        setRideStatus("Cancelled");
        router.replace("/(main)/(home)");
      } catch (error) {
        console.error("Error updating trip status:", error);
      }
    } else {
      router.replace("/rideDetails");
    }
  };
  useFocusEffect(
    useCallback(() => {
      return () => {
        rideTimelineServices.clearBookingsCache();
      };
    }, [])
  );
  const getMapHtml = () => {
    if (!startPoint || !endPoint) return "<h3>Loading route...</h3>";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Route Map</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
          <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.min.js"></script>
          <style>
            html, body, #map { height: 100%; margin: 0; padding: 0; }
            .leaflet-routing-container { display: none !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map').setView([${startPoint.latitude}, ${startPoint.longitude}], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap'
            }).addTo(map);

            const greenIcon = new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            });

            const redIcon = new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            });

            const blueIcon = new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            });

            L.marker([${startPoint.latitude}, ${startPoint.longitude}], {icon: greenIcon}).addTo(map).bindPopup("Start");
            L.marker([${endPoint.latitude}, ${endPoint.longitude}], {icon: redIcon}).addTo(map).bindPopup("End");

            L.Routing.control({
              waypoints: [
                L.latLng(${startPoint.latitude}, ${startPoint.longitude}),
                L.latLng(${endPoint.latitude}, ${endPoint.longitude})
              ],
              addWaypoints: false, draggableWaypoints: false, routeWhileDragging: false,
              show: false, createMarker: () => null
            }).addTo(map);

            function getDistance(lat1, lon1, lat2, lon2) {
              const R = 6371;
              const dLat = (lat2 - lat1) * Math.PI / 180;
              const dLon = (lon2 - lon1) * Math.PI / 180;
              const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              return R * c;
            }

            let liveMarker = null;
            window.updateLiveMarker = function(lat, lng) {
              if (!liveMarker) {
                liveMarker = L.marker([lat, lng], {icon: blueIcon})
                  .addTo(map)
                  .bindPopup("You are here");
              } else {
                liveMarker.setLatLng([lat, lng]);
              }

              const distance = getDistance(lat, lng, ${endPoint.latitude}, ${endPoint.longitude});
              liveMarker.setPopupContent("You are here<br>Distance: " + distance.toFixed(2) + " km");
              liveMarker.openPopup();

              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "distance",
                value: distance.toFixed(2)
              }));
            };
          </script>
        </body>
      </html>
    `;
  };

  const isDisabled = rideStatus === "Completed" || rideStatus === "Cancelled";

  return (
    <View style={styles.container}>
      {location ? (
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: getMapHtml() }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "distance") {
                console.log("Distance from live location:", data.value, "km");
              }
            } catch (e) {
              console.log("Error parsing message", e);
            }
          }}
        />
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>Loading map...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {rideStatus === "Cancelled" ? (
          // Sirf Cancel button (disabled, center me)
          <TouchableOpacity
            style={[
              styles.cancelButton,
              styles.centerButton,
              styles.disabledButton,
            ]}
            disabled
          >
            <Text style={styles.buttonText}>Ride Cancelled</Text>
          </TouchableOpacity>
        ) : rideStatus === "Completed" ? (
          // Sirf Complete button (disabled, center me)
          <TouchableOpacity
            style={[
              styles.trackButton,
              styles.centerButton,
              styles.disabledButton,
            ]}
            disabled
          >
            <Text style={styles.buttonText}>Ride Completed</Text>
          </TouchableOpacity>
        ) : (
          // Normal case -> dono buttons
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={handleJourney}
            >
              <Text style={styles.buttonText}>Journey Complete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: hp("5%"),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelButton: { backgroundColor: "red", padding: 10, borderRadius: 8 },
  trackButton: { backgroundColor: "green", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  disabledButton: {
    backgroundColor: "gray",
    opacity: 0.6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    flex: 1,
    marginHorizontal: "20%",
    alignItems: "center",
  },
});
