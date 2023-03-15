import React from 'react';
import { Container, ScrollView } from './components';
import { background3 } from '../assets/images/backgrounds';
// import { Text } from '@ui-kitten/components';
import { Text } from './components';
import Styles from '../../utils/theme/Styles';
import { TouchableOpacity, Dimensions, StyleSheet, View, FlatList } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Colors } from '../../utils/theme';
import { faPlane } from '@fortawesome/pro-solid-svg-icons';
import { faBusSimple } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import color from '../../utils/theme/colors';
const { height, width } = Dimensions.get('window');

const Therapy = ({}) => {

    const arr = [
    {icon:faPlane, title:'Individual'}, {icon:faBusSimple, title:'Pareja'}, {icon:faPlane, title:'Familiar'}, 
    {icon:faBusSimple, title:'Infantil'}, {icon:faPlane, title:'Empresas'}, {icon:faBusSimple, title:'Adolescentes'}];
    
    const ContainerTheme = ({item}) => (
        <View style={{alignItems:'center', marginVertical:25}} >
            <TouchableOpacity  >
                <View style={styles.buttonTheme }>
                <FontAwesomeIcon style={{color:color.white, transform:[{rotateZ:'-45deg'}] }} size={60} icon={item.icon} />
                </View>
                <View style={{alignItems:'center', marginTop:15}} >
                <Text category='s2' style={{fontWeight:"700"}} >{item.title}</Text>
                </View>
        </TouchableOpacity>
        </View>
        
    )
    
    return(
    <Container image={background3} >
        <Text  category='h4'
         style={[Styles.textHeader, {width:"60%" }]} >Terapia psicológica</Text>
            <ScrollView  >
            <View style={styles.containerButtons} >
            { arr.map(e => <ContainerTheme item={e} />)}
            </View>
            </ScrollView>
    </Container>
)}
const styles = StyleSheet.create({
    buttonTheme: {
        backgroundColor: Colors.primaryColor, 
        width:width*.30, 
        height:width*.30, 
        borderRadius:60,
        marginHorizontal:25,
        justifyContent:'center',
        alignItems:'center'
    },
    containerButtons: {
        flex:1, 
        flexWrap:'wrap', 
        flexDirection:'row', 
        justifyContent:'center',
        marginTop:40
    }
});

export default Therapy;
