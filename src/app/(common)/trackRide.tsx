import OuterContainer from "@/src/styles/OuterContainer";
import { StyleSheet, TouchableOpacity, View } from "react-native";


import { heightPercentageToDP as hp} from "react-native-responsive-screen";
import CommonHeader from "@/src/component/Header/CommonHeader";
import TrackMap from "@/src/component/TrackRide/TrackMap";
import TrackingTimeline from "@/src/component/TrackRide/TrackingTimeline";
import AdminContactCard from "@/src/component/TrackRide/AdminContactCard";
import TimeDistanceCard from "@/src/component/TrackRide/TimeDistanceCard";
import TextNormal from "@/src/styles/TextNormal";
import { spacing } from "@/src/styles/Spacing";

const TrackRide = () => {
    return (
        <OuterContainer>
           <View style={{flex:1.1}}>
            <CommonHeader title="Ride Details"/>
            <TrackMap/>
           </View>
           <View style={{flex:1}}>
            <View style={{flex:0.5,justifyContent:'center'}}>
            <TrackingTimeline/>     
                </View> 
            <View style={{flex:0.7}}>
                <AdminContactCard/>
                </View> 
            <View style={{flex:1}}>
                <TimeDistanceCard/>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
                <TouchableOpacity style={styles.button} >
          <TextNormal style={styles.buttonText}>Stop Ride</TextNormal>
        </TouchableOpacity>
                </View>
                </View> 
               
           </View>
        </OuterContainer>
    );
};

const styles = StyleSheet.create({
      button: {
        backgroundColor:"#DC4949",
        borderRadius: spacing.md,
        paddingHorizontal: hp(4),
        height: hp(4.8),
        justifyContent: "center",
        alignItems: "center",
      },
      buttonText: {
        color: "white",
        fontSize: spacing.lg,
      },
})

export default TrackRide;
