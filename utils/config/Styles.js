import { Colors } from '../theme';
import { StyleSheet, Platform, Dimensions } from 'react-native';

export default StyleSheet.create({
  imgResponsive: {
    flex: Platform.OS === 'ios' ? 1.29 : 1.02,
    width: '100%',
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  divisor: {
    marginLeft: -20,
    marginVertical: 5,
    width: Dimensions.get('window').width,
  },
  containerProfile: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  buttonLeftWhite: {
    height: 43,
    borderWidth: 2,
    paddingRight: 4,
    borderRightWidth: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 0,
    borderColor:Colors.blackOpacity
  },
  buttonPlusWhite: {
    height: 54,
    width:55,
    borderWidth: 4,
    paddingRight: 4,
    marginRight:- 2,
    borderRadius: 25,
    bottom:0

  },
  buttonRightWhite: {
    height: 43,
    paddingLeft: 4,
    borderWidth: 2,
    marginLeft: -2,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 25,
    borderColor:Colors.blackOpacity
  },
  buttonShare : {
    maxHeight:43, 
    paddingHorizontal: 27,
    height: 43,
    borderWidth: 2,
    borderRadius:25
  }
});
