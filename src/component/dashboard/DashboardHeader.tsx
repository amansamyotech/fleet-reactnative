import React, {  useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import TextNormal from "@/src/styles/TextNormal";
import TextBold from "@/src/styles/TextBold";
import OuterContainer from "@/src/styles/OuterContainer";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { spacing } from "@/src/styles/Spacing";
import AddExpenseModal from "./AddExpensesModal";
import useLoginDataStorage from "@/src/hooks/customStorageHook";
import { useRouter } from "expo-router";

const DashboardHeader: React.FC = () => {

    const {loginData} = useLoginDataStorage()
    const [visible, setVisible] = useState(false);
    const router = useRouter()

    const handleNotification = ()=>{
      router.push('/(common)/Notifications')
    }
    return (
        <View style={styles.container}>
            <View style={styles.leftBox}>
                <View style={styles.imgContainer}>
                    <Image
                        source={require('../../assets/images/userImg.png')}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.nameContainer}>
                    <TextBold style={styles.nameText}>  Hii, {loginData?.name?.split(' ')[0]}</TextBold>
                </View>
            </View>
            <View style={styles.rightBox}>
            <TouchableOpacity style={{backgroundColor:"#32B55014",paddingVertical:hp(0.7),paddingHorizontal:hp(1),borderRadius:spacing.xxl,flexDirection:'row'}}
            onPress={() => setVisible(true)}>
                <TextNormal style={{marginRight:hp(0.7),marginTop:hp(0.3)}}>Add Expenses</TextNormal>
                <View style={{height:hp(3), width:hp(3),backgroundColor:"#32B5501F",borderRadius:hp(1.5),alignItems:'center',justifyContent:'center'}}>
                    <MaterialIcons name="add" size={20} color="#32B550"   />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingLeft:spacing.sm}} onPress={handleNotification}>
                <MaterialIcons name="notifications-none" size={27} color="black" style={styles.notiIcon} />
                </TouchableOpacity>
            </View>
            <AddExpenseModal visible={visible} onClose={() => setVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.28,
        flexDirection: 'row',
        paddingBottom: spacing.md,
    },
    leftBox: { 
        flex: 2, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    imgContainer: {
        height: hp(4), 
        width: hp(4), 
        borderRadius: spacing.lg
    },
    img: {
        height: 35, 
        width: 35, 
        borderRadius: 20
    },
    nameContainer: {
        paddingHorizontal: spacing.sm
    },
    nameText: {
        fontSize: hp(1.9)
    },
    rightBox: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    notiIcon: {
        paddingRight: spacing.sm, 
        paddingTop: hp(0.4)
    }
})

export default DashboardHeader;
