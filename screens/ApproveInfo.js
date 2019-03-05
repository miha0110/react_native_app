import React, { Component } from 'react'
import image from '../images/menu_burger.png';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Picker,activeOpacity, ScrollView} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import DatePicker from 'react-native-datepicker'
import { KeyboardAvoidingView } from 'react-native';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';
import startTabs from '../screens/startMainTabs';

class ApproveInfoScreen extends Component {

  static navigatorStyle = {
    navBarHidden: true,
  };

  approveHandler = () => {
    this.submit();
    startTabs();
  }

  constructor(props) {
    super(props);
   
    this.state = {
      hasFocus0: false,
      hasFocus1: false,
      hasFocus2: false,
      hasFocus3: false,
      hasFocus4: false,
      hasFocus5: false,

      touched: false,
      checkMark: 0,
      
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      weight: 0, 
      gender: "",
      genderSymbol: 0,
      medicalInstitution: "",
      hmo: "",

      wakeupTime: "",
      lunchTime: "",
      bedTime: "",

      weightUnit: "Kg",
      
      sensitivities: [],
      history: [ "pain_treatment" , "chronic_pain", "hypertension", "kidney", "heart", "liver", "antidepressants" ],
      personalHistory : [],
      checked: [],          
    };
  }

  onSelect(index, value){
    this.setState({
      text: `Selected index: ${index} , value: ${value}`
    })
  }

  adjWeight(){
    if(this.state.weightUnit === 'Kg'){
      this.setState({weight: (this.state.weight*2.205)});
    }
    else if(this.state.weightUnit === 'Lb'){
      this.setState({weight: (this.state.weight/2.205)});
    }
  }

  touched(){
    if(this.state.touched === false)
    {
      this.setState({touched: true, checkMark: 1});
    }
  }

  submit =()=>{

    

    this.setState({touched: false, checkMark: 0});
    let weightToMorph = this.state.weight;
    if(this.state.weightUnit === "Lb"){
      weightToMorph = weightToMorph/2.205;
    }
    
      let dateToMorph = this.state.dateOfBirth;
      if(dateToMorph !== ""){
      dateToMorph = dateToMorph.substring(10) + "-" + dateToMorph.substring(5,7) + "-" + dateToMorph.substring(0,2);
    }
    
    RNSecureKeyStore.get("key1")
    .then((res) => {
      fetch("http://52.19.205.95:80/api/patients/profile/" + this.state.username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': res,
        },
        body:JSON.stringify({
          "Firstname": this.state.firstName,
          "Lastname": this.state.lastName,
          "Mobile": this.state.phoneNumber,
          "Birthday": dateToMorph, 
          "Weight": weightToMorph,
          "Gender": this.state.gender, //male - female
          "Med_Inst": this.state.medicalInstitution,
          "HMO": this.state.hmo,
          "Approved_Info": true,
          "Habits": {
            "Wakeup_Time": this.state.wakeupTime,
            "Lunch_Time": this.state.lunchTime,
            "Bed_Time": this.state.bedTime,
          },
          "Medical_History":{
            "Diseases": this.state.personalHistory,
          }
        })
        
      
      })
      .catch(err => {
        console.log(err);     
      })
    })
    
  }

  checkStatus(key){
    const history = [...this.state.history];
    const personalHistory = [...this.state.personalHistory];

    if(this.onList(personalHistory, history[key])){
      return 0;
    }
    else{
      return 1;
    }
  }
 
  onSelectHistory = (index, value, key)=>{
    let newArray = [...this.state.history];
    let updated = [...this.state.personalHistory];

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
    this.setState({personalHistory: updated});  

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

  onGenderSelect=(index, value)=>{
    if(index===1){
      this.setState({gender: "male"});
    }
    else{
      this.setState({gender: "female"});
    }
  }

  

  state = {
    showForm: 0,
    tab0: 'white',
    tab1: '#85DBDC',
    tab2: '#85DBDC',
    tab3: '#85DBDC',
    
  };
  componentWillMount(){
    this.setState({showForm: 0});
    this.setState({tab0: 'white'});
    this.setState({tab1: '#85DBDC'});
    this.setState({tab2: '#85DBDC'});
    this.setState({tab3: '#85DBDC'});
    this.setState({checkMark: 0});

    RNSecureKeyStore.get("user")
    .then((res) =>{    
      this.setState({username: res});   
      
    }) 
    .catch(err => {
      console.log(err);     
    })

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
    .then(parsedRes => {
      
      this.setState({firstName: parsedRes.Firstname});
      this.setState({lastName: parsedRes.Lastname});
      if(parsedRes.Mobile !== undefined){
        this.setState({phoneNumber: parsedRes.Mobile});
      }
      if(parsedRes.Birthday !== null){
         this.setState({dateOfBirth: parsedRes.Birthday.substring(8,10) + " | " + parsedRes.Birthday.substring(5,7) + " | " + parsedRes.Birthday.substring(0,4)});
      }
      if(parsedRes.Weight !== undefined){
        this.setState({weight: parsedRes.Weight });
      }
      if(parsedRes.Gender !== undefined){
        this.setState({gender: parsedRes.Gender });
        if(this.state.gender === "male"){
          this.setState({genderSymbol: 1});
        }
        else{
          this.setState({genderSymbol: 0});
        }
      }
      if(parsedRes.Med_Inst !== undefined){
        this.setState({medicalInstitution: parsedRes.Med_Inst})
      }
      if(parsedRes.hmo !== undefined){
        this.setState({hmo: parsedRes.HMO})
      }
      if(parsedRes.Habits.Wakeup_Time !== undefined)
      {
        this.setState({wakeupTime: parsedRes.Habits.Wakeup_Time});
      }
      if(parsedRes.Habits.Lunch_Time !== undefined)
      {
        this.setState({lunchTime: parsedRes.Habits.Lunch_Time});
      }
      if(parsedRes.Habits.Bed_Time !== undefined)
      {
        this.setState({bedTime: parsedRes.Habits.Bed_Time});
      }
      this.setState({sensitivities: parsedRes.Medical_History.DrugSensitivities})
      this.setState({personalHistory: parsedRes.Medical_History.Diseases})
      
      

    }) 
    
  }
  );

  
}

