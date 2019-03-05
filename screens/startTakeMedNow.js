
import { Navigation } from 'react-native-navigation';

const startTakeMedNow = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "mobileApp.takeMedNow"
    }
  });
};

export default startTakeMedNow;