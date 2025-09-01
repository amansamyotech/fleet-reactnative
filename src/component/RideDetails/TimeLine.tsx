import React, { useCallback, useState, useEffect } from "react";
import { TouchableOpacity, View, ActivityIndicator, Text, FlatList } from "react-native";
import TimelineItem from "./TimeLineItems";
import rideTimelineServices from "@/src/api/services/main/rideTimelineServices";
import { CheckpointData, UpdateLocationResponse } from "../dashboard/RideTypes";


interface TimeLineProps {
  bookingId?: string;
}

// Use the proper API service for updating checkpoint location
const updateLocation = async (checkpointId: number): Promise<UpdateLocationResponse> => {
  try {
    const response = await rideTimelineServices.updateCheckpointLocation(checkpointId);
    console.log(`Checkpoint ${checkpointId} marked as active:`, response);
    return { 
      success: response.success, 
      message: response.message
    };
  } catch (error: any) {
    console.error("Error updating checkpoint:", error);
    return { success: false, error: error.message || "Failed to update checkpoint" };
  }
};

const TimeLine: React.FC<TimeLineProps> = ({ bookingId }) => {
  const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCheckpoints, setActiveCheckpoints] = useState<number[]>([]);

  console.log("bookingId in timeline", bookingId);

  const fetchCheckpoints = useCallback(async (): Promise<void> => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await rideTimelineServices.getTodayCheckpoints(bookingId);
      
      console.log('Checkpoints response:', response);
      // Sort the checkpoints by order before setting them
      const sortedCheckpoints = response ? [...response].sort((a, b) => a.order - b.order) : [];
      setCheckpoints(sortedCheckpoints);
      
      // Identify already active checkpoints
      const activeIds = response
        .filter(checkpoint => checkpoint.isActive)
        .map(checkpoint => checkpoint.id);
      
      setActiveCheckpoints(activeIds);
      setError(null);
    } catch (err) {
      setError("Failed to fetch checkpoints");
      console.error("Error fetching checkpoints:", err);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchCheckpoints();
  }, [fetchCheckpoints]);

  const handleLocationSelect = async (checkpoint: CheckpointData) => {
    if (activeCheckpoints.includes(checkpoint.id)) {
      console.log("Checkpoint already active, no API call.");
      return;
    }

    try {
      console.log("---------->",typeof(checkpoint.id))
      // Here you would add the actual API call to update the checkpoint status
      const result = await updateLocation(checkpoint.id);
      
      if (result.success) {
        setActiveCheckpoints(prev => [...prev, checkpoint.id]);
        console.log("Checkpoint updated successfully");
      } else {
        console.error("Failed to update checkpoint");
      }
    } catch (error) {
      console.error("Error in handleLocationSelect:", error);
    }
  };

  const renderItem = ({ item, index }: { item: CheckpointData; index: number }) => (
    <TouchableOpacity onPress={() => handleLocationSelect(item)}>
      <TimelineItem
        title={item.cityName}
        address={item.locationUrl || ''}
        color={activeCheckpoints.includes(item.id) ? '#FF0000' : '#4e6ef2'}
        isLast={index === checkpoints.length - 1}
      />
    </TouchableOpacity>
  );

  const keyExtractor = (item: CheckpointData) => item.id.toString();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4e6ef2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (checkpoints.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No checkpoints found for this booking.</Text>
      </View>
    );
  }

  // const onRefresh = useCallback(() => {
  //   setLoading(true);
  //   fetchCheckpoints().finally(() => setLoading(false));
  // }, [fetchCheckpoints]);

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <FlatList
        data={checkpoints}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={loading}
        // onRefresh={onRefresh}
      />
    </View>
  );
};

export default TimeLine;