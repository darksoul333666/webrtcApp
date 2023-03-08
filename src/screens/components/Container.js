import React, { useState, useContext, useEffect } from 'react';
import {
  Layout,
  Text
} from '@ui-kitten/components';
// import ScrollView from './ScrollView';
import { StatusBar,ImageBackground, StyleSheet, View, Dimensions, PanResponder, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { height, width } = Dimensions.get('window');
import { Styles } from '../utils/config';
import { ThemeContext } from '../../../theme-context';
import { useTheme } from '@ui-kitten/components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBarsSort } from '@fortawesome/pro-solid-svg-icons';
import { Avatar } from 'react-native-elements';
import { CacheUtil } from '../../../utils/cache';
import { GoogleButtonSignIn } from '../../../services/auth-services';

const ContainerComponent = ({
  children,
  withBar,
  withScroll,
  imageComponent,
  image
}) => {
  const themeContext = useContext(ThemeContext);
  const theme = useTheme()
  const [user,setUser] = useState({});
  // const HeaderIcon = data => {
  //   return (
  //     <TouchableOpacity onPress={data?.onPress}>
  //     { !data?.component ?  <Icon
  //         name={data?.name}
  //         pack={data?.type}
  //         solid={data?.solid}
  //         style={{
  //           tintColor: data?.color || theme['color-primary-500'],
  //           ...styles.icon,
  //           ...data?.style,
  //         }}
  //       /> : data?.component() }
  //     </TouchableOpacity>
  //   );
  // };

  // const HeaderTitle = (Title, id = null) => {
  //   if (typeof Title === 'string') {
    
  //       return (
  //         <View style={{flex:1, flexDirection:'row', alignItems:'flex-end' }} >
  //           <View style={{ flexDirection:'column', display:'flex', justifyContent:'center' }} >
  //           <Text
  //           category="h5"
  //           status="primary"
  //           numberOfLines={1}
  //           maxFontSizeMultiplier={1}
  //           style={{ marginRight: Title !== '' ? 10 : 0 }}>
  //           {Title}
  //         </Text>
  //           </View>
  //         </View>
  //       );
  //   }
  // };

  // const TopActionLeft = data => {
  //   return (
  //       <TouchableOpacity onPress={() => toggleOpen()} >
           
  //             {/* <View style={Styles.iconTab} >

  //             </View> */}

  //     </TouchableOpacity>
  //   );
  // };
  // const TopAction = data => {
  //   if (data !== undefined ) {
  //     if(data.isHoppiLogo == undefined){
  //       return (
  //         <TopNavigationAction
  //           onPress={data?.onPress}
  //           icon={() => HeaderIcon(data)}
            
  //         />
  //       );
  //     } else {
  //       return (
  //           <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
                
  //                  <Text
  //                   category="h6"
  //                   status="primary"
  //                   numberOfLines={1}
  //                   style={{  }}>hoppi</Text>
  //           </View>
  //       )
  //     }

  //   }
  //   return undefined;
  // };

  useEffect(()=>{
    getData = async () => {
      setUser(await CacheUtil.getUser())
      console.log(await CacheUtil.getUser());
    };
    getData()
  },[])

  return (
    <ImageBackground source={image} style={{ flex: 1 }} resizeMode='cover' >

    <SafeAreaView
      style={{
        flex: 1,
        // ...ifIphoneX(withMarginIOS && { marginBottom: -70 }),
        // backgroundColor:  withBar?.colorBar || theme['color-basic-100'],
      }}
      // onResponderGrant={drawerOpened ? toggleOpen : undefined}
      // onStartShouldSetResponder={drawerOpened ? toggleOpen : undefined}
    >
      <View style={{width:width, display:'flex', flexDirection:'row'}} >
     <View style={ {flex:10, justifyContent:'center' }} >
     <FontAwesomeIcon icon={faBarsSort} size={30} style={{ marginLeft:10, color: 'white' }} />
     </View>
      <View style={{flexDirection:'row', justifyContent:'space-between', flex:8, alignItems:'center'}} >
        <Text numberOfLines={1} style={{width:"70%"}} >Hola, Jairo</Text>
        <Avatar
        rounded
          source={{uri: "https://scontent.fjal3-1.fna.fbcdn.net/v/t39.30808-6/310909154_1529289550839677_3792589022271603293_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=1623lSj-L-0AX9hcRXY&_nc_ht=scontent.fjal3-1.fna&oh=00_AfBntgF4odpFEzwBMWU7-lPPuErkVTduUiU8igDEMkO2QQ&oe=640B6B7E" }}
        />
      </View>
      </View>
        <View style={{ flex: 1,}}>
        {withScroll ? <ScrollView  >{children}</ScrollView> : children}
      </View>
    </SafeAreaView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
 
});

export default ContainerComponent;
