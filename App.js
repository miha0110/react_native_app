import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import LoginScreen from './screens/Login';
import ApproveInfoScreen from './screens/ApproveInfo';
import TabProfile from './screens/TabProfile';
import TabData from './screens/TabData';
import TabPlan from './screens/TabPlan';
import TabAlternative from './screens/TabAlternative';
import TabSideEffects from './screens/TabSideEffects';
import shareEffects  from "./screens/shareEffects";
import TakenMed  from "./screens/TakenMed";
import TabAwaitingSurgery  from "./screens/TabAwaitingSurgery";
import takeMedNow from "./screens/takeMedNow";


// Register Screens
Navigation.registerComponent("mobileApp.LoginScreen", () => LoginScreen);
Navigation.registerComponent("mobileApp.ApproveInfoScreen", () => ApproveInfoScreen);
Navigation.registerComponent("mobileApp.TabSideEffects", () => TabSideEffects);
Navigation.registerComponent("mobileApp.TabData", () => TabData);
Navigation.registerComponent("mobileApp.TabPlan", () => TabPlan);
Navigation.registerComponent("mobileApp.TabAlternative", () => TabAlternative);
Navigation.registerComponent("mobileApp.TabProfile", () => TabProfile);
Navigation.registerComponent("mobileApp.shareEffects", () => shareEffects);
Navigation.registerComponent("mobileApp.TakenMed", () => TakenMed);
Navigation.registerComponent("mobileApp.TabAwaitingSurgery", () => TabAwaitingSurgery);
Navigation.registerComponent("mobileApp.takeMedNow", () => takeMedNow);



Navigation.startSingleScreenApp({
  screen: {
    screen: "mobileApp.LoginScreen"
  }
});
