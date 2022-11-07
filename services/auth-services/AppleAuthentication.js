import React from 'react';
import { Text, View } from 'react-native';



const componentName = ({
    params,
}) => {

    const SignIn = () =>{
        return new Promise(async(resolve,reject)=>{
            try {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                  });
                  resolve(appleAuthRequestResponse)
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
       
    }
    const LogOut = () => {
        return new Promise(async(resolve,reject) => {
          try {
            // await  GoogleSignin.signOut();
            resolve({isLogouted:true})
          } catch (error) {
            reject(error)
          }
    
        })
      }

    return(
      <></>
      //   <AppleButton
      //   buttonStyle={AppleButton.Style.WHITE}
      //   buttonType={AppleButton.Type.SIGN_IN}
      //   style={{
      //     width: 160,
      //     height: 45,
      //   }}
      //   onPress={() => SignIn()}
      // />
    )
}

export default componentName;
