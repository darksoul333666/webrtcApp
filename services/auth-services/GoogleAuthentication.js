import React from 'react';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleButtonSignIn = ({
    params,
}) => {
   const SignIn =  () => {
    GoogleSignin.configure({
      androidClientId: '824415998653-m1kb99hn079jeol8rkrllu3qh8ilrep9.apps.googleusercontent.com', // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
      return new Promise(async(resolve,reject) =>{
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log("datos de usuario", userInfo )
          resolve(userInfo)
        } catch (error) {
          console.log(error);
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



 