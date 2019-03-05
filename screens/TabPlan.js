import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Button, Image, Picker} from 'react-native'
import CircleSlider from './CircleSlider';
import DrugGraph from './DrugGraph';
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';
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

class TabPlan extends Component {

  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {

      //  isModalVisible: true,

        username:"",
        listDataFromChild: null,
        backgroundColor1: '#085d87',
        backgroundColor2: '#27c7bb',
        nameOfMedication: 'Choose',
        
        showMainForm: "",
        showButtonsForm: "",
        monthStr: "",
        day: "", 
      
        timeTaken: "",
        selectedMed:"",
        medications: [{DrugName: "No medication avaliable at this time", Dosage:"", Form:""}],
      
    };
  };

  onNavigatorEvent(event) {
    if (event.id === 'bottomTabSelected') {
      this.setState({showMainForm: 0});
      this.setState({showButtonsForm: 0});
    }
    if (event.id === 'bottomTabReselected') {
      this.setState({showMainForm: 0});
      this.setState({showButtonsForm: 0});
    }
  }

  toggleModal=()=>{
    this.setState({isModalVisible: false});
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
   
    this.setState({showMainForm: 0});
    this.setState({showButtonsForm: 0});

    let date = new Date();
    this.setState({day : date.getDate()});
    
    var month = date.getMonth() + 1;
    if (month===1) {
      var monthStr = "jan"
    } else if(month===2) {
      var monthStr = "feb"
    } else if(month===3) {
      var monthStr = "mar"
    } else if(month===4) {
      var monthStr = "apr"
    } else if(month===5) {
      var monthStr = "may"
    } else if(month===6) {
      var monthStr = "jun"
    } else if(month===7) {
      var monthStr = "jul"
    } else if(month===8) {
      var monthStr = "aug"
    } else if(month===9) {
      var monthStr = "sep"
    } else if(month===10) {
      var monthStr = "oct"
    } else if(month===11) {
      var monthStr = "nov"
    } else {
      var monthStr = "dec"
    } 
    this.setState({monthStr : monthStr});
  }

  
  takenMed = () =>{
    this.props.navigator.push({screen: 'mobileApp.TakenMed'});
  }

  onSubmitPress = () => {
    this.setState({showButtonsForm: 1});  

    let date = new Date()
    var takenTime = ""
    
    if(date.getHours() < 10){
      takenTime +="0";
    }
    takenTime += date.getHours() + ":"

    if(date.getMinutes() < 10){
      takenTime +="0";
    }
    takenTime +=date.getMinutes();

    this.setState({timeTaken:takenTime})

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
            "PainLevel": this.state.painLevel
          }])
        })
        .catch(err => {
          console.log(err);     
        })
      })
  }

  onDontNeedPress = () => {
    this.setState({showMainForm: 2});
    this.setState({showButtonsForm: 3});
    this.setState({medications: [{DrugName: "No medication avaliable at this time", Dosage:"", Form:""}]})
  }

  onNeedPress = () => {
    this.setState({showMainForm: 1});
    this.setState({showButtonsForm: 2});

    date = new Date().toISOString(false)
    

    RNSecureKeyStore.get("key1")
      .then((res) => {
    fetch("http:/52.19.205.95:80/api/patients/profile/take_med/" + this.state.username + "?time=" + date, {
     
      headers: {
        'Content-Type': 'application/json',
        'Authorization': res,
      }
     
    })
    .catch(err => {
      console.log(err);     
    })
    .then(res =>res.json())
   
    .then( (parsedRes) =>{
      let med = [];
        
        parsedRes.map( async (item)=>{
        if(item !== undefined){ 
          await med.push(item);
        }
      })
      if(med.length>0)
       this.setState({medications: med})
      
    })
    }
      ).catch(err => {
        console.log(err);     
      })
  }

  onTakenPress = () => {
    this.setState({showMainForm: 2});
    this.setState({showButtonsForm: 3});

    let temp = this.state.timeTaken
    let timeTakenMorph = new Date();
    timeTakenMorph.setHours(temp.substring(0,2));
    timeTakenMorph.setMinutes(temp.substring(3));
    timeTakenMorph.setSeconds(0);

    if(this.state.selectedMed !== ""){
    date = new Date()
    
    RNSecureKeyStore.get("key1")
    .then(async(token) => {
      await fetch("http:/52.19.205.95:80/api/patients/profile/report/" + this.state.username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body:JSON.stringify([{
          "ClientLocalDate": date.toIsoString(false),
          "MedicationName": this.state.selectedMed.DrugName,
          "Dosage": this.state.selectedMed.Dosage,
          "Form": this.state.selectedMed.Form,
          "MedicationTakenTime": timeTakenMorph.toIsoString(false)
        }])
      })
      .catch(err => { 
        console.log(err);     
      })

      await fetch("http://52.19.205.95:80/api/patients/profile/" + this.state.username, {
     
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
       
      })
      .catch(err => {
        console.log(err);     
      })
      .then(res =>res.json())
     
      .then(parsedRes =>{
        
        // const assignDate = new Date(parsedRes.Protocol.assign_time)
  
        daysInProtocolTomorrow = Math.round((new Date() - new Date(parsedRes.Protocol.assign_time))/86400000 + 2)
        const ddd=parsedRes.Protocol.Medications_by
  
        ddd.map(item=>{
          if(item.Phase_DayFrom <= daysInProtocolTomorrow && item.Phase_DayUntil >= daysInProtocolTomorrow){
            medTomorrow =  item.Drugs_By_Time
          }
        })
        this.updateNotification(medTomorrow, token)
        })  

    })
    .then(()=>{
      this.setState({medications: [{DrugName: "No medication avaliable at this time", Dosage:"", Form:""}]})
    })
  }
  
  }

  async updateNotification(futuremeds, token){
    await PushNotification.cancelAllLocalNotifications()
    date = new Date()

    futuremeds.map(item=>{
      let medTime = new Date();
      medTime.setHours(item.Time.substring(0,2))
      medTime.setMinutes(item.Time.substring(3))

      this.triggerNotif(medTime, 1000*60*60*24, item.Time, "2")
    })
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

      ddd = parsedRes

      ddd.map((item)=>{
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

  onReportPainPress = () => {
    startTabs()
  }

  bgColorCallback = (dataFromChild1, dataFromChild2, painLevel) => {
    this.setState({ backgroundColor1: dataFromChild1 });
    this.setState({ backgroundColor2: dataFromChild2 });
    this.setState({painLevel: painLevel});
  };


 


  render () {

    var circleForm;
    var mainForm;
    var buttonsForm;

    if (this.state.showMainForm === 0) {
       circleForm = (
         <CircleSlider
           value={210}
           callbackFromParent={this.bgColorCallback}
         />
       )
       mainForm = (
         <View>

         {circleForm}

         </View>
       );

    
    } else if (this.state.showMainForm === 1) {
       mainForm = (

         <View style={{paddingLeft: 20, paddingRight: 20}}>

         <View style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 15}}>
          <Text style={{color: 'white', fontSize: 24}}>{strings('TabPlan.please_take')}</Text>
          </View>

          <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6}}>
          <Picker
                selectedValue={this.state.selectedMed}
                onValueChange={(itemValue, itemIndex) => this.setState({selectedMed: itemValue})}
                style={{color: 'white'}}
                >
                {this.state.medications.map((item, key) => {
                 return <Picker.Item label={item.DrugName + " " + item.Dosage + " " + item.Form} value={item} key={key}/>
                })}
              </Picker>  
          </View>

         <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 25}}>
          <Text style={{color: 'white', fontSize: 14}}>{strings('TabPlan.taken_time')}</Text>


          <View style={{height: 50, width: 150, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 10}}>
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
       );
    }else if (this.state.showMainForm === 2) {
       mainForm = (
         <View style={{height: 50, paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'center'}}>

          <View style={{paddingBottom: 25, alignItems: 'center'}}>
          <Text style={styles.mainText}>{strings('TabPlan.shared_title')}</Text>
          <Text style={styles.text01}>{strings('TabPlan.shared_subtitle')}</Text>
          </View>

          <View style={{paddingBottom: 30, alignItems: 'center'}}>
          <Text style={styles.text02}>{strings('TabPlan.shared_p1')}</Text>
          <Text style={styles.text02}>{strings('TabPlan.shared_p2')}</Text>
          <Text style={styles.text02}>{strings('TabPlan.shared_p3')}</Text>
          </View>

          <TouchableOpacity
             style={styles.reportPainButtonStyle}
             onPress={this.onReportPainPress}>
             <View
             style={styles.reportPainButtonStyle2}>
               <Image
               source={require('../images/00_report_white3x.png')}
               style={{width: 20, height: 20}}/>
               <Text style={{ fontSize: 12, color: 'white'}}>{strings('TabPlan.report_pain')}</Text>
             </View>

          </TouchableOpacity>

         </View>
       );
    }


    if (this.state.showButtonsForm === 0) {
       buttonsForm = (
        <View style={{alignItems: 'center'}}>

         <TouchableOpacity
            style={styles.submitButtonStyle}
            onPress={this.onSubmitPress}>
            <View
            style={styles.submitButtonStyle2}>
              <Image
              source={require('../images/00CheckGrey.png')}/>
              <Text>{strings('TabPlan.submit')}</Text>
            </View>
         </TouchableOpacity>

         </View>
       );
    }
    else if(this.state.showButtonsForm === 1){
      buttonsForm = (
        <View>

        <View style={[styles.submitButtonContainerStyle]} >

      <TouchableOpacity
         style={styles.dontNeedButtonStyle}
         onPress={this.onDontNeedPress}>
         <View
         style={styles.dontNeedButtonStyle2}>
           <Image
           source={require('../images/00Close.png')}/>
           <View
           style={modalStyles.takenButtonStyle3}>
           <Text style={{ fontSize: 11, fontWeight: 'bold', color: 'white'}}>{strings('TabPlan.dont_need')}</Text>
           <Text style={{fontSize: 11, fontWeight: 'bold', color: 'white'}}>{strings('TabPlan.medication')}</Text>
         </View>
         </View>
      </TouchableOpacity>

      <TouchableOpacity
         style={styles.needButtonStyle}
         onPress={this.onNeedPress}>
         <View
         style={styles.needButtonStyle2}>
           <Image
           source={require('../images/00CheckGrey.png')}/>
           <View
           style={modalStyles.takenButtonStyle3}>
           <Text style={{fontSize: 11,fontWeight: 'bold'}}>{strings('TabPlan.need')}</Text>
           <Text style={{fontSize: 11, fontWeight: 'bold'}}>{strings('TabPlan.medication')}</Text>
          </View>
         </View>
      </TouchableOpacity>

      </View>

        </View>
      );
    }
    else if(this.state.showButtonsForm === 2){
      buttonsForm = (
        <View>

        <View style={[styles.submitButtonContainerStyle]} >

      <TouchableOpacity
         style={styles.dontNeedButtonStyle}
         onPress={this.onDontNeedPress}>
         <View
         style={styles.dontNeedButtonStyle2}>
           <Image
           source={require('../images/00Close.png')}/>
           <View
           style={modalStyles.takenButtonStyle3}>
           <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white'}}>{strings('TabPlan.dont_need')}</Text>
           <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white'}}>{strings('TabPlan.medication')}</Text>
         </View>
         </View>
      </TouchableOpacity>

      <TouchableOpacity
         style={styles.needButtonStyle}
         onPress={this.onTakenPress}>
         <View
         style={styles.needButtonStyle2}>
           <Image
           source={require('../images/00CheckGrey.png')}/>
           <View
           style={modalStyles.takenButtonStyle3}>
           <Text style={{fontWeight: 'bold'}}>{strings('TabPlan.taken')}</Text>
           <Text style={{fontSize: 12, fontWeight: 'bold'}}>{strings('TabPlan.medication')}</Text>
          </View>
         </View>
      </TouchableOpacity>

      </View>

        </View>
      );
    }
    else if(this.state.showButtonsForm === 3){
      buttonsForm = (
        <View style={{alignItems: 'center'}}>

        <Image
        style={{width: 200, height: 50, alignItems: 'center'}}
        source={require('../images/text_pop-up3x.png')}/>

        </View>
      );
    }


    return (



      <LinearGradient colors={[this.state.backgroundColor1, this.state.backgroundColor2]}
      style={{flex:1}}
         start={{ x: 0, y: 1 }}
         end={{ x: 1, y: 0 }}>



      <View style={[styles.topContainer]} >

                        

          <View style={[styles.aboveContainer]} >
          <Text style={styles.mainText}>{strings('shareEffect.' + this.state.monthStr)}  {this.state.day} </Text>
          

          <TouchableOpacity
             style={styles.medicationButtonStyle}
             
             onPress={this.takenMed}>
             <View style={styles.medicationButtonStyle2}>
               <Image source={require('../images/plusWhite.png')}/>
               <Text style={{ fontSize: 12, color: 'white'}}>{strings('TabPlan.taken_medication')}</Text>
             </View>

          </TouchableOpacity>

         </View>

         <View style={[styles.graphContainer]} >

         <DrugGraph/>

        </View>

         <View style={styles.mainContainer}>
         {mainForm}
        </View>

         <View style={[styles.bottomContainer]} >

         {buttonsForm}

            </View>



            <Modal isVisible={this.state.isModalVisible}>
              <View style={{ flex: 1, backgroundColor: '#216D93' }}>

              <View style={modalStyles.mainContainer}>

              <View style={modalStyles.navigationContainer}>

              <TouchableOpacity onPress={this.toggleModal}>
              <Image
              style={{width: 24, height: 24, alignItems: 'center'}}
              source={require('../images/00Close3x.png')}/>
              </TouchableOpacity>

              </View>

              <View style={modalStyles.mainTextContainer}>
              <Text style={modalStyles.text1}>{strings('modal.title1')}</Text>
              <Text style={modalStyles.text1}>{strings('modal.title2')}</Text>
              <Text style={modalStyles.text1}>{strings('modal.title3')}</Text>
              </View>


              <View style={modalStyles.subTextContainer}>
              <Text style={modalStyles.text2}>{strings('modal.subtitle1')}</Text>
              <Text style={modalStyles.text2}>{strings('modal.subtitle1')}</Text>
              </View>


              <View style={modalStyles.pickersContainer}>

              <View style={modalStyles.painSubContainer}>
              <Text style={modalStyles.text2}>08:00</Text>
              <View style={{height: 50, width: 150, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6}}>
              <Picker
                selectedValue={this.state.painLevel}
                style={{color: 'white'}}
                onValueChange={(itemValue, itemIndex) => this.setState({painLevel: itemValue})}>
                <Picker.Item label="Choose" value="Choose" />
                <Picker.Item label="0" value="0" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
                <Picker.Item label="10" value="10" />
              </Picker>
              </View>
              </View>

                <View style={modalStyles.painSubContainer}>
                <Text style={modalStyles.text2}>16:00</Text>
                <View style={{height: 50, width: 150, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6}}>
                <Picker
                  selectedValue={this.state.takenTime}
                  style={{color: 'white'}}
                  onValueChange={(itemValue, itemIndex) => this.setState({takenTime: itemValue})}>
                  <Picker.Item label="Choose" value="Choose" />
                  <Picker.Item label="0" value="0" />
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                  <Picker.Item label="7" value="7" />
                  <Picker.Item label="8" value="8" />
                  <Picker.Item label="9" value="9" />
                  <Picker.Item label="10" value="10" />
                </Picker>
                </View>
              </View>

              </View>

              <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                 style={modalStyles.takenButtonStyle}
                 onPress={this.toggleModal}>
                 <View
                 style={modalStyles.takenButtonStyle2}>
                   <Image
                   source={require('../images/00CheckGrey.png')}/>
                   <Text>{strings('modal.submit')}</Text>
                 </View>
              </TouchableOpacity>



              </View>

              </View>


              </View>
            </Modal>


         </View>
      </LinearGradient>

       );
  }
}

