
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Picker } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';
import DatePicker from 'react-native-datepicker'
import startTabs from '../screens/startMainTabs';
import PushNotification from 'react-native-push-notification'


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

class TakenMed extends Component {

  static navigatorStyle = {
    navBarHidden: true,       
  };

  constructor(props) {
      super(props);
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
      this.state={
        futureMeds: [],
        selectedMed:"",
        painFelt: 1,
        timeTaken: "00:00",

        medications: [],
         
          painLevel:[ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      };
  }

  onNavigatorEvent(event){
    if (event.id === 'bottomTabSelected') {
      this.props.navigator.popToRoot()
    }
    if (event.id === 'bottomTabReselected') {
      this.props.navigator.popToRoot()
    }
  }

   submit = async() =>{
    MedicationName = this.state.selectedMed.DrugName
    Dosage = this.state.selectedMed.Dosage
    Form = this.state.selectedMed.Form
    
    
    let temp = this.state.timeTaken
    let timeTakenMorph = new Date();
    await timeTakenMorph.setHours(temp.substring(0,2));
    await timeTakenMorph.setMinutes(temp.substring(3));
    await timeTakenMorph.setSeconds(0);
 
    console.log("taken time sent to server: " + timeTakenMorph)
    localTime = new Date()
    console.log("local time sent to server: " + localTime)
    RNSecureKeyStore.get("key1")
    .then((token) => {
     
      
      
     
      fetch("http://52.19.205.95:80/api/patients/profile/report/" + this.state.username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body:JSON.stringify([{
          "ClientLocalDate": localTime.toIsoString(false),
          "PainLevel": this.state.painFelt,
          "MedicationName": MedicationName,
          "Dosage": Dosage,
          "Form": Form,  
          "MedicationTakenTime": timeTakenMorph.toIsoString(false)
        }])
      })
      .catch(err => {
        console.log(err);     
      })

    })

    await this.updateNotification(token) 

    this.navBack()
  }
  
  navBack = () => {
    startTabs()
  }

