import { Navigation } from 'react-native-navigation';

const startApproveInfoScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "mobileApp.ApproveInfoScreen"
    }
  });
};

export default startApproveInfoScreen;
