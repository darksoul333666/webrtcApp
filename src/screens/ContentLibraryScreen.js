import React from 'react';
import { View } from 'react-native';
import { Container } from './components';
import { Background1 } from '../assets/images/backgrounds';
import { Text, Input } from '@ui-kitten/components';

const ContentLibrary = ({
    params,
}) => {
    return(

        <Container  image={Background1} >
        <Text category='h3' style={{}} >Biblioteca de contenidos</Text>

        <Input
      placeholder='Place your Text'
    //   value={value}
    //   onChangeText={nextValue => setValue(nextValue)}
    />

        </Container>
   
)}

export default ContentLibrary;
