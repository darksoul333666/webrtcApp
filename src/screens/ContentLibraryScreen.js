import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { Container } from './components';
import { Background1 } from '../assets/images/backgrounds';
import { Text, Input, Card, Layout, Button } from '@ui-kitten/components';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';
import { faPlane } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import color from '../../utils/theme/colors';
import { TouchableOpacity } from 'react-native';
import  Styles  from '../../utils/theme/Styles';
const { height, width } = Dimensions.get('window');
const ContentLibrary = () => {

  const CardComponent = () => (
       <Layout style={{backgroundColor:'white',width:"100%", marginBottom:20, height:width*.45, 
       borderRadius:25, flexDirection:'row'}} >
        <View style={{  width:"50%",  height:"100%" }} >
          <Image
          source={{uri:"https://fastly.picsum.photos/id/817/200/200.jpg?hmac=c7RMfV0IboK5oZwkIxQ9Ofx8Bml5x-j42i9DKdKrTwo"}}
         style={{flex:1,
          borderBottomLeftRadius:25,
          borderTopLeftRadius:25
        }}
         />
         

        </View>
        <View style={{  width:"50%", flexDirection:'column',  height:"100%" }} >
         <View style={[ styles.borderTopRigth]} >
          <Text category='s1' style={{color:color.primaryColor}} >Miedo y ansiedad durante las relaciones sexuales</Text>
         </View>
         <View style={[ styles.borderBottomRigth ]} >

         <Button  status='basic'  > Ver artículo
            </Button>
         </View>

        </View>
      </Layout>
  )

    const arr = ['','','','','','','','','','','',''];
    return(
        <Container  image={Background1} >
    <View style={{width:"90%", height:"100%", alignSelf:'center', display:'flex'}} >
    <Text category='h3' style={{lineHeight:45}} >Biblioteca de contenidos</Text>
    <Input
      style={{ borderRadius:25}}
      placeholder='Buscar...'
      status='control'
      accessoryRight={() => (
        <View
        style={{backgroundColor:color.primaryColor, padding:4, borderRadius:25}}
        >
        <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{color:color.white}}
        />
        </View>
      )}
    />
    <Text category='s1' style={{}} >Temas favoritos</Text>
        <View style={{  flexDirection:'row'}} >
        <FlatList
        data={arr}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={() => ( 
          <TouchableOpacity style={[Styles.center,{  marginRight: 20}]} >
            <View style={[styles.containerButton, Styles.center]} >
            <FontAwesomeIcon size={25} icon={faPlane} style={{color:'white' }} />
            </View>
            <Text category='p2' >Mente</Text>
          </TouchableOpacity>
           )}
        />
        </View>
        <View style={{flex:1}} >
        <Text category='s1' >Lo más reciente</Text>
        <FlatList
        data={arr}
        showsVerticalScrollIndicator={false}
        renderItem={() =>
          <CardComponent>

          </CardComponent>
        }
        />
        </View>
    </View>
        </Container>
)};

const styles = StyleSheet.create({
  containerButton: {
    backgroundColor:color.primaryColor,  
    borderRadius:25, 
    width:40, 
    height:40,
  },
  borderTopRigth: {
    borderTopRightRadius:25,
    flex:6
  },
  borderBottomRigth: {
    borderBottomRightRadius:25,
    flex:4,
    justifyContent:'center', alignItems:'center', 
  }
})

export default ContentLibrary;
