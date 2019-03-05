
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { strings } from '../locales/i18n';

const milisecondsInDay = 86400000;

export default class TabAwaitingSurgery extends Component {
    
    constructor(props){
        super(props)
        this.state = {
           
            patientName: "",
            daysTosurgery: ""

        };
    }

    componentWillMount(){
        let username

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

                const date = Math.round((new Date(parsedRes.Surgery_Date) - new Date)/milisecondsInDay);
               
                this.setState({daysTosurgery: date, patientName: parsedRes.Firstname});
            })
            })
    }

    static navigatorStyle = {
        navBarHidden: true,
    };

    render() {
        return(
            <LinearGradient colors={["#085d87", "#27c7bb"]}
                style={{flex:1}}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}>

                <View style={styles.mainContainer}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{strings('TabAwaitingSurgery.title1')} {this.state.patientName}</Text>
                        <Text style={styles.titleText}>{strings('TabAwaitingSurgery.title2')}</Text>
                        <Text style={styles.titleText}>{strings('TabAwaitingSurgery.title3')} { (this.state.daysTosurgery)} {strings('TabAwaitingSurgery.title4')}</Text> 
                    </View>
                    <View tyle={styles.subtitle}>
                        <Text style={styles.subtitleText}>{strings('TabAwaitingSurgery.subtitle1')}</Text>
                        <Text style={styles.subtitleText}>{strings('TabAwaitingSurgery.subtitle2')}</Text>
                    </View>
                    <View style={styles.image}>
                        <Image style={styles.pic} source={require('../images/main01.png')} />
                        <Image style={styles.pic} source={require('../images/main02.png')} />
                    </View>
                </View>

            </LinearGradient>
        );
    }  
}

const styles = StyleSheet.create({
    mainContainer:{
        marginTop: 100,
        flex: 1,
        alignItems: 'center', 
    },
    title:{
        
        
        alignItems: 'center',
        marginBottom: 50
    },
    subtitle:{
        
        alignItems: 'center'
    },
    image:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 60,
        padding: 50
    },
    titleText:{
        flexDirection: 'row', 
       
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    subtitleText:{
        color: 'white',
        fontSize: 18,
    },

})