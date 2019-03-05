import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import DrugGraph from './DrugGraph';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../locales/i18n';
import startTabs from '../screens/startMainTabs';

class shareEffects extends Component {

    static navigatorStyle = {
      navBarHidden: true,
      
      
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state={
          
        }
    }

    onNavigatorEvent(event){
        if (event.id === 'bottomTabSelected') {
          this.props.navigator.popToRoot()
        }
        if (event.id === 'bottomTabReselected') {
          this.props.navigator.popToRoot()
        }
    }

    componentWillMount(){
        var date = new Date();
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

    onReportPainPress= () => {
      startTabs()
        
    }

    takenMed = () =>{
      
      this.props.navigator.push({screen: 'mobileApp.TakenMed'});
  
    }

    render () {
        return (

            <LinearGradient colors={['#085d87', '#27c7bb']}
        style={{flex:1}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>
            
            <View style={styles.topContainer}>
        <View>
        <View style={[styles.aboveContainer]} >
          <Text style={styles.mainText}>{strings('shareEffect.' + this.state.monthStr)} {this.state.day} </Text>
          

          <TouchableOpacity
             style={styles.medicationButtonStyle}
             
             onPress={this.takenMed}>
             <View style={styles.medicationButtonStyle2}>
               <Image source={require('../images/plusWhite.png')}/>
               <Text style={{ fontSize: 12, color: 'white'}}>{strings('shareEffect.taken')}</Text>
             </View>

          </TouchableOpacity>
        </View>
        </View>

           {/* <View style={[styles.graphContainer, {height: 100, marginBottom: 50}]}></View> */}

         <View style={[styles.graphContainer, {height: 100, marginBottom: 50}]}>
         <DrugGraph/>
         </View>
        <View style={{  alignItems: 'center', justifyContent: 'center'}}>
        
        
          <View style={{marginBottom: 50, alignItems: 'center'}}>
          <Text style={styles.mainText}>{strings('shareEffect.title')}</Text>
          <Text style={styles.text01}> {strings('shareEffect.subtitle1')} </Text>
          <Text style={styles.text01}> {strings('shareEffect.subtitle2')}</Text>
          </View>

          <View style={{marginBottom: 100, alignItems: 'center'}}>
          <Text style={styles.text02}>{strings('shareEffect.paragraph1')}</Text>
          <Text style={styles.text02}>{strings('shareEffect.paragraph2')}</Text>
          <Text style={styles.text02}>{strings('shareEffect.paragraph3')}</Text>
          </View>

          <TouchableOpacity
             style={[styles.reportPainButtonStyle, {marginBottom: 50}]}
             onPress={this.onReportPainPress}>
             <View
             style={styles.reportPainButtonStyle2}>
               <Image
               source={require('../images/00_report_white3x.png')}
               style={{width: 20, height: 20}}/>
               <Text style={{ fontSize: 12, color: 'white'}}>{strings('shareEffect.report')}</Text>
             </View>

          </TouchableOpacity>
          <View>
          
               <Image
               style={{width: 200, height: 50, alignItems: 'center'}}
               source={require('../images/text_pop-up3x.png')}
               />
          </View>
          </View>
         </View>
         </LinearGradient>
        )
    }
}

export default shareEffects;

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
    graphContainer: {
    
        paddingBottom: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.0)'
    },
})