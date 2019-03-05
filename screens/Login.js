import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';
import startApproveInfoScreen from '../screens/startApproveInfoScreen';
import startTabs from '../screens/startMainTabs';
import startSurgery from '../screens/startSurgery';
import startTakeMedNow from '../screens/startTakeMedNow';
import LinearGradient from 'react-native-linear-gradient';
import { AsyncStorage } from "react-native";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';
import PushNotification from 'react-native-push-notification'
import startSingleScreenApp from '../screens/startSingleScreenApp';

const url="http://52.19.205.95:80/api/patients/"

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


class LoginScreen extends Component {
 

  

  componentWillMount(){
    var that = this;
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        startSingleScreenApp()
            },
      requestPermissions: true,
    })

    
  }

  

  componentDidMount(){
    console.log("in login page")
    this.getUser()
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
    fetch("http://52.19.205.95:80/api/patients/profile/todayfutureNotofication/" + this.state.user + "?time=" + date.toIsoString(true), {
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

      

      parsedRes.map((item)=>{
        let medTime = new Date();
        medTime.setHours(item.Time.substring(0,2))
        medTime.setMinutes(item.Time.substring(3))
        medTime.setSeconds(0)

        this.triggerNotif(medTime, 0, item.Time, "1")
      })

     
        
    })

  }

  getUser=async()=>{
    console.log("in get user")
     userExists = false
     tokenExists = false
     token = ""
    try {

          console.log("trying to get stored user")
          await  RNSecureKeyStore.get("user")
          .then(async(res)=>{
            userExists = true
            console.log(res)
            this.setState({user: res})
            console.log("trying to get stored token")
            await  RNSecureKeyStore.get("key1")
            .then(res=>{
              console.log(res)
              if(res.length>0){
                tokenExists = true
                token = res
                this.setState({token: res})
              }
            })
          })
    } catch (error) {
      console.log("no username/token stored")
    }

    if(userExists && tokenExists){

      this.loginRoute(token)
    }
    
  }

  constructor(props) {
    super(props);
    this.state = {
      lastMedTaken:"",
      pass: "",
      user: "",
      token:""
    };
    
  }
  
  static navigatorStyle = {
    navBarHidden: true,
    drawUnderTabBar: false
  };

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

  loginRoute =async(token)=>{
    const today = new Date();
    console.log("in route select")

    fetch( url + "profile/" + this.state.user, {
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
    .then(async(parsedRes) =>{
      
      if(parsedRes.Approved_Info === false){
        startApproveInfoScreen(); 
      }
      else if(new Date(parsedRes.Surgery_Date) <= today){
        daysInProtocol = Math.round((new Date() - new Date(parsedRes.Protocol.assign_time))/86400000 + 2 )//tomorrow
        let med;
        const ddd=parsedRes.Protocol.Medications_by
  
        await ddd.map(item=>{
          if(item.Phase_DayFrom <= daysInProtocol && item.Phase_DayUntil >= daysInProtocol){
            med =  item.Drugs_By_Time
          }
        })
        

        this.updateNotification(med, token)
        needToTakeMed = await this.medNow(token)
        Promise.all([needToTakeMed]).then(()=>{
        
        if(needToTakeMed ){
          startTakeMedNow();
        }
        else{
          startTabs();
        }
      })
        

      }
      else if(new Date(parsedRes.Surgery_Date) > today){
        startSurgery();
      }
    })
  }

   loginHandler = async() =>{
    
    

    fetch(url + "signin", {
     method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, 
      body:JSON.stringify({
        "Username": this.state.user,
        "Password": this.state.pass,       
      })
     
    })
    .catch(err => {
      console.log(err);
      alert("Authentication failed for unknown reason, please try again!");
     
    })
    .then(res => {
      if(res.status === 401){
        alert("User name is invalid. Please check for spelling mistake or contact your doctor");
      }
      else{
        res.json()
        .then(parsedRes => {
          if(parsedRes.token){
            this.loginRoute(parsedRes.token)
            RNSecureKeyStore.set("key1", parsedRes.token, {accessible: ACCESSIBLE.ALWAYS})
            .catch((err) => {
              console.log(err);
            });
            RNSecureKeyStore.set("user", this.state.user, {accessible: ACCESSIBLE.ALWAYS})
            .catch((err) => {
              console.log(err);
            });     
          }
              
        })
          
        } 
       }
      ) 
  };

   
  async medNow(token){

    date = new Date()
    await PushNotification.cancelAllLocalNotifications()
    let nextMeds = [];
      
    
   
   await fetch("http://52.19.205.95:80/api/patients/profile/todayPastFixNotofication/" + this.state.user + "?time=" + date.toIsoString(true), {
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
      if(!parsedRes.error){
        nextMeds =  parsedRes
        console.log("need to take " + nextMeds.length + " meds")
      }
      
        
    })
    .catch(err => { 
      console.log(err);
    })
      RNSecureKeyStore.set("medsTotake",JSON.stringify(nextMeds), {accessible: ACCESSIBLE.ALWAYS})
      .catch((err) => {
      console.log(err); 
    })
    
   
    
    
    
    return nextMeds.length !== 0      
  }

  

  render () {
    
    return(

      <LinearGradient colors={["#085d87", "#27c7bb"]}
      style={{flex:1}}
         start={{ x: 0, y: 1 }}
         end={{ x: 1, y: 0 }}>
      <View style={styles.mainContainer}>

        <View style={styles.subContainer}>
          <Text style={[styles.text2,{paddingBottom:31}]}>{strings('login.welcome')}</Text>
          <Image
          source={require('../images/logo.png')}/>
        </View>
        
        

        <View >
          <Text style={styles.text5}>{strings('login.username')}</Text>

          <TextInput
            style={[styles.inputBox, {marginBottom: 27}]}
            onChangeText={(text) => this.setState({user:text})}
            value={this.state.user}
            placeholder={strings('login.username')}
          />
        </View>

        <View>
          <Text style={styles.text5}>{strings('login.password')}</Text>
         
          <TextInput  
            style={[styles.inputBox,{marginBottom:12}]}
            onChangeText={(text) => this.setState({pass:text})}
            placeholder={strings('login.password')}
            value={this.state.pass}
            secureTextEntry
          />
        </View>
        
        <View>
          <Text style={[styles.text4,{marginBottom:38}]}>
          {strings('login.enter_credentials')}
          </Text>
        </View>
        
        <View >
            <TouchableOpacity style={[styles.button,{marginBottom:24}]}
                 /* disabled={true}  */
               onPress={this.loginHandler}>
               <View style={{alignItems:'center', marginTop:12}}>
                 <Text style={{color:'black', fontWeight:'bold'}}>{strings('login.login_button')}</Text>
               </View>
            </TouchableOpacity>
        </View >

        <View >
        
        <Text style={[styles.text4]}>{strings('login.usage_terms_line1')}</Text>
        </View>
        <View >
       <Text style={styles.text4}>{strings('login.usage_terms_line2')}</Text>
        </View> 
        <View>
          <Text style={styles.text3}>Version 0.7</Text>
        </View>
        </View>
  
      </LinearGradient>
    );
  }
}

 
export default LoginScreen;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center', 
    marginTop: 100,
  },
  subContainer: { 
    alignItems: 'center', 
    paddingTop: 29,
    paddingBottom:19,
  },
  inputBox:{
    width:320,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  button:{
    width:150,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 255)',
    borderRadius:22.5,
     
  },

  text1: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  text2: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text3: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text4: {
    paddingLeft: 5,
    alignItems: 'center', 
    color: 'white',
    fontSize: 12,
    opacity: 0.5,
  },
  text5:{
    fontSize: 12,
    paddingBottom: 10,
    color: 'white',
  }
})