export default TabPlan

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  aboveContainer: {
    flex: 0.1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  graphContainer: {
    flex: 0.1,
    paddingBottom: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.0)'
  },
  mainContainer: {
    flex: 0.7,
    paddingTop: 1,
    paddingBottom: 1,
    justifyContent: 'center'
  },
  bottomContainer: {
    flex: 0.1,
    justifyContent: 'space-between',
    paddingTop: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 30,
    justifyContent: 'center'
  },
  mainText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
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
  buttonText: {
    fontSize: 19,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  submitButtonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButtonStyle: {
    width: 150,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 22.5,
    justifyContent: 'center'
  },
  submitButtonStyle2: {
    paddingRight: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dontNeedButtonStyle: {
    width: 150,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 22.5,
    justifyContent: 'center'
  },
  dontNeedButtonStyle2: {
    paddingRight: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
    needButtonStyle: {
    width: 150,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 22.5,
    justifyContent: 'center'
  },
  needButtonStyle2: {
    paddingRight: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  }
});

const modalStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  navigationContainer: {
    flex: 0.1,
    alignItems: 'flex-end'
  },
  mainTextContainer: {
    flex: 0.2,
    paddingTop: 15,
    paddingBottom: 40,
    alignItems: 'center'
  },
  subTextContainer: {
    flex: 0.1,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: 'center'
  },
  painSubContainer: {
    paddingTop: 10
  },
  pickersContainer: {
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1.0)'
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
