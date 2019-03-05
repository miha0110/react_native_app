import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';

import startTabs from '../screens/startMainTabs';
import { Navigation } from 'react-native-navigation';

Date.prototype.toIsoString = function(toURI = false) {
  var tzo = -this.getTimezoneOffset(),
      dif = tzo >= 0 ? toURI ? encodeURIComponent('+') : '+' : toURI ? encodeURIComponent('-') : '-',
      pad = function(num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };
  return this.getFullYear() +
      '-' + pad(this.getMonth() + 1) +
      '-' + pad(this.getDate()) +
      'T' + pad(this.getHours()) +
      ':' + pad(this.getMinutes()) +
      ':' + pad(this.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
};

class TabSideEffects extends Component {

  static navigatorStyle = {
    navBarHidden: true,
    
    
  };
 
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state={
    touched: false,
    sideEffects : [],
    checked: []
  }
  }

  onNavigatorEvent(event){
    if (event.id === 'bottomTabSelected') {
      this.props.navigator.popToRoot();


    }
    if (event.id === 'bottomTabReselected') {
      this.props.navigator.popToRoot()
    }
  }

  componentWillMount(){
    RNSecureKeyStore.get("user")
    .then((res) =>{    
      this.setState({username: res});   
      
    }) 
    .catch(err => {
      console.log(err);     
    })

    RNSecureKeyStore.get("key1")
    .then((res) => {
    //get global medical history questionnaire
    fetch("http://52.19.205.95:80/api/general/d_update", {
  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': res,
      }
      
    })
    .catch(err => {
      console.log(err);     
    })
    .then(res =>res.json())
    .then(parsedRes => {
      parsedRes.map((item)=>{
        if(item.Name === "Side_Effects"){
          this.setState({sideEffects: item.Val})
        }
      })
    })
  })
    
  }
  
  

  onSelect = (index, value, key)=>{
    let newArray = [...this.state.sideEffects];
    let updated = [...this.state.checked];

    if(index === 1){
      if(this.onList(updated, newArray[key])){
        updated.splice(this.positionOnList(updated, newArray[key]), 1);
      }
    }
    else{
      if(!this.onList(updated, newArray[key])){
        updated.push(newArray[key]);
      }
    }
    this.setState({checked: updated});  
    this.toggleChecked(updated);
  }

  positionOnList(list, item){
    for(let i = 0; i < list.length; i++){
      if(list[i] === item){
        return i;
      }
    }
  }

  onList(list, item){
    for( let i = 0; i < list.length; i++){
      if(list[i] === item){
        return true;
      }
    }
    return false;
  }

  toggleChecked = list =>{
    if(list.length === 0){
      this.setState({touched: false});
    }
    else{
      this.setState({touched: true});
    }
  }

  submit = () =>{
    const empty = [];
   /*  this.resetRadio(); */
    this.toggleChecked(empty); 

    this.props.navigator.push({screen: 'mobileApp.shareEffects'});

    
    date = new Date()
    
    
    RNSecureKeyStore.get("key1")
    .then((res) => {
      fetch("http://52.19.205.95:80/api/patients/profile/report/" + this.state.username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': res,
        },
        body:JSON.stringify([{
          "ClientLocalDate": date.toIsoString(false),
          "SideEffects": this.state.checked,
        }])
      })
      .catch(err => {
        console.log(err);     
      })
    })

   
  }

  

 
  

  render () {
    
    var pic;
    if (!this.state.touched) {
      pic = <Image source={require('../images/00CheckWhiteInactive.png')}/>
    }
    else{
      pic =  <Image source={require('../images/00CheckGrey.png')}/>
    }

    
     
   
    return (

      <LinearGradient colors={['#085d87', '#27c7bb']}
        style={{flex:1}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>

        <View style={styles.topContainer}>
        <View >

<View style={styles.aboveContainer}>
  <Text style={styles.text1}>{strings('sideEffects.title')}</Text>

  <TouchableOpacity style={this.state.touched ? styles.takenButtonStyle : styles.buttonDisabled } disabled={!this.state.touched} onPress={this.submit}>
    <View style={styles.takenButtonStyle2}>
      {pic}
      <Text style={this.state.touched ? styles.buttonEnabledText : styles.buttonDisabledText }>{strings('sideEffects.button')}</Text>
    </View>
  </TouchableOpacity>
</View>

<View style={styles.text1Container}>

  <Text style={styles.text1}>{strings('sideEffects.subtitle')}</Text>

</View>



<View style={styles.text2Container}>
<Text style={styles.text2}>{strings('sideEffects.warning')}</Text>

<Text style={styles.text2}> </Text>
<Text style={styles.text2}> </Text>
</View>

<ScrollView>

<View style={styles.MainContainer}>

{ this.state.sideEffects.map((item, key)=>(
<View key={key}>
  <Text  style={styles.text3} >{strings('sideEffects.' + item)}  </Text>

  <RadioGroup style={styles.radioButtonsContainer} 
      
      size={24}
      thickness={3}
      color='rgba(0, 0, 0, 0.15)'
      activeColor='#E0EFEF'
      selectedIndex={1}
      onSelect = {(index, value) => [this.onSelect(index, value, key)]}>
      
      <RadioButton value='Yes' color='#0E7191'>
        <Text style={styles.text2}>{strings('sideEffects.yes')} </Text>
      </RadioButton>

      <RadioButton value='No' color='#0E7191'>
        <Text style={styles.text2}>{strings('sideEffects.no')}</Text>
      </RadioButton>
  </RadioGroup>
      <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom:10}} /></View> 
)

)}

</View>

</ScrollView> 

</View>
        </View>
        
      </LinearGradient>
      )
  }
}

export default TabSideEffects;

const styles = StyleSheet.create({
  topContainer: {
    flex: 0.7,
    padding: 20,
  },
  aboveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text1Container: {
    paddingTop: 30
  },
  text2Container: {
    paddingTop: 15
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioButtonsStyle: {
    color: 'white'
  },
  text1: {
    color: 'white',
    fontSize: 24,
    
  },
  text2: {
    color: 'white',
    fontSize: 12,
    

  },
  graphContainer: {
    
    paddingBottom: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
  },

  unchecked:{
    color: '#3BC1BA',
    fontSize: 12,
  },
  text3: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  takenButtonStyle: {
    width: 97,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 20,
    justifyContent: 'center'
},
medicationButtonStyle: {
    
  height: 30,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: 30,
  justifyContent: 'center'
},
medicationButtonStyle2: {
  
  paddingRight: 12,
  paddingLeft: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
},
reportPainButtonStyle: {
  width: 150,
  height: 45,
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: 22.5,
  justifyContent: 'center'
},
reportPainButtonStyle2: {
  paddingRight: 25,
  paddingLeft: 15,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
},
text01: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  },
text02: {
  color: 'white',
  fontSize: 15,
  fontWeight: 'bold',
  },
  mainText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    },
  buttonDisabled:{
    width: 97,
    height: 30,
    backgroundColor: '#24ABA5',
    borderRadius: 20,
    justifyContent: 'center'
  },
  buttonDisabledText:{
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3BC1BA'
  },
  buttonEnabledText:{
    fontWeight: 'bold',
    fontSize: 12,
  },
  takenButtonStyle2: {
    paddingRight: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
}
})
