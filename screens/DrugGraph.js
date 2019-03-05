import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import Svg, { Text } from 'react-native-svg'
import dateFns from 'date-fns'
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

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

export default class DrugGraph extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: "",
      lastDrugTaken: "",
      lastTimeTaken: "",
      nextDrugTake: "",
      nextTimeTake: "",
      textColor: 'rgba(255, 255, 255, 0.6)',
      dataSource: "no data",
      curHours : new Date().getHours(),
      curMinutes : new Date().getMinutes(),
    };
  }


  
  componentWillMount(){

    if(this.state.curHours< 10){
      this.setState({curHours: "0" + this.state.curHours})
    }
    if(this.state.curMinutes< 10){
      this.setState({curMinutes: "0" + this.state.curMinutes})
    }

    RNSecureKeyStore.get("user")
      .then((res) =>{    
        this.setState({username: res});   
        
      }) 
      .catch(err => {
        console.log(err);     
      })
      // setInterval( () => {
        
      date = new Date()
      
      RNSecureKeyStore.get("key1")
      .then((res) => {
      //get meds timeline
      fetch("http://52.19.205.95:80/api/patients/profile/timeline_medlist/" + this.state.username + "?time=" + date.toIsoString(true), {
    
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

        let lastTimeTaken = "";
        let lastDrugTaken = "";
        if(parsedRes.past.length !== 0){
        pastMeds = parsedRes.past

        pastMeds.sort((a,b)=>{
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.MedicationTakenTime) - new Date(a.MedicationTakenTime);
        });
        console.log(pastMeds)
        lastDrugTaken = pastMeds[0].MedicationName
        tempLastTimeTaken = new Date(pastMeds[0].MedicationTakenTime)
        if(tempLastTimeTaken.getHours()<10){
          lastTimeTaken+="0"
        }
        lastTimeTaken += tempLastTimeTaken.getHours() + ":"
        if(tempLastTimeTaken.getMinutes()<10){
          lastTimeTaken+="0"
        }
        lastTimeTaken += tempLastTimeTaken.getMinutes()
      }

      let nextTimeTake = "";
      let nextDrugTake = "";
        if(parsedRes.future.length !== 0){
        let timeAfter = new Date();
       
        timeAfter.setHours(timeAfter.getHours()+2);
        parsedRes.future.map((item)=>{
          if(item != null){
          temp = new Date();
          temp.setHours(item.Time.substring(0,2))
          temp.setMinutes(item.Time.substring(3))
          if(timeAfter > temp){
            timeAfter = temp;
            nextTimeTake = dateFns.format(timeAfter, 'HH : mm');
            nextDrugTake = item.DrugName; 

          }
        }
        })
      }
        this.setState({lastDrugTaken: lastDrugTaken, lastTimeTaken: lastTimeTaken, nextTimeTake: nextTimeTake, nextDrugTake: nextDrugTake})
        })
        
       
      })
    // },1000)
    setInterval( () => {
      this.setState({
        curHours : new Date().getHours(),
        curMinutes : new Date().getMinutes(),
      })
      if(this.state.curHours< 10){
        this.setState({curHours: "0" + this.state.curHours})
      }
      if(this.state.curMinutes< 10){
        this.setState({curMinutes: "0" + this.state.curMinutes})
      }
    },1000)

    
    
  }

  componentDidMount() {
   
  }

  render() {
    let width = Dimensions.get('window').width;
    let centerOfscreen = width/2;

    let grid = ["."];
    for(let i = 1; i < width/5; i++) {
      grid.push("  .");
    };

    return (
      <View style={styles.container}>

      <Svg
        ref="drugsgraph"
        width={width}
        height={width}
        >

        <Text x={24}
          y={centerOfscreen-17}
          fill="rgb(255,255,255,0.6)">{this.state.lastDrugTaken}</Text>
        <Text x={24}
          y={centerOfscreen-5}
          fill="rgb(255,255,255,0.6)">{this.state.lastTimeTaken}</Text>

        <Text x={centerOfscreen}
          y={centerOfscreen-5}
          style={{fontWeight: "bold"}}
          fill='white'
          textAnchor="middle">{this.state.curHours+ " : " +this.state.curMinutes}</Text>
        <Text x={5}
            y={centerOfscreen}
            fill='black'>{grid}</Text>
 
            <Text x={width - 70}
              y={centerOfscreen-17}
              fill="rgb(255,255,255,0.6)">{this.state.nextDrugTake}</Text>
            <Text x={width -51}
              y={centerOfscreen-5}
              fill="rgb(255,255,255,0.6)">{this.state.nextTimeTake}</Text>

        </Svg>
    </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  hourText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'
  },
  drugsText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'
  }
})
