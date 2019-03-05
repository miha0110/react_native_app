import { Navigation } from 'react-native-navigation';

const startSingleScreenApp = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "mobileApp.LoginScreen"
      }
    });
  }

export default startSingleScreenApp;