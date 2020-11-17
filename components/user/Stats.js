import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView, 
  ScrollView
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { showMessage, hideMessage } from "react-native-flash-message";

import { connect } from 'react-redux';

import { UserAction } from '../../redux/UserActions';
import { DeleteItem } from '../../redux/DeleteItem';
import { bindActionCreators } from 'redux';

//import Bodyy from "react-native-body-highlighter";


const { height, width } = Dimensions.get('window')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Stats extends React.Component {


 constructor(props) {
    super(props);

    this.state = {

      items:[],
      stats:{
        "vie":45,
        "faim":2,//33,
        "soif":72,
        "energie":44,//
        "poids":12,
        "poids max":100,
        "température":77,
        "vent":10,
    },
    vetement:{
        "bonnet":10,
        "pull":10,
        "manteau":10,
        "gant":10,
        "pantalon":10,
        "chaussure":10,
    },
      
    };
  }

  componentDidMount(){
    setInterval(() => {
      if (this.props.state.user.stats["faim"] > 0 ){ this.props.state.user.stats["faim"]=this.props.state.user.stats["faim"]-0.1*this.props.state.user.distance;
      }else{ this.props.state.user.stats["vie"]=this.props.state.user.stats["vie"]-0.1*this.props.state.user.distance};

      if (this.props.state.user.stats["soif"] > 0 ){ this.props.state.user.stats["soif"]=this.props.state.user.stats["soif"]-0.1*this.props.state.user.distance; 
      }else{ this.props.state.user.stats["vie"]=this.props.state.user.stats["vie"]-0.2*this.props.state.user.distance};

      var freezeProtection = 1;
      var weight = 0;
      for (item in this.props.state.user.items) {
        //DURABILITY
        if(!this.props.state.user.items[item].durability){
          this.props.state.user.items[item].durability = getRandomInt(5,100)
        }else{
          for (let index = 0; index < this.props.state.user.distance; index++) {
            if(this.props.state.user.items[item]){
              if(getRandomInt(0,11) == 10) this.props.state.user.items[item].durability = this.props.state.user.items[item].durability-1
              if(this.props.state.user.items[item].durability <= 0 ) this.props.DeleteItem(item)
            }
          }
        }
        //WEIGHT
        if(this.props.state.user.items[item]){
          weight += this.props.state.user.items[item].poids;
          if(this.props.state.user.items[item].equiped == 1){
            freezeProtection += this.props.state.user.items[item].value;
          }
        }
      }
      if(weight < 1){
        weight = 1;
      }
      this.props.state.user.stats["poids"] = weight;

      this.props.state.user.stats["vent"] += getRandomInt(-2,2)
      if(this.props.state.user.stats["vent"] > 100 ) this.props.state.user.stats["vent"] = 100;
      if(this.props.state.user.stats["vent"] < 0 ) this.props.state.user.stats["vent"] = 0;

      if(this.props.state.user.nearFire && typeof this.props.state.user.nearFire === 'number' ){
        if (this.props.state.user.stats["température"] < 100 ){this.props.state.user.stats["température"]+=this.props.state.user.nearFire.intensity;}
      }else{
        if (this.props.state.user.stats["température"] > 0 ){ this.props.state.user.stats["température"]=this.props.state.user.stats["température"]-((0.1*this.props.state.user.distance)/freezeProtection); 
        }else{ this.props.state.user.stats["vie"]=this.props.state.user.stats["vie"]-0.2*this.props.state.user.distance};
      }

      if (this.props.state.user.stats["energie"] > 0 ){ this.props.state.user.stats["energie"]=this.props.state.user.stats["energie"]-(this.props.state.user.distance == 1 ? 0 : (this.props.state.user.distance/10)*(1+(weight/50))); 
      }//else{ this.props.state.user.stats["vie"]=this.props.state.user.stats["vie"]-0.2*this.props.state.user.distance};
      if (this.props.state.user.stats["energie"] < 100 ){console.log(this.props.state.user.rest);
        if (this.props.state.user.rest == 1) this.props.state.user.stats["energie"] += 1
      }

      if (this.props.state.user.stats["vie"] > 0 ){ this.props.state.user.stats["vie"]=this.props.state.user.stats["vie"]+0.01*this.props.state.user.distance };

      this.props.UserAction(this.props.state.user.stats,this.props.state.user.items);
      this.setState({})
      //this.props.state.user.stats["vie"] < 0 ?? this.props.state.user.stats["vie"]-2;
    }, 1000);

    setInterval(() => {

      if(this.props.state.user.stats["faim"] <= 0 ){showMessage({message: "Danger !",description: "Vous mourrez de faim..",type: "danger",});}else if(this.props.state.user.stats["faim"] < 15 ){showMessage({message: "Attention !",description: "Vous avez très faim..",type: "warning",});};

      if(this.props.state.user.stats["soif"] <= 0 ){showMessage({message: "Danger !",description: "Vous mourrez de soif..",type: "danger",});}else if(this.props.state.user.stats["soif"] < 15 ){showMessage({message: "Attention !",description: "Vous avez très soif..",type: "warning",});};

      if(this.props.state.user.stats["température"] <= 0 ){showMessage({message: "Danger !",description: "Vous mourrez de froid..",type: "danger",});}else if(this.props.state.user.stats["température"] < 15 ){showMessage({message: "Attention !",description: "Vous avez très froid..",type: "warning",});};

    }, 60000);
    
  }

  //PERMANENT STORE AND GET DATA ON MACHINE FOR SESSIONS AUTOCONNECT
  //storeData();
  //getData();

  render() {
    var state = this.state;
    var stats = <View style={{textAlign: 'center',alignItems: 'flex-end',paddingTop:30}}>
    <View style={{flex:1,flexDirection: 'row'}}>
      <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={this.props.state.user.stats["vie"] ? this.props.state.user.stats["vie"] : 0} tintColor="#BF2525" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["vie"] < 5 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Life </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
      <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={this.props.state.user.stats["energie"] ? this.props.state.user.stats["energie"] : 0} tintColor="#BEBB10" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["energie"] < 5 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Energy </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
    </View>
    <View style={{flex:1,flexDirection: 'row'}}>
      <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={this.props.state.user.stats["soif"] ? this.props.state.user.stats["soif"] : 0} tintColor="#00e0ff" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["soif"] < 5 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Thirst </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
        <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={this.props.state.user.stats["faim"] ? this.props.state.user.stats["faim"] : 0} tintColor="#523711" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["faim"] < 5 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Hunger </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
    </View>
    <View style={{flex:1,flexDirection: 'row'}}>
      <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={this.props.state.user.stats["température"] ? this.props.state.user.stats["température"] : 0} tintColor="#6A10BE" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["température"] < 5 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Body's heat </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
      <TouchableOpacity><AnimatedCircularProgress prefill={0} duration={5000} size={100} width={3} padding={5} fill={(this.props.state.user.stats["poids"]/this.props.state.user.stats["poids max"])*100} tintColor="#D800C7" backgroundColor="#b2bec3">{ (fill) => ( <Text style={this.props.state.user.stats["poids"] > this.props.state.user.stats["poids max"]-10 ? {color:"#BF2525"} : {color:"#b2bec3"}}> Weight </Text> )  }</AnimatedCircularProgress></TouchableOpacity>
    </View>
    </View>



    return (
      <SafeAreaView>
        {stats}
      </SafeAreaView>
    );
  }



}




const mapStateToProps = (state) => {
  return { state }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    UserAction,
    DeleteItem,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Stats);