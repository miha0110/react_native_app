import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Button, Image, ScrollView} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../locales/i18n';



class TabAlternative extends Component {

  static navigatorStyle = {
    navBarHidden: true,
  };

  render () {
    
    return (

      <LinearGradient colors={["#085d87", "#085d87"]}
        style={{flex:1}}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>
      
        <View style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>{strings('TabAlternative.title')}</Text>

          <Text style={styles.subHeader}>{strings('TabAlternative.subtitle')} </Text>

          <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1,height:1, paddingTop: 10, marginBottom:10}}></View>

          <Text style={styles.header}>{strings('TabAlternative.walkTitle')}</Text>

           
             <Image style={styles.pic}
               source={require('../images/000Walk.png')}
             />
           
          <Text style={styles.text1}>{strings('TabAlternative.walkP1')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.walkP2')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.walkP3')}</Text>

          <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1,height:0.1, paddingTop: 37, marginBottom:10}}></View>

          <Text style={styles.header}>{strings('TabAlternative.bathTitle')}</Text>

                    
          <Image style={styles.pic}
            source={require('../images/000Bath.png')}
          />

          <Text style={styles.text1}>{strings('TabAlternative.bathP1')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.bathP2')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.bathP3')}</Text>

          <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 26}}></View>

          <Text style={styles.header}>{strings('TabAlternative.coldTitle')}</Text>

                            
          <Image style={styles.pic}
          source={require('../images/000Cold.png')}
          />

          <Text style={styles.text1}>{strings('TabAlternative.coldP1')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.coldP2')}</Text>   
          <Text style={styles.text1}>{strings('TabAlternative.coldP3')}</Text>

          <View style={{borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, paddingTop: 26}}></View>

          <Text style={styles.header}>{strings('TabAlternative.medTitle')}</Text>

                            
          <Image style={styles.pic}
          source={require('../images/000Meditation.png')}
          />

          <Text style={styles.text1}>{strings('TabAlternative.medP1')}</Text>
          <Text style={styles.text1}>{strings('TabAlternative.medP2')}</Text>   
          

          </ScrollView>
        </View>
        
      </LinearGradient>
       );
  }
}

export default TabAlternative

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header:{
    fontWeight: "bold",
    fontSize: 24,
    color: 'white',
    paddingTop: 26
  },
  subHeader:{
    paddingTop: 45,
    paddingBottom: 36,
    padding: 10,
    fontSize: 18,
    color: 'white'
  },
  text1:{
    marginBottom: 10,
    fontSize: 12,
    color: 'white'
  },
  pic:{
    marginLeft: 83,
    marginRight: 83,
    marginTop: 36,
    marginBottom: 35,
  },
  bottomContainer: {
    flex: 0.1,
    justifyContent: 'space-between',
    paddingTop: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 30
  },
  
});
