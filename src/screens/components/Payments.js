import React from 'react';
import { Text, View } from 'react-native';
import PaypalScreen from './payments/Paypal';
import WebComponent from './payments/WrapperMercado';
import StripeScreen from './payments/Stripe';
import { Button } from '@rneui/base';
const PaymentsScreen = ({navigation}) => 

   { 
   return(<View  >
        <Button title={'Stripe'} onPress={() => navigation.navigate("Stripe")  } />
        <Button title={'Mercado Pago'}  onPress={() => navigation.navigate("Mercado")  } />
        <Button title={'Paypal'}/>
    </View>

    )
}


export default PaymentsScreen;
