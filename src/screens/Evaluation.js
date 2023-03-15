import React, {useState, useRef, useEffect} from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Container } from './components';
import { background2 } from '../assets/images/backgrounds';
import { Text } from './components';
import Video from 'react-native-fast-video';
import color from '../../utils/theme/colors';
import { Colors } from '../../utils/theme';
import { f } from '@fortawesome/pro-regular-svg-icons';
import { faShareNodes } from '@fortawesome/pro-solid-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
// import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const { height, width } = Dimensions.get('window');

const EvaluationScreen = ({
    params,
}) => {
    const [paused, setPaused] = useState(true);
    const ref = useRef(null);
    useEffect(()=> {
        console.log("ref?.current?.props?.paused", ref?.current?.props?.paused);
        setPaused(ref?.current?.props?.paused)
    },[ref])
    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'React Native | A framework for building native apps using React',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      }
    return (
        <Container image={background2} >
            <Text category='h4' style={{ marginTop: 20, fontSize: 28 }} >Evaluación</Text>
            <Text category='s1' style={{ marginTop: 5, fontSize: 14 }}  >Follow this instuction below </Text>
            <View style={{  height:"75%", marginTop:30 }} >
                <View style={{  height:width*.6, justifyContent:'center', alignItems:'center'}} >
              { paused &&  <TouchableOpacity 
                onPress={() => {setPaused(false)} }
                style={[styles.buttonNextPrev, {zIndex:10,  width:80, height:80, borderRadius:50}]} >
                    <FontAwesomeIcon size={40} style={{color:Colors.white, }} icon={faChevronRight} />
                    </TouchableOpacity> }
                <Video
                    ref={ref}
                    repeat={false}
                    paused={paused}
                    rate={1.0}
                    controls={true}
                    resizeMode={'cover'}
                    source={{ uri: "https://res.cloudinary.com/hoppi-app/video/upload/v1657806234/dev/hoppi/video/fteevz47ulncaczik1in.mov" }}
                    style={[StyleSheet.absoluteFill,{ flex:1, height:width*.6, borderTopLeftRadius: 25, borderTopRightRadius: 25 }]}
                />
                </View>
                <View style={{ backgroundColor: color.white, flex: 1, borderBottomRightRadius: 25, borderBottomLeftRadius: 25 }} >
                <Text  category={'s1'} style={{color:"#5B478C", textAlign:'center', fontWeight :"700", marginVertical:15  }} >Miedos y pensamientos</Text>
                <Text category={'p2'} style={{color:Colors.primaryColor, lineHeight:30, fontSize:26, width:"80%", marginHorizontal:"10%", textAlign:'center' }} >¿En la última semana te has sentido con mareos o náuseas?</Text>
                 <View style={{ flexDirection:'row',  marginBottom:20, alignItems:'center', flex:1, justifyContent:'center' }}>
                    <TouchableOpacity style={styles.buttonNextPrev} >
                    <FontAwesomeIcon size={20} style={{color:Colors.white}} icon={faChevronLeft} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAcceptDecline} >
                    <FontAwesomeIcon size={40} style={{color:Colors.white}} icon={faCheck} />
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.buttonAcceptDecline} >
                    <FontAwesomeIcon size={40} style={{color:Colors.white}} icon={faXmark} />
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.buttonNextPrev} >
                    <FontAwesomeIcon size={20} style={{color:Colors.white}} icon={faChevronRight} />
                    </TouchableOpacity> 
                 </View>
                 <View style={{ width:"90%", alignSelf:'center',  }} >
                    <View style={{backgroundColor:"#C5D4DC", width:"100%", borderRadius:25,  height: 10}} >
                    <View style={{backgroundColor:Colors.primaryColor, width:"80%", borderRadius:25,  height: 10}} >
                    </View>
                    </View>
                    <Text category='s2' style={{color:Colors.textGray, marginVertical:10, textAlign:'center'}} > 18 de 12</Text>
                 </View>
                </View>
            </View>
            <View style={{alignItems:'center', marginTop:30, width:"100%", flexDirection:'row', justifyContent:'flex-end'}} >
            <Text category={'s2'} >Compartir</Text>
            <TouchableOpacity onPress={onShare} style={{backgroundColor:Colors.white, marginHorizontal:5, width:30, height:30, alignItems:'center', justifyContent:'center', borderRadius:25}} >
            <FontAwesomeIcon style={{color:"#C5D4DC"}}  icon={faShareNodes} />
            </TouchableOpacity>
            </View>
        </Container>
    )
}
const styles = StyleSheet.create({
    buttonNextPrev: {
        width:width*.08, 
        borderRadius:25, 
        height:width*.08, 
        backgroundColor:Colors.primaryColor,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonAcceptDecline: {
        width:width*.15, 
        borderRadius:50, 
        height:width*.15, 
        backgroundColor:Colors.primaryColor ,
        marginHorizontal:10,
        alignItems:'center',
        justifyContent:'center'

    }
})
export default EvaluationScreen;