setFocus0 (hasFocus0) {
  this.setState({hasFocus0});
}

setFocus1 (hasFocus1) {
  this.setState({hasFocus1});
}

setFocus2 (hasFocus2) {
  this.setState({hasFocus2});
}

setFocus3 (hasFocus3) {
  this.setState({hasFocus3});
}

setFocus4 (hasFocus4) {
  this.setState({hasFocus4});
}

setFocus5 (hasFocus5) {
  this.setState({hasFocus5});
}
  
  render () {
    var form;
    if (this.state.showForm === 0) {
       form = (

        


         <View style={styles.subContainer}>
<ScrollView keyboardShouldPersistTaps='always' >
         <View>
         <Text style={[styles.text4, {marginTop:18, marginBottom: 42}]}>{strings('TabProfile.review')}</Text>
        </View>

        <Text style={styles.text3}>{strings('TabProfile.firstName')}</Text>
              <TextInput
              style={this.state.hasFocus0 ? styles.focusedTextInput : styles.textInputStyle}
              placeholder={"First name"}
              underlineColorAndroid={'rgba(255, 255, 255, 0.0)'}
              value={this.state.firstName}
              onFocus={this.setFocus0.bind(this, true)}
              onBlur={this.setFocus0.bind(this, false)}
              onChangeText={(value) => [this.setState({firstName: value}), this.touched()]}
              require
              />

              <Text style={styles.text3}>{strings('TabProfile.lastName')}</Text>
              <TextInput
              placeholder={"Last name"}
              style={this.state.hasFocus1 ? styles.focusedTextInput : styles.textInputStyle}
              onFocus={this.setFocus1.bind(this, true)}
              onBlur={this.setFocus1.bind(this, false)}
              underlineColorAndroid={'rgba(255, 255, 255, 0.0)'}
              onChangeText={(value) => [this.setState({lastName: value}), this.touched()]}
              value={this.state.lastName}
              />

              <Text style={styles.text3}>{strings('TabProfile.phone')}</Text>
              <TextInput
              placeholder= {"Phone number"}
              style={this.state.hasFocus2 ? styles.focusedTextInput : styles.textInputStyle}
              onFocus={this.setFocus2.bind(this, true)}
              onBlur={this.setFocus2.bind(this, false)}
              underlineColorAndroid={'rgba(255, 255, 255, 0.0)'}
              onChangeText={(value) => [this.setState({phoneNumber: value}), this.touched()]}
              value={this.state.phoneNumber}
              />
              <Text style={styles.text3}>{strings('TabProfile.birth')}</Text>
              <View style={{height: 50, paddingLeft: 15,marginBottom: 29, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
              <DatePicker 
                style={{width: 350}}
                date={this.state.dateOfBirth}
                mode="date"
                format="DD | MM | YYYY"
                minDate="01 | 01 | 1990"
                maxDate="01 | 01 | 2018"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
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
                  flexDirection: 'column'
                },
                dateText: {
                      fontSize: 14,
                      color: 'white'
                  }
                }}
                onDateChange={(date) => [this.setState({dateOfBirth: date}), this.touched()]}
              />
              </View>
              <Text style={styles.text3}>{strings('TabProfile.weight')}</Text>

              <View 
              style={styles.weightContainer}>
                <TextInput
                onFocus={this.setFocus5.bind(this, true)}
                onBlur={this.setFocus5.bind(this, false)}
                keyboardType="numeric"
                style={this.state.hasFocus5 ? styles.focusedTextInput : styles.textWeightInputStyle}
                underlineColorAndroid={'rgba(255, 255, 255, 0.0)'}
                onChangeText={value => [this.setState({weight: value}), this.touched()]}
                value={`${this.state.weight}`}
                />

                <View style={{height: 50, width: 100, paddingLeft: 15, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                  <Picker
                    mode='dialog'
                    selectedValue={this.state.weightUnit}
                    style={{color: 'white'}}
                    onValueChange={(itemValue, itemIndex) => [this.setState({weightUnit: itemValue}), this.adjWeight(), this.touched()]}>
     
                    <Picker.Item label={strings('TabProfile.kg')} value="kg" />
                    <Picker.Item label={strings('TabProfile.lb')} value="lb" />
                  </Picker>
                </View>

              </View>

              <Text style={styles.text3}>{strings('TabProfile.gender')}</Text>
              <RadioGroup
              style={styles.radioButtonsContainer}
              size={24}
              thickness={3}
              color='rgba(0, 0, 0, 0.15)'
              activeColor='#E0EFEF'
              selectedIndex={this.state.genderSymbol}
              onSelect = {(index, value) => [this.onGenderSelect(index, value), this.touched()]}
              >

              <RadioButton
              value='female'
              color='#0E7191'
              >
              <Text style={[styles.text2,{color: 'white'}]}>{strings('TabProfile.female')}</Text>
              </RadioButton>

              <RadioButton
              value='male'
              color='#0E7191'
              >
              <Text style={[styles.text2,{color: 'white'}]}>{strings('TabProfile.male')}</Text>
              </RadioButton>
              </RadioGroup>

              <Text style={styles.text3}>{strings('TabProfile.medical_institution')}</Text>
              <TextInput
              placeholder={"Medical institution"}
              style={this.state.hasFocus4 ? styles.focusedTextInput : styles.textInputStyle}
              onFocus={this.setFocus4.bind(this, true)}
              onBlur={this.setFocus4.bind(this, false)}
              underlineColorAndroid={'rgba(255, 255, 255, 0.0)'}
              onChangeText={(value) => [this.setState({medicalInstitution: value}), this.touched()]}
              value={this.state.medicalInstitution}
              />
              <Text style={styles.text3}>{strings('TabProfile.hmo')}</Text>
              <View style={{height: 50, paddingLeft: 15, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                <Picker
                    
                    mode='dialog'
                    selectedValue={this.state.hmo}
                    style={{color: 'white'}}
                    onValueChange={(itemValue, itemIndex) => [this.setState({hmo: itemValue}), this.touched()]}>
     
                    <Picker.Item label={strings('TabProfile.clalit')} value="clalit"/>
                    <Picker.Item label={strings('TabProfile.leumit')} value="leumit"/>
                    <Picker.Item label={strings('TabProfile.maccabi')} value="maccabi"/>
                    <Picker.Item label={strings('TabProfile.meuhedet')} value="meuhedet"/>
                  </Picker>
              </View>
              

        <View style={{alignItems:'center'}}>
         <TouchableOpacity style={styles.button}  onPress={()=>{this.setState({showForm: 1, tab1: 'white'})}}>
         <View style={styles.inButton}>
         <Image source={require('../images/00CheckGrey.png')}/>
            <Text style={styles.buttonText} >{strings('TabProfile.next')}</Text>
          </View>
         </TouchableOpacity>
         </View>
          </ScrollView>
         </View>

       );
    } else if (this.state.showForm === 1) {
       form = (
         <View style={styles.subContainer}>
         

          <View>
         <Text style={[styles.text4, {marginTop:18, marginBottom: 42}]}>{strings('TabProfile.routine')}</Text>
        </View>

          <ScrollView keyboardShouldPersistTaps='always' >
        
         
          <Text style={styles.text3}>{strings('TabProfile.wake_up')}</Text>
              <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6, marginBottom: 29}}>
              <DatePicker mode="time" androidMode="spinner" format="HH:mm" showIcon={false} 
              date={this.state.wakeupTime}
                style={{width: 350}}
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
                onDateChange={(date) => [this.setState({wakeupTime: date}), this.touched()]}/>
              
              </View>

              <Text style={styles.text3}>{strings('TabProfile.lunch')}</Text>
              <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6, marginBottom: 29 }}>
              <DatePicker mode="time" androidMode="spinner" format="HH:mm" showIcon={false} 
              date={this.state.lunchTime}
                style={{width: 350}}
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
                onDateChange={(date) => [this.setState({lunchTime: date}), this.touched()]}/>
              </View>

              <Text style={styles.text3}>{strings('TabProfile.bedtime')}</Text>
              <View style={{height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 6, marginBottom: 29}}>
              <DatePicker mode="time" androidMode="spinner" format="HH:mm" showIcon={false} 
              date={this.state.bedTime}
                style={{width: 350}}
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
                onDateChange={(date) => [this.setState({bedTime: date}), this.touched()]}/>
              </View>


          
          <View style={{alignItems:'center'}}>
         <TouchableOpacity style={styles.button}  onPress={()=>{this.setState({showForm: 2, tab2: 'white'})}}>
         <View style={styles.inButton}>
         <Image source={require('../images/00CheckGrey.png')}/>
            <Text style={styles.buttonText} >{strings('TabProfile.next')}</Text>
          </View>
         </TouchableOpacity>
         </View>
    </ScrollView>
         </View>

         
       );
    }
    else if (this.state.showForm === 2) {
     if(this.state.sensitivities.length === 0){
       form = (
         <View>
         <ScrollView>
         <View>
                <Text style={styles.text4}>{strings('TabProfile.sensitivity_title')}</Text>

                <Text style={[styles.text5,{paddingTop:14}]}>{strings('TabProfile.sensitivities_subtitle')}</Text>
              </View>

           <View style={{alignItems:'center'}}>
         <TouchableOpacity style={styles.button}  onPress={()=>{this.setState({showForm: 3, tab3: 'white'})}}>
         <View style={styles.inButton}>
         <Image source={require('../images/00CheckGrey.png')}/>
            <Text style={styles.buttonText} >{strings('TabProfile.next')}</Text>
          </View>
         </TouchableOpacity>
         </View>
         </ScrollView>
         </View>
       );
     }
     else{
       form = (
         <View>
           
           <Text style={[styles.text5, {paddingBottom:30}]}>{strings('TabProfile.sensitivities_subtitle')}</Text>
           
         <ScrollView>
         { this.state.sensitivities.map((item, key)=>(
                  <View key={key}>
                  <Text key={key} style={[styles.text5,{fontWeight:'bold', paddingBottom: 23}]} > { item } </Text>
                  <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom:19}} />
                  </View>  
                  
                  )
                )}

           <View style={{alignItems:'center'}}>
         <TouchableOpacity style={styles.button}  onPress={()=>{this.setState({showForm: 3, line3: 'white'})}}>
         <View style={styles.inButton}>
         <Image source={require('../images/00CheckGrey.png')}/>
            <Text style={styles.buttonText} >{strings('TabProfile.next')}</Text>
          </View>
         </TouchableOpacity>
         </View>
           </ScrollView>

           
         </View>
       );
     }
     
     
     
  }
  else if (this.state.showForm === 3) {
   form = (
     <View style={{paddingTop: 18}}>

     <Text style={styles.text4}>{strings('TabProfile.sensitivity_data')}</Text>

       <ScrollView>
       { this.state.history.map((item, key)=>(
                  <View key={key} style={{paddingTop:20}}>
                  <Text  style={[styles.text5,{fontWeight:'bold', paddingBottom: 23}]} > {strings('TabProfile.'+item)}</Text>
                  <RadioGroup style={styles.radioButtonsContainer} 
                   
                    size={24}
                    thickness={3}
                    color='rgba(0, 0, 0, 0.15)'
                    activeColor='#E0EFEF'
                    selectedIndex={this.checkStatus(key)}
                    onSelect = {(index, value) => [this.onSelectHistory(index, value, key), this.touched()]}>

                    <RadioButton value='Yes' color='#0E7191'>
                      <Text style={styles.text2}>{strings('TabProfile.yes')} </Text>
                    </RadioButton>

                    <RadioButton value='No' color='#0E7191'>
                      <Text style={styles.text2}>{strings('TabProfile.no')}</Text>
                    </RadioButton>
                  </RadioGroup>
                  <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 25, marginBottom:19}} />
                  </View>  
                  
                  )
                )}

           <View style={{alignItems:'center'}}>
         <TouchableOpacity style={styles.button}  onPress={this.approveHandler}>
         <View style={styles.inButton}>
         <Image source={require('../images/00CheckGrey.png')}/>
            <Text style={styles.buttonText} >{strings('TabProfile.done')}</Text>
          </View>
         </TouchableOpacity>
         </View>
           </ScrollView>
     </View>
   );
}

    return (

      <LinearGradient colors={['#085d87', '#27c7bb']}
      style={{flex:1}}
         start={{ x: 0, y: 1 }}
         end={{ x: 1, y: 0 }}>

      <View style={styles.mainContainer}>

      

       <View style={styles.container3}>
           <View style={{borderBottomColor: 'white', borderBottomWidth: 3, paddingTop: 13, width: 60, flexDirection:'row'}} />
           <View style={{borderBottomColor: this.state.tab1, borderBottomWidth: 3, paddingTop: 13, width: 60, flexDirection:'row'}} />
           <View style={{borderBottomColor: this.state.tab2, borderBottomWidth: 3, paddingTop: 13, width: 60, flexDirection:'row'}} />
           <View style={{borderBottomColor: this.state.tab3, borderBottomWidth: 3, paddingTop: 13, width: 60, flexDirection:'row'}} />
       </View>

       
       <View style={styles.container4}>
         {form}
       </View>

       </View>

       </LinearGradient>
    );
 }
}

