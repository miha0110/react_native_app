import React, { Component } from 'react'
import image from '../images/menu_burger.png';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Picker,activeOpacity, ScrollView, TimePickerAndroid} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import DatePicker from 'react-native-datepicker'
import startSingleScreenApp from './startSingleScreenApp';

import { KeyboardAvoidingView } from 'react-native';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';


class TabProfile extends Component {

  static navigatorStyle = {
    navBarHidden: true,
    
  };

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
        history: [],
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

    logout =()=>{
      RNSecureKeyStore.set("key1", "", {accessible: ACCESSIBLE.ALWAYS})
      .catch((err) => {
        console.log(err);
      });

      startSingleScreenApp()

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
          
          if(item.Name === "Disease"){
            this.setState({history: item.Val})
          }
        })
      })
      //get personal info
      fetch("http:/52.19.205.95:80/api/patients/profile/" + this.state.username, {
     
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
    
      render() {

        var pic;
        if (this.state.checkMark === 0) {
          pic = <Image source={require('../images/00CheckWhiteInactive.png')}/>
        }
        else{
          pic =  <Image source={require('../images/00CheckGrey.png')}/>
        }

         var form;
         if (this.state.showForm === 0) {
            form = (

              <View>
              <ScrollView keyboardShouldPersistTaps='always' >
              
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
                minDate="01 | 01 | 1900"
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
     
                    <Picker.Item label={strings('TabProfile.kg')} value="Kg" />
                    <Picker.Item label={strings('TabProfile.lb')} value="Lb" />
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
              
              </ScrollView>
              </View>

            );
         } else if (this.state.showForm === 1) {
            form = (
              <View>
              
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
                style={{width: 350}}
                date={this.state.lunchTime}
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
                style={{width: 350}}
                date={this.state.bedTime}
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

              </View>
            );
         }
         else if (this.state.showForm === 2) {
          if(this.state.sensitivities.length === 0){
            form = (
              <View>
                <Text style={styles.text4}>{strings('TabProfile.sensitivity_title')}</Text>

                <Text style={[styles.text5,{paddingTop:14}]}>{strings('TabProfile.sensitivities_subtitle')}</Text>
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
                </ScrollView>
              </View>
            );
          }
          
          
          
       }
       else if (this.state.showForm === 3) {
        form = (
          <View style={{paddingTop: 18}}>
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

           <View style={styles.aboveContainer}>
             <Text style={styles.text1}>{strings('TabProfile.profile')}</Text>
             <TouchableOpacity
                
                style={[styles.saveButtonStyle,{width: 100}]}
                onPress={this.logout}>
                <View
                  style={[styles.saveButtonStyle2, {justifyContent: 'center'}]}>
                  <Text style={styles.buttonEnabledText}>Logout</Text>
                </View>
             </TouchableOpacity>
             <TouchableOpacity
                disabled={!this.state.touched}
                style={this.state.touched ? styles.saveButtonStyle : styles.buttonDisabled }
                onPress={this.submit}>
                <View
                style={styles.saveButtonStyle2}>
                  {pic}
                  <Text style={this.state.touched ? styles.buttonEnabledText : styles.buttonDisabledText }>{strings('TabProfile.save')}</Text>
                </View>
             </TouchableOpacity>
           </View>

            <View style={styles.container3}>
            <TouchableOpacity
            
             onPress ={ ()=>this.setState({showForm:0,   tab0: 'white' ,tab1: '#85DBDC', tab2: '#85DBDC', tab3: '#85DBDC'})}
             
               style={[styles.tabButtonStyle ]}
               >
                <Text style={[styles.text2, {color: this.state.tab0}]}>{strings('TabProfile.personal')} </Text>
                <Text style={[styles.text2, {color: this.state.tab0}]}>{strings('TabProfile.details')}</Text>
                <View style={{borderBottomColor: this.state.tab0, borderBottomWidth: 2, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
             
               
               onPress ={()=>this.setState({showForm:1, tab0: '#85DBDC' ,tab1: 'white', tab2: '#85DBDC', tab3: '#85DBDC'})}
              

                style={[styles.tabButtonStyle]}>
                <Text style={[styles.text2, {color: this.state.tab1}]}>{strings('TabProfile.time')} </Text>
                <Text style={[styles.text2, {color: this.state.tab1}]}>{strings('TabProfile.settings')}</Text>
                <View style={{borderBottomColor: this.state.tab1, borderBottomWidth: 2, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
                
               style={[styles.tabButtonStyle]}
               onPress={() => this.setState({showForm: 2, tab0: '#85DBDC' ,tab1: '#85DBDC', tab2: 'white', tab3: '#85DBDC'})}
             >
                <Text style={[styles.text2, {color: this.state.tab2}]}>{strings('TabProfile.medication')} </Text>
                <Text style={[styles.text2, {color: this.state.tab2}]}>{strings('TabProfile.sensitivity')}</Text>
                <View style={{borderBottomColor: this.state.tab2, borderBottomWidth: 2, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
               
               style={[styles.tabButtonStyle]}
               onPress={() => this.setState({showForm: 3, tab0: '#85DBDC' ,tab1: '#85DBDC', tab2: '#85DBDC', tab3: 'white'})}
               >
                <Text style={[styles.text2, {color: this.state.tab3}]}>{strings('TabProfile.medical')} </Text>
                <Text style={[styles.text2, {color: this.state.tab3}]}>{strings('TabProfile.history')}</Text>
                <View style={{borderBottomColor: this.state.tab3, borderBottomWidth: 2, paddingTop: 4 }} />
            </TouchableOpacity>
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
    justifyContent: 'center'
  
};

export default TabProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  aboveContainer: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container3: {
    
  
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container4: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'space-between'
  },
  container5: {
    padding: 10,
    justifyContent: 'space-between'
  },
  container6: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weightContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
  text1: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text2: {
    
    fontWeight: 'bold'
  },
  text2: {
    color: 'white',
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
  saveButtonStyle: {
    
    width: 134,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 20,
    justifyContent: 'center'
},
buttonDisabled:{
  width: 134,
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
  saveButtonStyle2: {
    paddingRight: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
},
tabButtonStyle: {
  
  
  justifyContent: 'center',
  
},
radioButtonsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 29
}
})
