import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Button, Image, Picker} from 'react-native'
import CircleSlider from './CircleSlider';
import DrugGraph from './DrugGraph';
import startTabs from '../screens/startMainTabs';
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';

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

class takeMedNow extends Component {

  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
   
    this.state = {

        medsArray: [],
        medsArrayReturn:[],

        listDataFromChild: null,
        backgroundColor1: '#085d87',
        backgroundColor2: '#27c7bb',
       
        
        showMainForm: "",
        showButtonsForm: "",
        monthStr: "",
        day: "", 
      
        timeTaken: "",
       
        
    };
  };

  componentDidMount(){
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
  }

  componentWillMount(){

    

    let medsTotakeObjArray= [];
    let medsArray = [];
    let medsArrayReturn =[]; 

    RNSecureKeyStore.get("user")
      .then((res) =>{
        this.setState({username: res});   
        
      }) 
      .catch(err => {
        console.log(err);     
      })

    RNSecureKeyStore.get("medsTotake")
    .then((res) =>{    
      medsTotakeObjArray = JSON.parse(res)   
      medsTotakeObjArray.map((item)=>{
      
        temp =  Object.assign({ MedicationName: item.DrugName}, item)
        medsArrayReturn.push(temp)
        medsArray.push(item.DrugName + " " + item.Dosage + " " + item.Form);
      })
      this.setState({medsArray: medsArray})
      this.setState({medsArrayReturn: medsArrayReturn})
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

  onSubmitPress = async() => {
    //ClientLocalDate
    
    ClientLocalDate =new Date()
    //MedicationTakenTime
    tempTime = this.state.timeTaken
    MedicationTakenTime = new Date()
    MedicationTakenTime.setHours(tempTime.substring(0,2))
    MedicationTakenTime.setMinutes(tempTime.substring(3))

    let tempArr = this.state.medsArrayReturn
    let objArr = []
    await tempArr.map((item)=>{
      temp =  Object.assign({
        PainLevel: this.state.painLevel,
        MedicationTakenTime:MedicationTakenTime.toIsoString(false), 
        ClientLocalDate: ClientLocalDate.toIsoString(false)
      }, item)
      objArr.push(temp)
    })

    RNSecureKeyStore.set("lastMedTakenT", new Date().toString(), {accessible: ACCESSIBLE.ALWAYS})
    .catch((err) => {
      console.log(err);
    });
    
    RNSecureKeyStore.get("key1")
    .then(async(res) => {
      await fetch("http://52.19.205.95:80/api/patients/profile/report/" + this.state.username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': res,
        },
        body:JSON.stringify(
          objArr
        )
      })
      .catch(err => {
        console.log(err);     
      })

    })
    
    startTabs();
  }

  dontTake=()=>{
    startTabs();
  }

 

  onTakenPress = () => {
    this.setState({showMainForm: 1});
    this.setState({showButtonsForm: 1});

    
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

    if (this.state.showMainForm === 1) {
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

    
    } else if (this.state.showMainForm === 0) {
       mainForm = (

         <View style={{paddingLeft: 20, paddingRight: 20}}>

         <View style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 15}}>
          <Text style={{color: 'white', fontSize: 24}}>{strings('TabPlan.please_take')}</Text>
          </View>

          <View style={{height: 200, backgroundColor: 'white', marginTop: 6, borderTopLeftRadius: 25, borderBottomRightRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
            <View >{this.state.medsArray.map((item, key)=>{
              return (<Text key = {key} style={{color: 'black', fontSize: 24, fontWeight: 'bold'}}>{item}</Text>)
            })}</View>
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


    if (this.state.showButtonsForm === 1) {
       buttonsForm = (
        <View style={{alignItems: 'center'}}>

         <TouchableOpacity
            style={styles.submitButtonStyle}
            onPress={this.onSubmitPress}>
            <View
            style={styles.submitButtonStyle2}>
              <Image
              source={require('../images/00CheckGrey.png')}/>
              <Text style={{color: 'black'}}>{strings('TabPlan.submit')}</Text>
            </View>
         </TouchableOpacity>

         </View>
       );
    }
   
    else if(this.state.showButtonsForm === 0){
      buttonsForm = (
        <View>

        {/* <View style={{alignItems: 'center'}} > */}
        <View style={[styles.submitButtonContainerStyle]} >
     

      

      <TouchableOpacity
         style={[styles.submitButtonStyle]}
         onPress={this.dontTake}>
         <View
         style={styles.needButtonStyle2}>
           <Image
           source={require('../images/00CheckGrey.png')}/>
           <View
           style={modalStyles.submitButtonStyle}>
           <Text style={{fontWeight: 'bold', color:'black'}}>{strings('TabPlan.notTakenaken')}</Text>
          </View>
         </View>
      </TouchableOpacity>

      <TouchableOpacity
         style={[styles.submitButtonStyle]}
         onPress={this.onTakenPress}>
         <View
         style={styles.needButtonStyle2}>
           <Image
           source={require('../images/00CheckGrey.png')}/>
           <View
           style={modalStyles.submitButtonStyle}>
           <Text style={{fontWeight: 'bold', color:'black'}}>{strings('TabPlan.taken')}</Text>
           <Text style={{fontSize: 12, fontWeight: 'bold', color:'black'}}>{strings('TabPlan.medication')}</Text>
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


         </View>
      </LinearGradient>

       );
  }
}

export default takeMedNow

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
 
 
  takenButtonStyle3: {
    paddingRight: 15,
    paddingLeft: 15,
    alignItems: 'center'
}
})

