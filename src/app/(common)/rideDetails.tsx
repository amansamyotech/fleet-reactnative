import CommonHeader from "@/src/component/Header/CommonHeader";
import MapComponent from "@/src/component/RideDetails/MapComponent";
import TimeLine from "@/src/component/RideDetails/TimeLine";
import OuterContainer from "@/src/styles/OuterContainer";
import { View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
const RideDetails = () => {
    const {booking, bookingId } = useLocalSearchParams();
    const bookingIdString = Array.isArray(bookingId) ? bookingId[0] : bookingId;
    const bookingData = booking ? JSON.parse(booking as string) : null;

    return (
        // <OuterContainer>
           <View style={{flex:1}}>
            <CommonHeader title="Ride Details"/>
            {/* <TimeLine bookingId={bookingIdString}/> */}
           {/* </View>
           <View style={{flex:1}}> */}
             <MapComponent bookingId={bookingIdString} booking={bookingData} />
           </View>
        // </OuterContainer>
    );
};

export default RideDetails;
