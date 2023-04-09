import React, { useState, useContext, useEffect } from 'react';
import {
  Layout,
  Text
} from '@ui-kitten/components';
import ScrollView from './ScrollView';
import { StatusBar, ImageBackground, StyleSheet, View, Dimensions, PanResponder, Modal, Animated, Image } from 'react-native';
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
  const [user, setUser] = useState({});

  useEffect(() => {
    const getData = async() => {
      setUser(await CacheUtil.getUser());
    }
    getData()
  },[])

  useEffect(() => {
    getData = async () => {
      setUser(await CacheUtil.getUser())
    };
    getData()
  }, [])

  return (
    <ImageBackground style={{ flex: 1 }} source={image} resizeMode={'cover'} >
        <StatusBar
        barStyle={`light-content`}
        animated={true}
      />
      <SafeAreaView
        style={{
          flex: 1,
          // ...ifIphoneX(withMarginIOS && { marginBottom: -70 }),
          // backgroundColor:  withBar?.colorBar || theme['color-basic-100'],
        }}>
        <View style={{ width: "90%",  display: 'flex', alignSelf: 'center', flexDirection: 'row' }} >
          <View style={{ flex: 1}} >
            <FontAwesomeIcon icon={faBarsSort} size={30} style={{color: 'white' }} />
          </View>
          <View style={{ flexDirection: 'row',   justifyContent: 'flex-end', flex: 8, alignItems: 'center' }} >
            <Text numberOfLines={1} category='s1'  style={{ fontWeight:"700", marginRight:5, maxWidth:"60%"}}  >Hola, {user.name} </Text>
            <Avatar
              rounded
              source={{ uri: user?.imageRef }}
            />
          </View>
        </View>
        <View style={{ flex: 1, width:width*.9, alignSelf:'center' }}>
          {withScroll ? <ScrollView  >{children}</ScrollView> : children}
          {/* <ScrollView  >{children}</ScrollView> */}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

});

export default ContainerComponent;
