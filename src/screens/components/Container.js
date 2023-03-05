import React, { useState, useRef, useEffect } from 'react';
import {
  Icon,
  Text,
  Layout,
  useTheme,
  TopNavigation,
  TopNavigationAction,
  Button,
} from '@ui-kitten/components';
import ScrollView from './ScrollView';
import { StatusBar, StyleSheet, TouchableOpacity, View, Dimensions, PanResponder, Modal, Animated } from 'react-native';
// import { ifIphoneX } from 'react-native-iphone-x-helper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import { Colors } from '../utils/theme';
import FastImage from 'react-native-fast-image';
const { height, width } = Dimensions.get('window');
import { Styles } from '../utils/config';
const ContainerComponent = ({
  children,
  withBar,
  withScroll,
  withHeader,
  mainScreen,
  withMarginIOS,
}) => {

  const HeaderIcon = data => {
    return (
      <TouchableOpacity onPress={data?.onPress}>
      { !data?.component ?  <Icon
          name={data?.name}
          pack={data?.type}
          solid={data?.solid}
          style={{
            tintColor: data?.color || theme['color-primary-500'],
            ...styles.icon,
            ...data?.style,
          }}
        /> : data?.component() }
      </TouchableOpacity>
    );
  };

  const HeaderTitle = (Title, id = null) => {
    if (typeof Title === 'string') {
    
        return (
          <View style={{flex:1, flexDirection:'row', alignItems:'flex-end' }} >
            <View style={{ flexDirection:'column', display:'flex', justifyContent:'center' }} >
            <Text
            category="h5"
            status="primary"
            numberOfLines={1}
            maxFontSizeMultiplier={1}
            style={{ marginRight: Title !== '' ? 10 : 0 }}>
            {Title}
          </Text>
            </View>
          </View>
        );
    }
  };

  const TopActionLeft = data => {
    return (
        <TouchableOpacity onPress={() => toggleOpen()} >
           
              {/* <View style={Styles.iconTab} >

              </View> */}

      </TouchableOpacity>
    );
  };
  const TopAction = data => {
    if (data !== undefined ) {
      if(data.isHoppiLogo == undefined){
        return (
          <TopNavigationAction
            onPress={data?.onPress}
            icon={() => HeaderIcon(data)}
            
          />
        );
      } else {
        return (
            <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
                
                   <Text
                    category="h6"
                    status="primary"
                    numberOfLines={1}
                    style={{  }}>hoppi</Text>
            </View>
        )
      }

    }
    return undefined;
  };

  return (

    <SafeAreaView
      style={{
        flex: 1,
        // ...ifIphoneX(withMarginIOS && { marginBottom: -70 }),
        backgroundColor:  withBar?.colorBar || theme['color-basic-100'],
      }}
      onResponderGrant={drawerOpened ? toggleOpen : undefined}
      onStartShouldSetResponder={drawerOpened ? toggleOpen : undefined}
    >
      {withBar && (
        <StatusBar
          backgroundColor={withBar?.colorBar || theme['color-basic-100']}
          barStyle={`${withBar?.themeBar || 'dark'}-content`}
          hidden={storie_status}
          animated={true}
        />
      )}


        <Layout style={{ flex: 1, zIndex: 1000, opacity:drawerOpened ? .5 : 1 }}>
        {withScroll ? <ScrollView  >{children}</ScrollView> : children}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTablet : {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    width:70,
    height:25,
    borderRadius:25,
  },
  textTeams : {
    color: Colors.white, width:44.5, fontSize: 17.5, 
  },
  textDate: {
    color: Colors.white, width:35, fontSize: 17.5,
  },
  icon: {
    height: 30,
    width: 30,
  },
  parentChooseMode: {
    borderRadius:10, 
    height:150,
    padding:5,  
  },
  subText: {
    fontSize:17,
    marginTop:5,
    // flex:1,
    lineHeight:22,
    marginRight:10,
    fontWeight:"700",
    color:'#69696c',
  },
  containerDrawer: {
    flex: 1,
    width:width*.9,
    backgroundColor: Colors.white,
    height:height*.87,
    position:'absolute',
    borderBottomEndRadius:20,
    borderTopEndRadius:20
  }
});

export default ContainerComponent;
