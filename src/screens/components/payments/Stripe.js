import { CardField, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { Button, View, Text, Alert } from 'react-native';
import { URL_API, API } from '../../../../api';
 const  StripeScreen = () => {
  const {confirmPayment, loading} = useConfirmPayment()

  const handlePayPress = async() => {
    console.log("antes");
    try {
      // const response = await fetch( `${URL_API}users/create_intent`,
      // { method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      //       },
      //   body: JSON.stringify({
      //     paymentMethodPay: 'card',
      //     currency: 'usd'
      //   })
      // });
      console.log(URL_API+'users/create_intent');
      (await API()).
      post(URL_API+'user/create_intent', JSON.stringify({  paymentMethodPay: 'card', currency: 'usd'}))
      .then(async res => {
        console.log("despues");
        const {clientSecret} = await res.data.data;
        console.log("clientSecret", clientSecret);
  
        const {error, paymentIntent} = await confirmPayment(clientSecret.client_secret,
          {
            type:'Card',
            billingDetails:'Botón Rojo',
            paymentMethodType:'Card'
          });
          if(error) {
            Alert.alert(`Error code: ${error.code}`, error.message)
          } else if(paymentIntent) {
            Alert.alert('Success',`Pago exitoso ${paymentIntent.id}`, )
  
          }
      })
      .catch( error => {
              Alert.alert("axios", JSON.stringify(error));
          }
      )
    } catch (error) {
      console.log("error", error);
    }


  }
  return (
    <View>
 <CardField
      postalCodeEnabled={true}
      placeholders={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
      <Button title='Pagar' disabled={loading} onPress={() =>  {
        handlePayPress()
        console.log("daasdas");
        }} />
    </View>
   
  );
}
export default StripeScreen