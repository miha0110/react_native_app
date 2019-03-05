
import { Navigation } from 'react-native-navigation';

const startSurgery = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "mobileApp.TabAwaitingSurgery"
    }
  });
};

export default startSurgery;