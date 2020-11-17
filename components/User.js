import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView, 
  ScrollView
} from 'react-native';

import { Subtitle,Title } from 'native-base';

import { showMessage, hideMessage } from "react-native-flash-message";

import * as Progress from 'react-native-progress';

import { connect } from 'react-redux';

import { UserAction } from '../redux/UserActions';
import { LoadUser } from '../redux/LoadUser';
import { bindActionCreators } from 'redux';

//import Bodyy from "react-native-body-highlighter";
import Stats from "./user/Stats"

import AsyncStorage from '@react-native-community/async-storage';

import Svg, { Polygon, Path } from "react-native-svg";
import LinearGradient from 'react-native-linear-gradient'
const { height, width } = Dimensions.get('window')

const exercices = [
  {
    name:"Bench press",
    muscles: [
      {slug:"chest",intensity:1},
      {slug:"front-deltoids",intensity:2},
      {slug:"triceps",intensity:2}
    ]
  }
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class User extends React.Component {

 constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  
  //PERMANENT STORE AND GET DATA ON MACHINE FOR SESSIONS AUTOCONNECT
  storeData = async () => {
    try {await AsyncStorage.setItem('persistant', JSON.stringify(this.props.state.user))
    } catch (e) {console.log('saving error',e)}
  }

  getData = async () => {
    try {const value = await AsyncStorage.getItem('persistant')
      if(value !== null) {//console.log(value)
      this.props.LoadUser(JSON.parse(value))}
    } catch(e) {console.log('error reading value',e)}
  };

  componentDidMount(){
    //this.getData()
    setInterval(() => {//console.log('SAVED !')
      this.storeData();
    }, 60000);
  }

  calculatePods(){
    var pods= 0;
    this.props.state.user.items.forEach(item => {
      pods += item["poids"]
    });
  }

  //PERMANENT STORE AND GET DATA ON MACHINE FOR SESSIONS AUTOCONNECT
  //storeData();
  //getData();

  render() {
  
    var bodyRender = <TouchableOpacity style={{position: "absolute",
    flex: 1,
    textAlign: 'center',justifyContent: 'center',alignItems: 'center',
    top: 200,
    }}>{body.map((bodyPart)=>{return <Svg style={{position: "absolute",left: 10,}} key={bodyPart.slug} height="200" width={100}>
              {bodyPart.pointsArray.map((points)=>{return <Polygon key={points} fill={this.props.state.user.body[bodyPart.slug] == 0 ? '#b2bec3' : '#6F0000'} points={points} />})}
            </Svg>})}</TouchableOpacity>


    return (
      <SafeAreaView>
        <LinearGradient colors={['#222222','#222222' ]}
        style={{
    alignItems: 'center',
    justifyContent: 'center',}}
        start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}  >
          <ScrollView>
            <Stats/>
            {bodyRender}
            <View style={{textAlign: 'center',justifyContent: 'center',alignItems: 'center',marginTop:30,paddingTop:30,marginBottom:30,paddingBottom:30,borderTopWidth:1,borderTopColor:"#b2bec3"}}>
              <Subtitle style={{color:'#b2bec3'}}>Weaver : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["weaver"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
              <Subtitle style={{color:'#b2bec3'}}>Cooking : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["cooking"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
              <Subtitle style={{color:'#b2bec3'}}>Engineer : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["enginer"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
              <Subtitle style={{color:'#b2bec3'}}>Shooter : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["shooter"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
              <Subtitle style={{color:'#b2bec3'}}>Brawler : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["brawler"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
              <Subtitle style={{color:'#b2bec3'}}>infiltration : </Subtitle>
              <View style={{padding:10}}><Progress.Bar progress={this.props.state.user.job["infiltration"]/100} width={width-40} height={4} color='#b2bec3' style={{padding:1,color:'#b2bec3'}}/></View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }



}

const body=[
  // Chest
  {
    slug: "chest",
    color: "#b2bec3",
    pointsArray: [
      "51.8367347 41.6326531 51.0204082 55.1020408 57.9591837 57.9591837 67.755102 55.5102041 70.6122449 47.3469388 62.0408163 41.6326531 ",
      "29.7959184 46.5306122 31.4285714 55.5102041 40.8163265 57.9591837 48.1632653 55.1020408 47.755102 42.0408163 37.5510204 42.0408163"
    ]
  },

  // Obliques
  {
    slug: "obliques",
    color: "#b2bec3",
    pointsArray: [
      "68.5714286 63.2653061 67.3469388 57.1428571 58.7755102 59.5918367 60 64.0816327 60.4081633 83.2653061 65.7142857 78.7755102 66.5306122 69.7959184",
      "33.877551 78.3673469 33.0612245 71.8367347 31.0204082 63.2653061 32.244898 57.1428571 40.8163265 59.1836735 39.1836735 63.2653061 39.1836735 83.6734694"
    ]
  },

  // abs
  {
    slug: "abs",
    color: "#b2bec3",
    pointsArray: [
      "56.3265306 59.1836735 57.9591837 64.0816327 58.3673469 77.9591837 58.3673469 92.6530612 56.3265306 98.3673469 55.1020408 104.081633 51.4285714 107.755102 51.0204082 84.4897959 50.6122449 67.3469388 51.0204082 57.1428571",
      "43.6734694 58.7755102 48.5714286 57.1428571 48.9795918 67.3469388 48.5714286 84.4897959 48.1632653 107.346939 44.4897959 103.673469 40.8163265 91.4285714 40.8163265 78.3673469 41.2244898 64.4897959"
    ]
  },

  // Biceps
  {
    slug: "biceps",
    color: "#b2bec3",
    pointsArray: [
      "16.7346939 68.1632653 17.9591837 71.4285714 22.8571429 66.122449 28.9795918 53.877551 27.755102 49.3877551 20.4081633 55.9183673",
      "71.4285714 49.3877551 70.2040816 54.6938776 76.3265306 66.122449 81.6326531 71.8367347 82.8571429 68.9795918 78.7755102 55.5102041"
    ]
  },

  // Triceps
  {
    slug: "triceps",
    color: "#b2bec3",
    pointsArray: [
      "69.3877551 55.5102041 69.3877551 61.6326531 75.9183673 72.6530612 77.5510204 70.2040816 75.5102041 67.3469388",
      "22.4489796 69.3877551 29.7959184 55.5102041 29.7959184 60.8163265 22.8571429 73.0612245"
    ]
  },

  // neck
  {
    slug: "neck",
    color: "#b2bec3",
    pointsArray: [
      "55.5102041 23.6734694 50.6122449 33.4693878 50.6122449 39.1836735 61.6326531 40 70.6122449 44.8979592 69.3877551 36.7346939 63.2653061 35.1020408 58.3673469 30.6122449",
      "28.9795918 44.8979592 30.2040816 37.1428571 36.3265306 35.1020408 41.2244898 30.2040816 44.4897959 24.4897959 48.9795918 33.877551 48.5714286 39.1836735 37.9591837 39.5918367"
    ]
  },

  // Front deltoids
  {
    slug: "front-deltoids",
    color: "#b2bec3",
    pointsArray: [
      "78.3673469 53.0612245 79.5918367 47.755102 79.1836735 41.2244898 75.9183673 37.9591837 71.0204082 36.3265306 72.244898 42.8571429 71.4285714 47.3469388",
      "28.1632653 47.3469388 21.2244898 53.0612245 20 47.755102 20.4081633 40.8163265 24.4897959 37.1428571 28.5714286 37.1428571 26.9387755 43.2653061"
    ]
  },

  // Head
  {
    slug: "head",
    color: "#b2bec3",
    pointsArray: [
      "42.4489796 2.85714286 40 11.8367347 42.0408163 19.5918367 46.122449 23.2653061 49.7959184 25.3061224 54.6938776 22.4489796 57.5510204 19.1836735 59.1836735 10.2040816 57.1428571 2.44897959 49.7959184 0"
    ]
  },

  // Abductors
  {
    slug: "abductors",
    color: "#b2bec3",
    pointsArray: [
      "52.6530612 110.204082 54.2857143 124.897959 60 110.204082 62.0408163 100 64.8979592 94.2857143 60 92.6530612 56.7346939 104.489796",
      "47.755102 110.612245 44.8979592 125.306122 42.0408163 115.918367 40.4081633 113.061224 39.5918367 107.346939 37.9591837 102.44898 34.6938776 93.877551 39.5918367 92.244898 41.6326531 99.1836735 43.6734694 105.306122"
    ]
  },

  // Quadriceps
  {
    slug: "quadriceps",
    color: "#b2bec3",
    pointsArray: [
      "34.6938776 98.7755102 37.1428571 108.163265 37.1428571 127.755102 34.2857143 137.142857 31.0204082 132.653061 29.3877551 120 28.1632653 111.428571 29.3877551 100.816327 32.244898 94.6938776",
      "63.2653061 105.714286 64.4897959 100 66.9387755 94.6938776 70.2040816 101.22449 71.0204082 111.836735 68.1632653 133.061224 65.3061224 137.55102 62.4489796 128.571429 62.0408163 111.428571",
      "38.7755102 129.387755 38.3673469 112.244898 41.2244898 118.367347 44.4897959 129.387755 42.8571429 135.102041 40 146.122449 36.3265306 146.530612 35.5102041 140",
      "59.5918367 145.714286 55.5102041 128.979592 60.8163265 113.877551 61.2244898 130.204082 64.0816327 139.591837 62.8571429 146.530612",
      "32.6530612 138.367347 26.5306122 145.714286 25.7142857 136.734694 25.7142857 127.346939 26.9387755 114.285714 29.3877551 133.469388",
      "71.8367347 113.061224 73.877551 124.081633 73.877551 140.408163 72.6530612 145.714286 66.5306122 138.367347 70.2040816 133.469388"
    ]
  },

  // Knees
  {
    slug: "knees",
    color: "#b2bec3",
    pointsArray: [
      "33.877551 140 34.6938776 143.265306 35.5102041 147.346939 36.3265306 151.020408 35.1020408 156.734694 29.7959184 156.734694 27.3469388 152.653061 27.3469388 147.346939 30.2040816 144.081633",
      "65.7142857 140 72.244898 147.755102 72.244898 152.244898 69.7959184 157.142857 64.8979592 156.734694 62.8571429 151.020408"
    ]
  },

  // calves
  {
    slug: "calves",
    color: "#b2bec3",
    pointsArray: [
      "71.4285714 160.408163 73.4693878 153.469388 76.7346939 161.22449 79.5918367 167.755102 78.3673469 187.755102 79.5918367 195.510204 74.6938776 195.510204",
      "24.8979592 194.693878 27.755102 164.897959 28.1632653 160.408163 26.122449 154.285714 24.8979592 157.55102 22.4489796 161.632653 20.8163265 167.755102 22.0408163 188.163265 20.8163265 195.510204",
      "72.6530612 195.102041 69.7959184 159.183673 65.3061224 158.367347 64.0816327 162.44898 64.0816327 165.306122 65.7142857 177.142857",
      "35.5102041 158.367347 35.9183673 162.44898 35.9183673 166.938776 35.1020408 172.244898 35.1020408 176.734694 32.244898 182.040816 30.6122449 187.346939 26.9387755 194.693878 27.3469388 187.755102 28.1632653 180.408163 28.5714286 175.510204 28.9795918 169.795918 29.7959184 164.081633 30.2040816 158.77551"
    ]
  },

  // Forearm
  {
    slug: "forearm",
    color: "#b2bec3",
    pointsArray: [
      "6.12244898 88.5714286 10.2040816 75.1020408 14.6938776 70.2040816 16.3265306 74.2857143 19.1836735 73.4693878 4.48979592 97.5510204 0 100",
      "84.4897959 69.7959184 83.2653061 73.4693878 80 73.0612245 95.1020408 98.3673469 100 100.408163 93.4693878 89.3877551 89.7959184 76.3265306",
      "77.5510204 72.244898 77.5510204 77.5510204 80.4081633 84.0816327 85.3061224 89.7959184 92.244898 101.22449 94.6938776 99.5918367",
      "6.93877551 101.22449 13.4693878 90.6122449 18.7755102 84.0816327 21.6326531 77.1428571 21.2244898 71.8367347 4.89795918 98.7755102"
    ]
  }
];



const mapStateToProps = (state) => {
  return { state }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    UserAction,
    LoadUser,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(User);