import React, { Component } from 'react'
import { PanResponder, View, Dimensions, StyleSheet } from 'react-native'
import Svg, { Path, Circle, G, Text, Line, lr,} from 'react-native-svg';
import { strings } from '../locales/i18n';


export default class CircleSlider extends Component {
  constructor(props){
    super(props);
    this.props.callbackFromParent('#085d87', '#27c7bb', 0);
    this.state = {
      angle: this.props.value,
      initCircleText1: "HOW", 
      initCircleText2: "DO_YOU",
      initCircleText3: "FEEL?",
      
      midCircleText1: "",
      midCircleText2: "",
      midCircleText3: "",
      midCircleText4: "", 
    };
  }


  componentWillMount() {
    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e,gs) => true,
      onPanResponderMove: (e,gs) => {
        let xOrigin = this.props.xCenter - (this.props.dialRadius + this.props.btnRadius);
        let yOrigin = this.props.yCenter - (this.props.dialRadius + this.props.btnRadius);
        let a = this.cartesianToPolar(gs.moveX-xOrigin, gs.moveY-yOrigin);

        if(a>205 && a<225) {
            this.setCircleTo0();
        }
        else if (a>225 && a<255) {
            this.setCircleTo1();
        }
        else if (a>255 && a<285) {
            this.setCircleTo2();
        }
        else if (a>285 && a<315) {
            this.setCircleTo3();
        }
        else if (a>315 && a<345) {
            this.setCircleTo4();
        }
        else if (a>345 && a<359) {
            this.setCircleTo5();
        }
        else if (a>0 && a<15) {
            this.setCircleTo5();
        }
        else if (a>15 && a<45) {
            this.setCircleTo6();
        }
        else if (a>45 && a<75) {
            this.setCircleTo7();
        }
        else if (a>75 && a<105) {
            this.setCircleTo8();
        }
        else if (a>105 && a<125) {
            this.setCircleTo9();
        }
        else if (a>125 && a<155) {
            this.setCircleTo10();
        }
      }
    });

  }

  polarToCartesian(angle) {
    let r = this.props.dialRadius;
    let hC = this.props.xCenter;
    let a = (angle-90) * Math.PI / 180.0;

    let x = hC + (r * Math.cos(a));
    let y = hC + (r * Math.sin(a));
    return {x,y};
  }

  cartesianToPolar(x,y) {
    let hC = this.props.dialRadius + this.props.btnRadius;

    if (x === 0) {
      return y>hC ? 0 : 180;
    }
    else if (y === 0) {
      return x>hC ? 90 : 270;
    }
    else {
      return (Math.round((Math.atan((y-hC)/(x-hC)))*180/Math.PI) + (x>hC ? 90 : 270));
    }
  }

  emptyCircle = () => {
    this.setState({initCircleText1: ""});
    this.setState({initCircleText2: ""});
    this.setState({initCircleText3: ""});
    this.props.callbackFromParent('#085d87', '#27c7bb', 0);
  }

  setCircleTo0 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 210});
    this.setState({midCircleText1: "0"});
    this.setState({midCircleText2: ""});
    this.setState({midCircleText3: "No_Pain"});
    this.setState({midCircleText4: ""});
    this.props.callbackFromParent('#085d87', '#27c7bb', 0);
    }

  setCircleTo1 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 240});
    this.setState({midCircleText1: "1"});
    this.setState({midCircleText2: "My_pain"});
    this.setState({midCircleText3: "is_barely"});
    this.setState({midCircleText4: "noticeable"});
    this.props.callbackFromParent('#085d87', '#31e264', 1);
    }

    setCircleTo2 = () => {
        if(this.state.initCircleText1 !== ""){
            this.emptyCircle();
        }
      this.setState({angle: 270}); 
      this.setState({midCircleText1: "2"});
      this.setState({midCircleText2: "My_pain"});
      this.setState({midCircleText3: "is_light_and"});
      this.setState({midCircleText4: "infrequent"});
      this.props.callbackFromParent('#088729', '#94dd3e', 2);
      }

    setCircleTo3 = () => {
        if(this.state.initCircleText1 !== ""){
            this.emptyCircle();
        }
      this.setState({angle: 300});
      this.setState({midCircleText1: "3"});
      this.setState({midCircleText2: "My_pain_is"});
      this.setState({midCircleText3: "bothering_but_can"}); 
      this.setState({midCircleText4: "be_ignored"});
      this.props.callbackFromParent('#088729', '#f2e41f' ,3);
      }

    setCircleTo4 = () => {
        if(this.state.initCircleText1 !== ""){
            this.emptyCircle();
        }
      this.setState({angle: 330});
      this.setState({midCircleText1: "4"});
      this.setState({midCircleText2: "My_pain_is"});
      this.setState({midCircleText3: "constant_but_not"}); 
      this.setState({midCircleText4: "too_limiting"});
      this.props.callbackFromParent('#eb6812', '#fae338', 4);
      }

    setCircleTo5 = () => {
        if(this.state.initCircleText1 !== ""){
            this.emptyCircle();
        }
      this.setState({angle: 359});
      this.setState({midCircleText1: "5"});
      this.setState({midCircleText2: "My_pain"});
      this.setState({midCircleText3: "controls_my"}); 
      this.setState({midCircleText4: "attention"});
      this.props.callbackFromParent('#df3b00', '#fae338', 5);
      }

  setCircleTo6 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 30});
    this.setState({midCircleText1: "6"});
    this.setState({midCircleText2: "My_pain_is"});
    this.setState({midCircleText3: "interfering_with"}); 
    this.setState({midCircleText4: "my_life"});
    this.props.callbackFromParent('#ee2902', '#fad038', 6);
    }

  setCircleTo7 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 60});
    this.setState({midCircleText1: "7"});
    this.setState({midCircleText2: "My_pain_is"});
    this.setState({midCircleText3: "deteriorating"}); 
    this.setState({midCircleText4: "my_lifestyle"});
    this.props.callbackFromParent('#c30c00', '#fad038', 7);
    }

  setCircleTo8 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 90});
    this.setState({midCircleText1: "8"});
    this.setState({midCircleText2: "My_pain_is"});
    this.setState({midCircleText3: "very_strong_I"}); 
    this.setState({midCircleText4: "can’t_function"});
    this.props.callbackFromParent('#ad0101', '#ff9f00', 8);
    }

  setCircleTo9 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 120});
    this.setState({midCircleText1: "9"});
    this.setState({midCircleText2: "My_pain_is"});
    this.setState({midCircleText3: "unbearable_and_I"}); 
    this.setState({midCircleText4: "can_barely_move"});
    this.props.callbackFromParent('#ad0505', '#ff7b00', 9);
    }

  setCircleTo10 = () => {
    if(this.state.initCircleText1 !== ""){
        this.emptyCircle();
    }
    this.setState({angle: 150});
    this.setState({midCircleText1: "10"});
    this.setState({midCircleText2: "My_pain"});
    this.setState({midCircleText3: "requires_emergency"}); 
    this.setState({midCircleText4: "attention1"});
    this.props.callbackFromParent('#a20000', '#ff4c00', 10);
    }


  render() {
    let width = Dimensions.get('window').width;

    let bR = this.props.btnRadius;
    let dR = this.props.dialRadius;
    let startCoord = this.polarToCartesian(210);
    let endCoordForBackArch = this.polarToCartesian(150);

    let centerOfCircleX = width/2;
    let centerOfCircleY = (width/2)+10;

    let endCoord = 0;
    if(180<this.state.angle && this.state.angle<210){
      endCoord = this.polarToCartesian(210);
    }
    else if(150<this.state.angle && this.state.angle<180){
      endCoord = this.polarToCartesian(150);
    }
    else{
      endCoord = this.polarToCartesian(this.state.angle);
    }

    return (
      <View >
      
      <Svg
     
        ref="circleslider"
        width={width}
        height={width}>

        <Text x={centerOfCircleX-125}
          y={centerOfCircleY+150}
          fontSize={16}
          fill={this.props.numbersColor}
          textAnchor="middle">{strings('CircleSlider.No_Pain')}</Text>

        <Text x={centerOfCircleX-80}
          y={centerOfCircleY+150}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">0</Text>

        <Circle r={50}
          cx={centerOfCircleX-80}
          cy={centerOfCircleY+120}
          fill='none'
          onPress = {this.setCircleTo0}/>

          <Text
            x={centerOfCircleX-139.2}
            y={centerOfCircleY+80}
            fontSize={25}
            fill={this.props.numbersColor}
            textAnchor="middle">1</Text>

          <Circle r={40}
            cx={centerOfCircleX-139.2}
            cy={centerOfCircleY+80}
            fill='none'
            onPress = {this.setCircleTo1}/>

          <Text x={centerOfCircleX-160}
            y={centerOfCircleY}
            fontSize={25}
            fill={this.props.numbersColor}
            textAnchor="middle">2</Text>

          <Circle r={40}
            cx={centerOfCircleX-145}
            cy={centerOfCircleY}
            fill='none'
            onPress = {this.setCircleTo2}/>

          <Text x={centerOfCircleX-139.2}
            y={centerOfCircleY-80}
            fontSize={25}
            fill={this.props.numbersColor}
            textAnchor="middle">3</Text>

          <Circle r={40}
            cx={centerOfCircleX-139.2}
            cy={centerOfCircleY-80}
            fill='none'
            onPress = {this.setCircleTo3}/>

          <Text x={centerOfCircleX-80}
            y={centerOfCircleY-139.2}
            fontSize={25}
            fill={this.props.numbersColor}
            textAnchor="middle">4</Text>

          <Circle r={40}
            cx={centerOfCircleX-80}
            cy={centerOfCircleY-139.2}
            fill='none'
            onPress = {this.setCircleTo4}/>

          <Text onPress = {this.updateText}
           x={centerOfCircleX}
            y={centerOfCircleY-160}
            fontSize={25}
            fill={this.props.numbersColor}
            textAnchor="middle">5</Text>

        <Circle r={40}
          cx={centerOfCircleX}
          cy={centerOfCircleY-150}
          fill='none'
          onPress = {this.setCircleTo5}/>

        <Text x={centerOfCircleX+80}
          y={centerOfCircleY-139.2}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">6</Text>

        <Circle r={40}
          cx={centerOfCircleX+80}
          cy={centerOfCircleY-139.2}
          fill='none'
          onPress = {this.setCircleTo6}/>

        <Text x={centerOfCircleX+139.2}
          y={centerOfCircleY-80}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">7</Text>

        <Circle r={40}
          cx={centerOfCircleX+139.2}
          cy={centerOfCircleY-80}
          fill='none'
          onPress = {this.setCircleTo7}/>

        <Text x={centerOfCircleX+160}
          y={centerOfCircleY}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">8</Text>

        <Circle r={40}
          cx={centerOfCircleX+145}
          cy={centerOfCircleY}
          fill='none'
          onPress = {this.setCircleTo8}/>

        <Text x={centerOfCircleX+139.2}
          y={centerOfCircleY+80}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">9</Text>

        <Circle r={40}
          cx={centerOfCircleX+139.2}
          cy={centerOfCircleY+80}
          fill='none'
          onPress = {this.setCircleTo9}/>

        <Text x={centerOfCircleX+80}
          y={centerOfCircleY+150}
          fontSize={25}
          fill={this.props.numbersColor}
          textAnchor="middle">10</Text>

        <Circle r={50}
          cx={centerOfCircleX+80}
          cy={centerOfCircleY+120}
          fill='none'
          onPress = {this.setCircleTo10}/>


     
  
    
        <Text x={centerOfCircleX+130}
          y={centerOfCircleY+150}
          fontSize={16}
          fill={this.props.numbersColor}
          textAnchor="middle">{strings('CircleSlider.painful')}</Text>
 
 
          <Circle r={dR-25}
            cx={width/2}
            cy={width/2}
            fill='white'/>
            <G  writing-mode="rl">
            <Text x={width/2}
              y={(width/2)-20}
              fontSize={28}
              style={{fontWeight: "bold"}}
              writing-mode ={lr}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.initCircleText1)}</Text>
 </G>
            <Text x={width/2}
              y={(width/2)+10}
              fontSize={28}
              style={{fontWeight: "bold"}}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.initCircleText2)}</Text>

            <Text x={width/2}
              y={(width/2)+40}
              fontSize={28}
              style={{fontWeight: "bold"}}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.initCircleText3)}</Text>

            <Text x={width/2}
              y={(width/2)-40}
              fontSize={45}
              style={{fontWeight: "bold"}}
              fill={this.props.textColor}
              textAnchor="middle"
            >{this.props.onValueChange(this.state.midCircleText1)}</Text>

            <Text x={width/2}
              y={(width/2)-5}
              fontSize={20}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.midCircleText2)}</Text>

            <Text x={width/2}
              y={(width/2)+20}
              fontSize={20}
              style={{fontWeight: "bold"}}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.midCircleText3)}</Text>

            <Text x={width/2}
              y={(width/2)+45}
              fontSize={20}
              style={{fontWeight: "bold"}}
              fill={this.props.textColor}
              textAnchor="middle"
            >{strings('CircleSlider.' + this.state.midCircleText4)}</Text>


            {/* touch pan route */}
            <Path stroke={this.props.meterColor}
            fill='none'
            stroke-linejoin="round"
            strokeWidth={10}
            scale="1"
            stroke='rgba(255, 255, 255, 0.3)'
            d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 1 1 ${endCoordForBackArch.x} ${endCoordForBackArch.y}`}/>

        {/* touch pan path */}
        <Path stroke={this.props.meterColor}
          strokeWidth={this.props.dialWidth}
          fill='none'
          stroke-line-join='round'
          d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${this.state.angle>=180?0:1} 1 ${endCoord.x} ${endCoord.y}`}/>

        {/* touch pan */}
        <G x={endCoord.x-bR} y={endCoord.y-bR}>
        <Circle r={bR+36}
          cx={bR}
          cy={bR}
          fill='none'
          {...this._panResponder.panHandlers}/>
          <Circle r={bR}
            cx={bR}
            cy={bR}
            fill={this.props.meterColor}/>
          <Circle r={bR-6}
            cx={bR}
            cy={bR}
            fill='black'/>

        </G> 
      </Svg>
    </View>
    )
  }
}

CircleSlider.defaultProps = {
  btnRadius: 20,
  dialRadius: 125,
  dialWidth: 10,
  meterColor: 'white',
  numbersColor: 'white',
  xCenter: Dimensions.get('window').width/2,
  yCenter: (Dimensions.get('window').height/2)-10,
  onValueChange: x => x,
}

