// import RNTwitterSignIn from '@react-native-twitter-signin/twitter-signin';

const Constants = {
    //Dev Parse keys
    TWITTER_COMSUMER_KEY: 'qWPj1TXbreMX1SsDvdiQTaF7Y',
    TWITTER_CONSUMER_SECRET: '4t0cRfGWXZvySIa5sS0M38AnT8a8B8hwcX2lZiaStSWStD4B4Z',
  };
  
const SignIn = () =>{
    return new Promise((resolve,reject) => {
        // RNTwitterSignIn.init(
        //     Constants.TWITTER_COMSUMER_KEY,
        //     Constants.TWITTER_CONSUMER_SECRET,
        //   );
        //   RNTwitterSignIn.logIn()
        //   .then(loginData => {
        //     console.log(loginData);
        //     const {authToken, authTokenSecret} = loginData;
        //     if (authToken && authTokenSecret) {
        //       this.setState({
        //         isLoggedIn: true,
        //       });
        //     }
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
    })
}

const LogOut = () => {
// RNTwitterSignIn.logOut();

}