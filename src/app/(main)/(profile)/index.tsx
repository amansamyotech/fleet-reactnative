import LogoutButton from "@/src/component/Profile/LogoutButton";
import ProfileCard from "@/src/component/Profile/ProfileCard";
import SettingCard from "@/src/component/Profile/SettingCard";
import OuterContainer from "@/src/styles/OuterContainer";
import {  View } from "react-native";


const Profile = () => {
    return (
        <OuterContainer>
            <View style={{flex:1.4}}>
                <ProfileCard/>
            </View>
            <View style={{flex:2,
                
                }}>
                <SettingCard/>
                <LogoutButton/>
                </View>
            <View style={{flex:1,
                }}>      
                </View>
        </OuterContainer>
    );
};

export default Profile;
