import React from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { API, ROUTES } from '../../api';
import messaging from '@react-native-firebase/messaging';
import { CacheUtil } from '../../utils/cache';

const GoogleButtonSignIn = ({navigation}) => {
   const SignIn =  () => {
    GoogleSignin.configure({
      androidClientId: '824415998653-m1kb99hn079jeol8rkrllu3qh8ilrep9.apps.googleusercontent.com', // if you want to access Google API on behalf of the user FROM YOUR SERVER
      webClientId: '824415998653-37cap6qutg25724p40bunt567hrvj0cp.apps.googleusercontent.com'
    });
      return new Promise(async(resolve,reject) =>{
        try {
          await GoogleSignin.hasPlayServices();
          const userGoogle = await GoogleSignin.signIn();
          const userInfo = userGoogle.user;
          let token = await messaging().getToken();
          console.log("datos de usuario", userInfo );
          let user = {
            idUser: userInfo.id,
            name: userInfo.name,
            token: userGoogle.idToken,
            tokenFirebase: token,
            imageRef: userInfo.photo,
            availability: false,
            platformInfo: {},
            role: "caller",
            schedule:[]
          };
          (await API())
          .post(ROUTES.LOGIN, JSON.stringify(user))
          .then( async response => {
            if(response.data.success){
              await CacheUtil.setUser(user);
              await CacheUtil.setToken(user.token);

              navigation.navigate("Home")
            }
          })
          .catch( error =>{
            console.log(error);
            LogOut()
          })

          resolve(userInfo)
        } catch (error) {
          console.log("error antes de api",error);
            switch(statusCodes) {
                case statusCodes.SIGN_IN_CANCELLED:
                    break;
                case statusCodes.IN_PROGRESS:
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    break;
            }
        }
      })
  
    };
  
    const LogOut = () => {
      return new Promise(async(resolve,reject) => {
        try {
          await  GoogleSignin.signOut();
          resolve({isLogouted:true})
        } catch (error) {
          reject(error)
        }
  
      })
    }
  return(
<GoogleSigninButton
  style={{ width: 192, height: 48 }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={SignIn}
  // disabled={this.state.isSigninInProgress}
/>
  )
}

export default GoogleButtonSignIn;



 