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
    justifyContent: 'flex-start',
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: { 
    lineHeight: 35,  
    
    marginTop:20 }
  
});
