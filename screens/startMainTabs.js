import { Navigation } from 'react-native-navigation';

const startTabs = () => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        screen: "mobileApp.TabSideEffects",
        label: "Side effects",
        title: "SIDE EFFECTS",
        icon: require('../images/00_side-effects-white3x.png')
      },
      {
        screen: "mobileApp.TabData",
        label: "Data",
        title: "DATA",
        icon: require('../images/00_data-white3x.png')
      },
      {
        screen: "mobileApp.TabPlan",
        title: "PLAN",
        label: "Plan",
        icon: require('../images/00_plan-white3x.png')
      },
      {
        screen: "mobileApp.TabAlternative",
        label: "Alternative",
        title: "ALTERNATIVE",
        icon: require('../images/00_alternative-white3x.png')
      },
      {
        screen: "mobileApp.TabProfile",
        label: "Profile",
        title: "PROFILE",
        icon: require('../images/00_profile-white3x.png')
      }
    ],
    appStyle: {
      forceTitlesDisplay: true,
      initialTabIndex: 2,
      tabBarButtonColor: '#5A8CA0', // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle
      tabBarSelectedButtonColor: '#ffffff', // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
      tabBarBackgroundColor: '#206482', // optional, change the background color of the tab bar
    },
  
    
    
  }
  );
};

export default startTabs;




