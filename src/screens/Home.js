import React, { useEffect, useContext } from 'react';
import { Linking, Image, TouchableOpacity, View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Apple from '../../services/auth-services/AppleAuthentication';
import { Button, Icon, Text } from '@ui-kitten/components';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';
import Video from 'react-native-fast-video';
import SoundPlayer from 'react-native-sound-player'
import database from '@react-native-firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { backgroundLogin } from '../assets/images/backgrounds';
import Styles from '../../utils/theme/Styles';
import { Container } from './components';
import { iconPrimary } from '../assets/images/logos';
const HomeScreen = ({ navigation }) => {
  return (
      <Container image={backgroundLogin} >
      <StatusBar
        barStyle={`light-content`}
        animated={true}
      />
      <SafeAreaView
        style={{
          flex: 1,
          // ...ifIphoneX(withMarginIOS && { marginBottom: -70 }),
        }}>
        <View style={[Styles.contentCenter]} >
          <View style={{width:"100%",  marginTop:20, justifyContent:'center', flexDirection:'row' }} >
          <Image source={iconPrimary} style={{width:35, marginRight:10, height:35}}  />
          <Text category='s2' style={{ fontSize:22, letterSpacing:2, textAlign: 'center' }} >DESANSIEDAD</Text>
          </View>
          <View style={[Styles.contentCenter, styles.containerButtons]} >
          <View style={styles.mainBanner}  >
            <Text category='h3' style={styles.textHelp} >¿Necesitas ayuda en este momento?</Text>
          </View>
            <Button onPress={() => navigation.navigate('RedButton')} status='basic' style={{ width: 200, margin: 15 }} >Sí, quiero apoyo
            </Button>
            <Button status='primary' style={{ borderRadius: 25, width: 200  }} >
              <Text category='s2'  >No, deseo continuar</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Container>

  );
}

const styles = StyleSheet.create({
  mainBanner: {
    width: "80%",
    // marginHorizontal: '15%',
    flexDirection: 'row',
    textAlign:'center'
  },
  containerButtons: {
    width: "100%",
    margin: "15%",
    justifyContent:'center',
  },
  textHelp: {
    textAlign:'center', 
    lineHeight:40, 
    marginBottom:10,
    flex:1 
  }
})

export default HomeScreen;