  async updateNotification(token){
    await PushNotification.cancelAllLocalNotifications()
    date = new Date()
    fetch("http://52.19.205.95:80/api/patients/profile/todayfutureNotofication/" + this.state.username + "?time=" + date.toIsoString(true), {
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": token,
      }
    })
    .catch(err => { 
      console.log(err);
    })
    .then(res =>res.json())
    .then((parsedRes) =>{

      
      futuremeds = this.state.futureMeds

      futuremeds.map(item=>{
        let medTime = new Date();
        medTime.setHours(item.Time.substring(0,2))
        medTime.setMinutes(item.Time.substring(3))
  
        this.triggerNotif(medTime, 1000*60*60*24, item.Time, "2")
      })

      parsedRes.map(item=>{
        let medTime = new Date();
        medTime.setHours(item.Time.substring(0,2))
        medTime.setMinutes(item.Time.substring(3))
        medTime.setSeconds(0)
        this.triggerNotif(medTime, 0, item.Time, "1")
      })

        
    })

  }

  triggerNotif = (date, offset,id, i) => {
    if(i==1){
     PushNotification.localNotificationSchedule({
       /* iOS and Android properties */
       // title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
       message: "Time for a fixed medication",
       autoCancel: true,
       // repeatType: 'day',
       id: id.substring(0,2)+id.substring(3) + i,
       date: new Date(new Date(date).getTime() + offset) // in 60 secs
     });
     // console.log(new Date(new Date(date).getTime() + offset))
    }
    if(i==2){
     PushNotification.localNotificationSchedule({
       /* iOS and Android properties */
       // title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
       message: "Time for a fixed medication",
       autoCancel: true,
       repeatType: 'day',
       id: id.substring(0,2)+id.substring(3) + i,
       date: new Date(new Date(date).getTime() + offset) // in 60 secs
     });
     // console.log(new Date(new Date(date).getTime() + offset))
    }
   }

  componentWillMount(){
    
    var that = this;
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        startSingleScreenApp()
            },
      requestPermissions: true,
    })  

   

    RNSecureKeyStore.get("user")
    .then((res) =>{    
      this.setState({username: res});   
      
    }) 
    .catch(err => {
      console.log(err);     
    })
    
    // let date = new Date().getTime();
    RNSecureKeyStore.get("key1")
      .then((res) => {
    fetch("http://52.19.205.95:80/api/patients/profile/" + this.state.username, {
     
      headers: {
        'Content-Type': 'application/json',
        'Authorization': res,
      }
     
    })
    .catch(err => {
      console.log(err);     
    })
    .then(res =>res.json())
   
    .then(parsedRes =>{
      
      // const assignDate = new Date(parsedRes.Protocol.assign_time)

      daysInProtocol = Math.round((new Date() - new Date(parsedRes.Protocol.assign_time))/86400000 + 1 )
      daysInProtocolTomorrow = Math.round((new Date() - new Date(parsedRes.Protocol.assign_time))/86400000 + 2 )
      let med;
      const ddd=parsedRes.Protocol.Medications_by

      ddd.map(item=>{
        if(item.Phase_DayFrom <= daysInProtocol && item.Phase_DayUntil >= daysInProtocol){
          med =  item.Drug_By_Pain
        }

        if(item.Phase_DayFrom <= daysInProtocolTomorrow && item.Phase_DayUntil >= daysInProtocolTomorrow){
          medTomorrow =  item.Drugs_By_Time
        }
      })
      
     
      
      this.setState({medications: med});
      this.setState({selectedMed: med[0]});
      this.setState({futureMeds: medTomorrow})
      })
    
    }
      ).catch(err => {
        console.log(err);     
      })
  }
  componentDidMount(){
    let currTime = new Date()
    var takenTime = ""
    
    if(currTime.getHours() < 10){
      takenTime +="0";
    }
    takenTime += currTime.getHours() + ":"

    if(currTime.getMinutes() < 10){
      takenTime +="0";
    }
    takenTime +=currTime.getMinutes();

    this.setState({timeTaken:takenTime})
    // this.updateNotification() 
  }

    render (){
        return (

             <LinearGradient colors={["#085d87", "#27c7bb"]}
                style={{flex:1}}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}>

                <View style={modalStyles2.mainContainer}>

                    <View style={modalStyles2.navigationContainer}>

                        <TouchableOpacity onPress={this.navBack}>
                            <Image style={{width: 24, height: 24, alignItems: 'center'}} source={require('../images/back-white3x.png')}/>              
                        </TouchableOpacity>
                        <Text style={modalStyles2.text1}>{strings('TakenMed.title')}</Text>
                        <Text style={[{width: 24, height: 24, opacity : 0}]}></Text>
                    </View>
 
                <View style={modalStyles2.medicationContainer}>
                <Text style={modalStyles2.text2}>{strings('TakenMed.med_name')}</Text>
                <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6}}>
           
              <Picker
                selectedValue={this.state.selectedMed}
                onValueChange={(itemValue, itemIndex) => this.setState({selectedMed: itemValue})}
                style={{color: 'white'}}
                >
                {this.state.medications.map((item, key) => {
                 return <Picker.Item label={item.DrugName} value={item} key={key}/>
                })}
              </Picker>  

             
    
                      </View>
                      </View>

                      <View style={modalStyles2.painMainContainer}>

                      <View style={modalStyles2.painSubContainer1}>
                      <Text style={modalStyles2.text2}>{strings('TakenMed.pain_level')}</Text>
                      <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6}}>
                      <Picker
                          selectedValue={this.state.painFelt}
                          style={{color: 'white'}}
                          onValueChange={(itemValue, itemIndex) => [this.setState({painFelt: itemValue})]}>
                          {this.state.painLevel.map((item, index) => {
                          return (<Picker.Item label={item} value={item} key={index}/>) 
                          })}
                        </Picker>
                      </View>
                      </View>

                        <View style={modalStyles2.painSubContainer2}>
                        <Text style={modalStyles2.text2}>{strings('TakenMed.time')}</Text>
                        <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6,  alignItems: 'center'}}>
                        <DatePicker mode="time" androidMode="spinner" format="HH:mm" showIcon={false} 
                          date={this.state.timeTaken}
                            style={{flex: 1, flexDirection: 'column'}}
                            customStyles={{
                            dateIcon: {
                            width:0,
                            height:0,
                            },
                            dateInput: {
                              marginTop: 7,
                              borderWidth:0,
                              borderStyle: null,
                              height: 50,
                              flex:1, 
                              flexDirection: 'row'
                            },
                            dateText: {
                                  fontSize: 14,
                                  color: 'white'
                              }
                            }}
                            onDateChange={(date) => [this.setState({timeTaken: date})]}/>
                        </View>
                      </View>
                      </View>

                      <View style={modalStyles2.buttonContainer}>
                      <TouchableOpacity
                         style={modalStyles2.takenButtonStyle}
                         onPress={this.submit}>
                         <View
                         style={modalStyles2.takenButtonStyle2}>
                           <Image
                           source={require('../images/00CheckGrey.png')}/>
                           <View
                           style={modalStyles2.takenButtonStyle3}>
                           <Text style={{fontWeight: 'bold'}}>{strings('TakenMed.taken')}</Text>
                           <Text style={{fontSize: 12, fontWeight: 'bold'}}>{strings('TakenMed.medication')}</Text>
                          </View>
                         </View>
                      </TouchableOpacity>



                      </View>

                     </View> 
                      </LinearGradient>
                     ) 
    }
}

export default TakenMed;

const modalStyles2 = StyleSheet.create({
    modal: {
    backgroundColor: 'black',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20
    },
    navigationContainer: {
      flex: 0.1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    medicationContainer: {
      flex: 0.1,
      paddingTop: 20,
      paddingBottom: 50
    },
    painMainContainer: {
      flex: 0.1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    },
    painSubContainer1: {
      flex: 0.5,
      paddingRight: 5
    },
    painSubContainer2: {
      flex: 0.5,
      paddingLeft: 5
    },
    buttonContainer: {
      flex: 0.7,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text1: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text2: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    takenButtonStyle: {
      width: 150,
      height: 45,
      backgroundColor: 'rgba(255, 255, 255, 1.0)',
      borderRadius: 22.5,
      justifyContent: 'center'
  },
    takenButtonStyle2: {
      paddingRight: 35,
      paddingLeft: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
    takenButtonStyle3: {
      paddingRight: 15,
      paddingLeft: 15,
      alignItems: 'center'
  }
  })