const stylesObj = {
  
  marginBottom:29,
  height: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  paddingLeft: 15,
  color: 'white',
  fontSize: 18,
  borderRadius: 0,
  justifyContent: 'center',
  
};

export default ApproveInfoScreen;

const styles = StyleSheet.create({
mainContainer: {
flex: 1,
padding: 20,
},
subContainer:{
  flex: 1,
},
container3: {
paddingTop: 20,
flexDirection: 'row',
justifyContent: 'space-between'
},
container4: {
  flex: 0.9,
  paddingTop: 10,
  justifyContent: 'space-between'
},
weightContainer: {
  marginBottom:29,
flexDirection: 'row',
justifyContent: 'space-between'
},


text2: {
color: 'rgba(255, 255, 255, 1.0)',
fontWeight: 'bold'
},

text3: {
marginBottom: 5,
fontSize:12,
color: 'rgba(255, 255, 255, 0.5)',
fontWeight: 'bold',
},

text4:{
color: 'white',
fontSize: 24,
},
text5:{
fontSize:12,
color: 'rgba(255, 255, 255, 255)',
},

textInputStyle:{
  ...stylesObj,
  
},
focusedTextInput:{
  ...stylesObj,
  borderColor: 'white',
  borderWidth: 1,
  flex: 1,
},

textWeightInputStyle:{
  marginBottom:29,
  marginRight: 10,
  flex: 1,
  flexDirection: 'row',
  height: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  paddingLeft: 15,
  color: 'white',
  fontSize: 18,
  borderRadius: 0,
  justifyContent: 'center'
},

button:{
  backgroundColor: 'rgba(255, 255, 255, 255)',
  width: 150,
  height: 45,
  borderRadius: 22.5,
  marginTop:31,
  alignItems:'center',
  flex:1,
  flexDirection: 'column',
  marginBottom: 47
},
inButton:{
  marginTop:12,
  flex:1,
  flexDirection: 'row'
},
buttonText:{
  fontSize:12,
  color:'black', 
  fontWeight:'bold',
  marginLeft: 23,
  marginTop: 3
},

textWeightInputStyle: {
width: 245,
height: 50,
backgroundColor: 'rgba(255, 255, 255, 0.2)',
paddingLeft: 15,
color: 'white',
fontSize: 18,
borderRadius: 0,
justifyContent: 'center'
},

radioButtonsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 29
}
})
