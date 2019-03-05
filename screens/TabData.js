import React, { Component } from 'react'
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Picker, activeOpacity, ScrollView } from 'react-native'
import { LineChart, YAxis, XAxis, } from 'react-native-svg-charts'
import { Line, G } from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native'
import dateFns from 'date-fns'
import * as shape from 'd3-shape'
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

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



class TabData extends Component {

  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      showForm: 0,
      tab0: 'white',
      tab1: '#85DBDC',
      tab2: '#85DBDC',
      tab3: '#85DBDC',

      selectedDay: "",
      xMinDay: "",
      xMaxDay: "",

      selectedWeekBegin: "",
      selectedWeekEnd: "",
     

      selectedMonth: "",

      firstRecord: "",
      lastRecord: "",
      days: [],
      weeks: [],
      months: [],
      fromStart: [],
      todayTaken: []
    };
  }

  takenMed = () => {

    this.props.navigator.push({ screen: 'mobileApp.TakenMed' });

  }


  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  componentDidMount() {

  }

  componentWillMount() {

   
    let temp = new Date();
    tempMin = new Date()
    tempMax = new Date()
    tempMin.setHours(0)
    tempMin.setMinutes(0)
    tempMax.setHours(23)
    tempMax.setMinutes(59)

    tempWeekBegin = new Date()
    tempWeekBegin.setDate(tempWeekBegin.getDate() - 7)

    this.setState({ selectedDay: temp.toString(), xMinDay: tempMin.toString(), xMaxDay: tempMax.toString(), selectedWeekBegin: tempWeekBegin.toString(), 
                    selectedWeekEnd: temp.toString(), selectedMonth: temp.toString()   })


    RNSecureKeyStore.get("user")
      .then((res) => {
        this.setState({ username: res });

      })
      .catch(err => {
        console.log(err);
      })

    date = new Date()
   
    RNSecureKeyStore.get("key1")
      .then((res) => {

        fetch("http://52.19.205.95:80/api/patients/profile/getAverages/" + this.state.username + "?time=" + date.toIsoString(true), {

          headers: {
            'Content-Type': 'application/json',
            'Authorization': res,
          }

        })
          .catch(err => {
            console.log(err);
          })
          .then(res => res.json())
          .then((parsedRes) => {
            let days = parsedRes.days
            let weeks = parsedRes.weeks
            let months = parsedRes.months
            days.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
            weeks.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })
            months.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })

            this.setState({ days: days, firstRecord: days[0].date, lastRecord: days[days.length-1].date, weeks: weeks, months: months })


          })

      

      fetch("http://52.19.205.95:80/api/patients/profile/dataHistory/" + this.state.username + "?time=" + date.toIsoString(true), {

          headers: {
            'Content-Type': 'application/json',
            'Authorization': res,
          }

        })
          .catch(err => {
            console.log(err);
          })
      .then(res=>res.json())
      .then(parsedRes =>{
        timeFrom = new Date()
        timeFrom.setHours(0)
        timeFrom.setMinutes(0)
        timeFrom.setSeconds(1)

        timeTo = new Date()
        timeTo.setHours(23)
        timeTo.setMinutes(59)
        timeTo.setSeconds(59)

        let arr = []
        parsedRes.map((item, key)=>{
         
          if(item.MedicationTakenTime !== null && item.MedicationName !== undefined){
            
              arr.push(item)
            
          }
        })

        arr.sort((a, b) => {
          return new Date(a.MedicationTakenTime) - new Date(b.MedicationTakenTime);
        });
        console.log("meds taken today: " + arr)
        this.setState({todayTaken: arr})
      })
    })
  }

  createDate = (hour, minute, second) => {
    temp = new Date()
    temp.setHours(hour)
    temp.setMinutes(minute)
    temp.setSeconds(second)
    return temp
  }

  createWeek = (inc) =>{
    temp = new Date(this.state.selectedWeekBegin)
    temp.setDate(temp.getDate() + inc)
    return temp
  }

  createMonth = (date) =>{
    temp = new Date(this.state.selectedMonth)
    temp.setDate(date)
    return temp
  }

  createHistory (){
    temp2 = new Date(this.state.lastRecord)
    tempVar = new Date(this.state.firstRecord)
    arr = [];
     while(temp2.getMonth() >= tempVar.getMonth() && temp2.getYear() >= tempVar.getYear()){
      arr.push(new Date(tempVar))
      tempVar.setMonth(tempVar.getMonth()+1)
    }

    return arr;
  }

  daysThisMonth(){
    return this.daysInMonth(new Date(this.state.selectedMonth).getMonth() + 1, new Date(this.state.selectedMonth).getYear());
  } 

  incDate = () => {
    temp = new Date(this.state.selectedDay)
    temp.setDate(temp.getDate() + 1)
    tempMin = new Date(this.state.xMinDay)
    tempMin.setDate(tempMin.getDate() + 1)
    tempMax = new Date(this.state.xMaxDay)
    tempMax.setDate(tempMax.getDate() + 1)

    this.setState({ selectedDay: temp.toString(), xMinDay: tempMin.toString(), xMaxDay: tempMax.toString() })

  }

  incWeek = () => {
    tempWeekBegin = new Date(this.state.selectedWeekBegin)
    tempWeekBegin.setDate(tempWeekBegin.getDate() + 7)
    tempWeekEnd = new Date(this.state.selectedWeekEnd)
    tempWeekEnd.setDate(tempWeekEnd.getDate() + 7)


    this.setState({ selectedWeekBegin: tempWeekBegin.toString(), selectedWeekEnd: tempWeekEnd.toString() })
  }

  incMonth = () => {
    temp = new Date(this.state.selectedMonth)
    temp.setMonth(temp.getMonth()+1)
    
    this.setState({selectedMonth: temp.toString()})
  }

  decDate = () => {
    temp = new Date(this.state.selectedDay)
    temp.setDate(temp.getDate() - 1)
    tempMin = new Date(this.state.xMinDay)
    tempMin.setDate(tempMin.getDate() - 1)
    tempMax = new Date(this.state.xMaxDay)
    tempMax.setDate(tempMax.getDate() - 1)

    this.setState({ selectedDay: temp.toString(), xMinDay: tempMin.toString(), xMaxDay: tempMax.toString() })
  }

  decWeek = () => {
    tempWeekBegin = new Date(this.state.selectedWeekBegin)
    tempWeekBegin.setDate(tempWeekBegin.getDate() - 7)
    tempWeekEnd = new Date(this.state.selectedWeekEnd)
    tempWeekEnd.setDate(tempWeekEnd.getDate() - 7)

   

    this.setState({ selectedWeekBegin: tempWeekBegin.toString(), selectedWeekEnd: tempWeekEnd.toString() })
  }

  decMonth=()=> {
    temp = new Date(this.state.selectedMonth)
    temp.setMonth(temp.getMonth()-1)
    
    this.setState({selectedMonth: temp.toString()})
  }

  render() {




    const date = new Date().setHours(0);

    const HorizontalLine = (({ y }) => (
      <Line
        key={'zero-axis'}
        x1={'0%'}
        x2={'100%'}
        y1={y(50)}
        y2={y(50)}
        stroke={'white'}
        strokeDasharray={[4, 8]}
        strokeWidth={2}
      />
    ))


    const painLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const hours = [this.createDate(0, 0, 1), this.createDate(3, 0, 0), this.createDate(6, 0, 0), this.createDate(9, 0, 0), this.createDate(12, 0, 0),
                   this.createDate(15, 0, 0), this.createDate(18, 0, 0), this.createDate(21, 0, 0), this.createDate(23, 59, 59)]

    let days = [this.createWeek(1), this.createWeek(2), this.createWeek(3), this.createWeek(4), this.createWeek(5), this.createWeek(6), this.createWeek(7)];

    let dates = [this.createMonth(1), this.createMonth(5), this.createMonth(10), this.createMonth(15), this.createMonth(20), this.createMonth(25), 
                   this.createMonth(this.daysThisMonth()) ];
    
    let history = this.createHistory()
    

    const CustomGrid = ({ x, y, data, ticks }) => (
      <G>
        {
          // Horizontal grid
          ticks.map(tick => (
            <Line
              key={tick}
              x1={'0%'}
              x2={'100%'}
              y1={y(tick)}
              y2={y(tick)}
              stroke={'rgba(0,0,0,0.2)'}
            />
          ))
        }

      </G>
    )


    contentInset = { top: 20, bottom: 20 }
    var form;
    if (this.state.showForm === 0) {
      form = (
        <View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 12, marginBottom: 10 }} />
          <View style={styles.navContainer}>
            <TouchableOpacity
              disabled={new Date(this.state.firstRecord).getTime() >= new Date(this.state.selectedDay).getTime()}
              style={styles.dateNav}
              onPress={() => { this.decDate() }}
            >

              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{"<"}</Text>

              </View>
            </TouchableOpacity>
            <View style={styles.currDateContiner}>
              <Text style={styles.currDate}>{dateFns.format(new Date(this.state.selectedDay), 'MMM D')}</Text>
            </View>
            <TouchableOpacity
              disabled={new Date().getTime() <= new Date(this.state.selectedDay).getTime()}
              style={styles.dateNav}
              onPress={() => { this.incDate() }}
            >
              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{">"}</Text>

              </View>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom: 19 }} />
          <View style={{ height: 200, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
            <YAxis
              data={painLevels}
              yAccessor={({ item }) => item}
              contentInset={{ top: 10, bottom: 10 }}
              style={{ marginBottom: 30 }}
              svg={{
                fill: '#85DBDC',
                fontSize: 10,
              }}
              numberOfTicks={11}
            // formatLabel={ value => `${value}` }
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={this.state.days}
                yMin={0}
                yMax={10}
                xMin={new Date(this.state.xMinDay)}
                xMax={new Date(this.state.xMaxDay)}
                contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                yAccessor={({ item }) => item.avg}
                xAccessor={({ item }) => new Date(item.date)}
                svg={{ stroke: '#85DBDC', strokeWidth: 5, }}
              // curve={shape.curveNatural}
              >
                <CustomGrid />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10, marginHorizontal: -10 }}
                data={hours}
                xAccessor={({ item }) => item}
                contentInset={{ left: 12, right: 12 }}
                svg={{ fontSize: 10, fill: "#85DBDC" }}
                style={{ height: 30 }}
                formatLabel={(value) => dateFns.format(value, 'HH:mm')}

              />
            </View>
          </View>
        </View>
      );
    } else if (this.state.showForm === 1) {
      form = (
        <View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 12, marginBottom: 10 }} />
          <View style={styles.navContainer}>
            <TouchableOpacity
              disabled={new Date(this.state.firstRecord).getTime() >= new Date(this.state.selectedWeekBegin).getTime()}
              style={styles.dateNav}
              onPress={() => { this.decWeek() }}
            >

              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{"<"}</Text>

              </View>
            </TouchableOpacity>
            <View style={styles.currDateContiner}>
              <Text style={styles.currDate}>{dateFns.format(new Date(this.state.selectedWeekBegin), 'MMM D')} - {dateFns.format(new Date(this.state.selectedWeekEnd), 'MMM D')}</Text>
            </View>
            <TouchableOpacity
              disabled={new Date().getTime() <= new Date(this.state.selectedWeekEnd).getTime()}
              style={styles.dateNav}
              onPress={() => { this.incWeek() }}
            >
              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{">"}</Text>

              </View>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom: 19 }} />
          <View style={{ height: 200, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
          <YAxis
              data={painLevels}
              yAccessor={({ item }) => item}
              contentInset={{ top: 10, bottom: 10 }}
              style={{ marginBottom: 30 }}
              svg={{
                fill: '#85DBDC',
                fontSize: 10,
              }}
              numberOfTicks={11}
            // formatLabel={ value => `${value}` }
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={this.state.weeks}
                gridMin={0}
                gridMax={10}
                // numberOfTicks={6}
                xMin={new Date(this.state.selectedWeekBegin)}
                xMax={new Date(this.state.selectedWeekEnd)}
                contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                yAccessor={({ item }) => item.avg}
                xAccessor={({ item }) => new Date(item.date)}
                svg={{ stroke: '#85DBDC', strokeWidth: 5, }}
                // curve={shape.curveNatural}
              >
                <CustomGrid />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10, marginHorizontal: -10 }}
                data={days}
                // numberOfTicks={7}
                xAccessor={({ item }) => item}
                contentInset={{ left: 12, right: 12 }}
                svg={{ fontSize: 10, fill: "#85DBDC" }}
                style={{ height: 30 }}
                formatLabel={(value) => dateFns.format(value, 'ddd')}

              />
            </View>
          </View>
        </View>
      );
    }
    else if (this.state.showForm === 2) {
      form = (
        <View>
        <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 12, marginBottom: 10 }} />
          <View style={styles.navContainer}>
          
            <TouchableOpacity
              disabled={new Date(this.state.firstRecord).getTime() > new Date(this.state.selectedMonth).getTime()}
              style={styles.dateNav}
              onPress={() => { this.decMonth() }}
            >

              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{"<"}</Text>

              </View>
            </TouchableOpacity>
          
            <View style={styles.currDateContiner}>
              <Text style={styles.currDate}>{dateFns.format(new Date(this.state.selectedMonth), 'MMM')}</Text>
            </View>
            <TouchableOpacity
              disabled={new Date().getTime() <= new Date(this.state.selectedMonth).getTime()}
              style={styles.dateNav}
              onPress={() => { this.incMonth() }}
            >
              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{">"}</Text>

              </View>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom: 19 }} />
        <View style={{ height: 200, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
          <YAxis
            data={painLevels}
            yAccessor={({ item }) => item}
            contentInset={{ top: 10, bottom: 10 }}
            style={{ marginBottom: 30 }}
            svg={{
              fill: '#85DBDC',
              fontSize: 10,
            }}
            numberOfTicks={11}
          // formatLabel={ value => `${value}` }
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.state.months}
              gridMin={0}
              gridMax={10}
              xMin={new Date(dates[0])}
              xMax={new Date(dates[dates.length-1])}
              contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
              yAccessor={({ item }) => item.avg}
              xAccessor={({ item }) => new Date(item.date)}
              svg={{ stroke: '#85DBDC', strokeWidth: 5, }}
              // curve={shape.curveNatural}
            >
              <CustomGrid />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, marginHorizontal: -10 }}
              data={dates}
              xAccessor={({ item }) => item}
              contentInset={{ left: 12, right: 12 }}
              svg={{ fontSize: 10, fill: "#85DBDC" }}
              style={{ height: 30 }}
            formatLabel={ (value) => dateFns.format(value, 'D') }

            />
          </View>
        </View>
        </View>
      );
    }



    else if (this.state.showForm === 3) {
      form = (
        <View>
        <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 12, marginBottom: 10 }} />
          <View style={styles.navContainer}>
          
            <TouchableOpacity
              disabled={true}
              style={styles.dateNav}
              // onPress={() => {  }}
            >

              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{"<"}</Text>

              </View>
            </TouchableOpacity>
          
            <View style={styles.currDateContiner}>
              <Text style={styles.currDate}>{dateFns.format(new Date(this.state.firstRecord), 'MMM D')} - {dateFns.format(new Date(this.state.lastRecord), 'MMM D')}</Text>
            </View>
            <TouchableOpacity
              disabled={true}
              style={styles.dateNav}
              // onPress={() => {  }}
            >
              <View
              // style={styles.saveButtonStyle2}
              >
                <Text style={styles.navArrow}>{">"}</Text>

              </View>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom: 19 }} />
        <View style={{ height: 200, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
          <YAxis
            data={painLevels}
            yAccessor={({ item }) => item}
            contentInset={{ top: 10, bottom: 10 }}
            style={{ marginBottom: 30 }}
            svg={{
              fill: '#85DBDC',
              fontSize: 10,
            }}
            numberOfTicks={11}
          // formatLabel={ value => `${value}` }
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.state.months}
              gridMin={0}
              gridMax={10}
              xMin={new Date(this.state.firstRecord)}
              xMax={new Date(this.state.lastRecord)}
              contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
              yAccessor={({ item }) => item.avg}
              xAccessor={({ item }) => new Date(item.date)}
              svg={{ stroke: '#85DBDC', strokeWidth: 5, }}
              // curve={shape.curveNatural}
            >
              <CustomGrid />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, marginHorizontal: -10 }}
              data={history}
              xAccessor={({ item }) => item}
              contentInset={{ left: 12, right: 12 }}
              svg={{ fontSize: 10, fill: "#85DBDC" }}
              style={{ height: 30 }}
            formatLabel={ (value) => dateFns.format(value, 'MMM') }

            />
          </View>
        </View>
        </View>
      );
    }

    return (

      <LinearGradient colors={['#085d87', '#27c7bb']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>

        <View style={styles.mainContainer}>

          <View style={styles.aboveContainer}>
            <Text style={styles.text1}>DATA</Text>
            <TouchableOpacity
              style={styles.saveButtonStyle}
              onPress={this.takenMed}>
              <View
                style={styles.saveButtonStyle2}>
                <Image source={require('../images/plusWhite.png')} />
                <Text style={{ color: 'white' }}> Add taken medication</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container3}>
            <TouchableOpacity

              onPress={() => this.setState({ showForm: 0, tab0: 'white', tab1: '#85DBDC', tab2: '#85DBDC', tab3: '#85DBDC' })}

              style={[styles.tabButtonStyle]}
            >

              <Text style={[styles.text2, { color: this.state.tab0 }]}>DAY</Text>
              <View style={{ borderBottomColor: this.state.tab0, borderBottomWidth: 3, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ showForm: 1, tab0: '#85DBDC', tab1: 'white', tab2: '#85DBDC', tab3: '#85DBDC' })}
              style={[styles.tabButtonStyle]}>
              <Text style={[styles.text2, { color: this.state.tab1 }]}>WEEK</Text>
              <View style={{ borderBottomColor: this.state.tab1, borderBottomWidth: 3, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity

              style={[styles.tabButtonStyle]}
              onPress={() => this.setState({ showForm: 2, tab0: '#85DBDC', tab1: '#85DBDC', tab2: 'white', tab3: '#85DBDC' })}
            >

              <Text style={[styles.text2, { color: this.state.tab2 }]}>MONTH</Text>
              <View style={{ borderBottomColor: this.state.tab2, borderBottomWidth: 3, paddingTop: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity

              style={[styles.tabButtonStyle]}
              onPress={() => this.setState({ showForm: 3, tab0: '#85DBDC', tab1: '#85DBDC', tab2: '#85DBDC', tab3: 'white' })}
            >

              <Text style={[styles.text2, { color: this.state.tab3 }]}>FROM STARTING DAY</Text>
              <View style={{ borderBottomColor: this.state.tab3, borderBottomWidth: 3, paddingTop: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.container4}>
            {form}
          </View>

          <View style={ styles.drugsContainer}>
            <ScrollView>
                { this.state.todayTaken.map((item, key)=>(
                  <View key={key}>
                  <View style = {{flexDirection:"row", marginBottom: 4}}>
                    <Text key={key} style={[styles.text5, {fontWeight:'bold', flex: 8}]} > { item.MedicationName } </Text>
                    <Text key={key} style={[styles.text5, {flex: 1}]}> {dateFns.format(new Date(item.MedicationTakenTime), 'HH:mm') }</Text>
                  </View>
                  <Text key={key} style={item.PainLevel ? [styles.text5,{fontWeight:'bold', opacity: 0.5}]: {opacity: 0}} > Pain level { item.PainLevel }</Text>
                  <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 10, marginBottom:19}} />
                  </View>  
                  
                  )
                )}
            </ScrollView>
          </View>

         
        </View> 

      </LinearGradient>
    );
  }
}

export default TabData;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 20,
  },
  aboveContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container3: {
    flex: 0.1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container4: {

    flex: 1,
    paddingTop: 10,
    // justifyContent: 'space-between'
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
  drugsContainer: {
    flex:1, 
    padding: 20,
  },
  weightContainer: {
    padding: 10,
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
  text3: {
    marginBottom: 5,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
  },
  text4: {
    color: 'white',
    fontSize: 24,
  },
  text5: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 255)',
  },
  textInputStyle: {
    width: 320,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingLeft: 15,
    color: 'white',
    fontSize: 18,
    borderRadius: 0,
    justifyContent: 'center'
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
  saveButtonStyle: {


    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 30,
    justifyContent: 'center'
  },

  saveButtonStyle2: {

    paddingRight: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navContainer: {
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
  },
  dateNav: {
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 30,
    width: 30,

    alignItems: 'center'
  },
  navArrow: {
    fontSize: 20,
    color: 'white',

  },
  currDateContiner: {
    width: 150,
    flexDirection: 'column',
    alignItems: 'center'
  },
  currDate: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabButtonStyle: {


    justifyContent: 'center',

  },
  radioButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
