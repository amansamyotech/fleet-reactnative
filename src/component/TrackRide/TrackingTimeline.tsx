import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const stops = [
  { id: 1, label: 'Stop 1', address: 'Address', completed: true },
  { id: 2, label: 'Stop 2', address: 'Address', completed: true },
  { id: 3, label: 'Stop 3', address: 'Address', completed: false },
  { id: 4, label: 'Stop 4', address: 'Address', completed: false },
];

export default function TrackingTimeline() {
  return (
    <View style={styles.container}>
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;
        return (
          <View style={styles.stepWrapper} key={index}>
            <View style={styles.iconWrapper}>
              <View
                style={[
                  styles.circle,
                  stop.completed ? styles.completedCircle : styles.incompleteCircle,
                ]}
              >
                {stop.completed && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    stop.completed ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              )}
            </View>
            <Text style={styles.label}>{stop.label}</Text>
            <Text style={styles.address}>{stop.address}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
 
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  stepWrapper: {
    flex: 1,
    
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  completedCircle: {
    backgroundColor: '#3b5bfb',
  },
  incompleteCircle: {
    borderWidth: 2,
    borderColor: '#d19999',
    backgroundColor: '#fff',
  },
  line: {
    height: 3,
    flex: 1,
    borderRadius: 2,
    marginTop: -2,
  },
  lineActive: {
    backgroundColor: '#3b5bfb',
  },
  lineInactive: {
    backgroundColor: '#e0e0e0',
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginTop: 8,
  },
  address: {
    fontSize: 10,
    color: '#777',
  },
});
