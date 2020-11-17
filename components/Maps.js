import React from "react";
import {StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert, Modal, TouchableHighlight, ImageBackground, ScrollView , SafeAreaView } from 'react-native';
import { Button, /*Icon, */Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height, width } = Dimensions.get('window')
import geoViewport from 'geo-viewport'

import MapView, { Polyline, PROVIDER_GOOGLE, Marker, } from 'react-native-maps';
import mapStyleNight from './mapNight.json';
import mapStyle from './mapStyle.json';

import { showMessage } from "react-native-flash-message";
var RNFS = require('react-native-fs');

import addItemFnc from './functionItem/addItem';
import Snow from 'react-native-snow';

//import MapViewDirections from 'react-native-maps-directions';

import { connect } from 'react-redux';

import { AddDistance } from '../redux/AddDistance';
import { AddItem } from '../redux/AddItem';
import { DeleteItem } from '../redux/DeleteItem';
import { EndEvent } from '../redux/EndEvent';
import { TakeARest } from '../redux/TakeARest';
import { UserAction } from '../redux/UserActions';
import { UpgradeJob } from '../redux/UpgradeJob';

import { bindActionCreators } from 'redux';
import ListMarker from './Marker.json'

const GOOGLE_MAPS_APIKEY = 'AIzaSyCqXQe_lu7MVzxYoCRFELNOXgQRLgmxXCs';


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function lengthdir(xCoord, yCoord, angle, length) {
    length = typeof length !== 'undefined' ? length : 10;
    angle = angle * Math.PI / 180; // if you're using degrees instead of radians
    return [length * Math.cos(angle) + xCoord, length * Math.sin(angle) + yCoord]
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {return deg * (Math.PI/180)} 

// create a path you want to write to
//foo = type 1
//type2 = type 2
var path = RNFS.DocumentDirectoryPath  + '/foo.json';

class Maps extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      player:{"latitude": 37.78248860156281, "longitude": -122.42418073117754},
      first:{"latitude": 37.78248860156281, "longitude": -122.42418073117754},
      lastCoord:{"latitude": 37.78248860156281, "longitude": -122.42418073117754},
      loot:[],
      wayPoints:[],
      inMove:0,
      zoom:1,
      active: false,
      fouille:0,

      event:[],
      fire:[],
      nearFire:undefined,
      nearEvent:undefined,
      fireLength:0,

      items:[],
      modal:undefined,
      
    };
  }

  haveAmmo(type,event){
    var bullets = [];
    for (ammo in this.props.state.user.items) {
      if(this.props.state.user.items[ammo].name == type){
        bullets.push(ammo);
      }
    }
    if(bullets.length >= event.danger){
      return bullets;
    }
    return bullets;
  }

  useAmmo(bullets,proba,fullProtection,weapon){
    var count = 0;
    for (let index = 0; index < bullets.length; index++) {
      count++;
      this.props.DeleteItem(bullets[index])
      if(proba-fullProtection > count*this.props.state.user.items[weapon].value)
        break;
    }
    return count;
  }

  useOneAmmo(bullets){
    var count = 0;
    this.props.DeleteItem(bullets[0])
    return count;
  }

  eventProgress(event,eventNow){
    this.setState({modal:undefined},()=>{
      var title = "Explore"
      var choice = [];
      var endEvent = 0;
      var de = getRandomInt(1,4);
      var bonusDe = 1;
      if(de > 1){
        if(eventNow.choose == "stealth") this.props.UpgradeJob("infiltration");
        if(eventNow.choose == "shoot") this.props.UpgradeJob("shooter");
        if(eventNow.choose == "brawler") this.props.UpgradeJob("brawler");
      }else{
        if(eventNow.choose == "stealth") bonusDe = this.props.state.user.job["infiltration"]/5;
        if(eventNow.choose == "shoot") bonusDe = this.props.state.user.job["shooter"]/5;
        if(eventNow.choose == "brawler") bonusDe = this.props.state.user.job["brawler"]/5;
        if(bonusDe > getRandomInt(1,21)){
          de = 2;
        }
      }
      var proba = getRandomInt(1,25)*event.danger;
      var fullProtection = 1;
      var arrayChoice = [];
      var stats = this.props.state.user.stats;
      if(eventNow.spotted > 0){
        for (protection in this.props.state.user.items) {
          if(this.props.state.user.items[protection]){
            if(this.props.state.user.items[protection].equiped == 1){
              if(this.props.state.user.items[protection].type == "arme"){
                eventNow.weapon = protection;
                eventNow.bullets = this.haveAmmo(this.props.state.user.items[protection].need,event);
              }else{
                fullProtection += this.props.state.user.items[protection].value;
              }
            }
          }
        }
      }
      if((eventNow.choose == "run" && eventNow.spotted == 0) || (eventNow.choose == "run" && eventNow.spotted > 0 && de > 1)){
        endEvent = 1;
      }else if(event.occupants.length > 0){
        if(eventNow.choose == "start"){

          if(de == 1) eventNow.text = "You may see one of the occupants on your way"
          if(de == 2) eventNow.text = "You see a human shadow"
          if(de == 3) eventNow.text = "A human voice breaks the silence"
          if(de == 4) eventNow.text = "You spot footsteps in the shadows"


          arrayChoice = [
            { text: (event.occupants.length <= 0 ? "" : "Run away (100 %)"), onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
            { text: (event.occupants.length <= 0 ? "" : "Assassinate ("+Math.round(30+(this.props.state.user.job["brawler"]/5))+" %)"), onPress: () => {eventNow.choose = "brawler";this.eventProgress(event,eventNow)},icon:"skull"},
            { text: (event.occupants.length <= 0 ? "Loot !" : "Infiltration ("+Math.round(50+(this.props.state.user.job["infiltration"]/5))+"%)"), onPress: () => {eventNow.choose = "stealth";this.eventProgress(event,eventNow)},icon:(event.occupants.length <= 0 ? "treasure-chest" : "ninja")},
          ]
        }else{
          if(eventNow.spotted == 0 && eventNow.choose == "stealth" ){
            if(eventNow.stealthily < event.occupants.length){
              if(de == 2 || de == 3){
                title = "Infiltration.."
                eventNow.stealthily++
                if(de == 1) eventNow.text = "You pass behind an occupant without being spotted\nYou can attempt a surprise attack or continue your infiltration."
                if(de == 2) eventNow.text = "You dodge the occupants without a sound\nYou can attempt a surprise attack or continue your infiltration."
                if(de == 3) eventNow.text = "You pass this difficulty in a whisper\nYou can attempt a surprise attack or continue your infiltration."
                if(de == 4) eventNow.text = "You pass behind an occupant without being spotted\nYou can attempt a surprise attack or continue your infiltration."
                arrayChoice = [
                  { text: (event.occupants.length <= 0 ? "" : "Run away (100%)"), onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
                  { text: (event.occupants.length <= 0 ? "" : "Assassinate ("+Math.round(30+(this.props.state.user.job["brawler"]/5))+" %)"), onPress: () => {eventNow.choose = "brawler";this.eventProgress(event,eventNow)},icon:"skull"},
                  { text: (event.occupants.length <= 0 ? "Loot !" : "Infiltration ("+Math.round(50+(this.props.state.user.job["infiltration"]/5))+"%)"), onPress: () => {eventNow.choose = "stealth";this.eventProgress(event,eventNow)},icon:(event.occupants.length <= 0 ? "treasure-chest" : "ninja")},
                ]
              }else{
                title = "Spotted !"
                if(de == 1) eventNow.text = "An occupant has spotted you and is throwing at you."
                if(de == 2) eventNow.text = "Your opponent freezes and looks at you threateningly. "
                if(de == 3) eventNow.text = "the occupant hears you and goes back in your direction"
                if(de == 4) eventNow.text = "An occupant has spotted you and is throwing at you."
                eventNow.spotted = 1;
                arrayChoice = [
                  { text: "Run away (50%)", onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
                  { text: "Assassinate ("+Math.round(30+(this.props.state.user.job["brawler"]/5))+" %)", onPress: () => {eventNow.choose = "brawler";this.eventProgress(event,eventNow)},icon:"ninja"},
                ]
              }
            }else{
              endEvent = 1
            }
          }else if( eventNow.choose == "brawler" || eventNow.choose == "shoot" || eventNow.choose == "run"){
            if(de == 3 && (eventNow.spotted == 1 || eventNow.spotted == 0)){
              if(event.occupants.length > 0){
                  event.occupants = event.occupants.slice(1,event.occupants.length)
              }
              title = "Assassinate"
              eventNow.stealthily++
              eventNow.spotted = 0;
              eventNow.text = "You eliminate the occupant before he sounds the alarm."
                arrayChoice = [
                  { text: (event.occupants.length <= 0 ? "" : "Run away (100%)"), onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
                  { text: (event.occupants.length <= 0 ? "Loot !" : "Infiltration ("+Math.round(50+(this.props.state.user.job["infiltration"]/5))+"%)"), onPress: () => {eventNow.choose = "stealth";this.eventProgress(event,eventNow)},icon:(event.occupants.length <= 0 ? "treasure-chest" : "ninja")},
                ]
            }else if(de == 1){
              var damage = "no"
              if(eventNow.choose == "shoot"){
                this.useOneAmmo(eventNow.bullets)
                eventNow.bulletShooted++;
              }
              if(fullProtection < proba){
                suffering = proba-fullProtection;
                stats["vie"] -= proba-fullProtection;
                if(stats["vie"] < 0) stats["vie"] = -0.1;
                damage = proba-fullProtection;
                this.props.UserAction(stats)
              }
              if(damage != "no") eventNow.damageReceive += damage;
              title = "Failure"
              eventNow.text = (eventNow.spotted < 2 ? "Your surprise attack is a failure\n": (eventNow.choose == "run" ? "You fail in your escape, and " : eventNow.spotted == 0 ? "you miss your attack\n" : ""))+"The offender attacks you and inflicts you "+damage+" damage"
                arrayChoice = [
                  { text: (event.occupants.length <= 0 ? "" : "Run away (50%)"), onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
                  { text: eventNow.bullets.length > 0 ? (event.occupants.length <= 0 ? "" : "Firearm ("+Math.round(60+(this.props.state.user.job["shooter"]/5))+"%)") : "", onPress: () => {eventNow.choose = "shoot";this.eventProgress(event,eventNow)},icon:"pistol"},
                  { text: (event.occupants.length <= 0 ? "Loot !" : "Brawl ("+Math.round(60+(this.props.state.user.job["brawler"]/5))+"%)"), onPress: () => {eventNow.choose = "brawler";this.eventProgress(event,eventNow)},icon:(event.occupants.length <= 0 ? "treasure-chest" : "karate")},
                ]
              eventNow.spotted = 2;
            }else /*if(de == 2 || de == 3)*/{
              var damage = "no"
              var die = 0;
              if(eventNow.choose == "shoot"){
                this.useOneAmmo(eventNow.bullets)
                damage = this.props.state.user.items[eventNow.weapon].value*(de-1)
                if(damage != "no") eventNow.bulletShooted++;
              }
              if(eventNow.choose == "brawler") {
                damage = this.props.state.user.job["brawler"]*(de-1)
              }
              if(event.occupants.length > 0){
                if(damage > event.occupants[0].hp){
                  event.occupants = event.occupants.slice(1,event.occupants.length)
                }else{
                  event.occupants[0].hp -= damage
                }
              }
              title = (de == 3 ? "Critical success" : "Success")
              eventNow.text = (eventNow.spotted < 2 ? "Your surprise attack is a failure, but you attack your opponent": "Attack is a "+(de == 3 ? "critical" : "")+" success")+", you inflict "+damage+" damages on one of the occupants\nIt remains "+event.occupants.length+" occupants"
                arrayChoice = [
                  { text: (event.occupants.length <= 0 ? "" : "Run away (50%)"), onPress: () => {eventNow.choose = "run";this.eventProgress(event,eventNow)},icon:"run-fast"},
                  { text: eventNow.bullets.length > 0 ? (event.occupants.length <= 0 ? "" : "Firearm ("+Math.round(60+(this.props.state.user.job["shooter"]/5))+"%)") : "", onPress: () => {eventNow.choose = "shoot";this.eventProgress(event,eventNow)},icon:"pistol"},
                  { text: (event.occupants.length <= 0 ? "Loot !" : "Brawl ("+Math.round(60+(this.props.state.user.job["brawler"]/5))+"%)"), onPress: () => {eventNow.choose = "brawler";this.eventProgress(event,eventNow)},icon:(event.occupants.length <= 0 ? "treasure-chest" : "karate") },
                ]
              eventNow.spotted = 2;
            }
          }
        }
      }else{endEvent = 1}
      if(eventNow.choose == "run"){
        this.setState({modal:{
          title:"You ran away",
          text:"You has gone this building "+(eventNow.spotted < 0 ? "\nDuring your fight you have suffered "+(eventNow.damageReceive)+" damages and shoot "+eventNow.bulletShooted+" bullets" : ''),
          button:[{ text: "QUIT", onPress: () => {this.closeModal()} ,icon:"exit-run"}],
          }})
      }else{
        if(endEvent == 0){
          this.setState({modal:{
            title:title,
            text:eventNow.text,
            button:arrayChoice,
          }})
        }else{
          this.props.EndEvent({stats:stats,items:event.items,exploreEvent:event.i});
          this.setState({modal:{
            title:(event.items.length > 0 ? "Congratulations" : "Damn")+" !",
            text:"You has explore this building "+(eventNow.spotted < 0 ? "\nDuring your fight you have suffered "+((eventNow.damageReceive))+" damages and shoot "+eventNow.bulletShooted+" bullets \nYou found :" : "and found :")+(event.items.length > 0 ? (event.items.map((item) => {return "\n--------------------------\n"+item.name+(item.value && item.label ? ("\n\n- "+item.label+" +"+((item.value[0]) ? item.value[0]: item.value)+(item.value[1] ? "\n- Food +"+item.value[1] : "") )  : "")+"\n\nWeight : "+item.poids+" Kg"+(item.durability ? "\nDurability : "+item.durability+" %" : "")})) : "NOTHING"),
            button:[{ text: "QUIT", onPress: () => {this.closeModal()}  }],
          }})
        }
      }
    })
  }

  closeModal(){
    this.setState({modal:undefined})
  }

  chooseEvent(event){
    var props = this.props;
    var tthis = this;
    Alert.alert(
      "Warning !",
      "Are you sure you want to explore this building \nDangerosity : ("+event.danger+"/5)",
      [
        {
          text: "No",
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
          var eventNow = {};
          eventNow.spotted = 0;
          eventNow.weapon = undefined;
          eventNow.bullets = 0;
          eventNow.choose = "start";
          eventNow.stealthily = 0;
          eventNow.bulletShooted = 0;
          eventNow.damageReceive = 0;
          this.eventProgress(event,eventNow)
        } 
      }
    ],
    { cancelable: false }
    );
  }


  componentDidMount(){
    ListMarker.forEach((element,index) => {
      ListMarker[index].danger = getRandomInt(0,5);
      ListMarker[index].occuped = getRandomInt(0,2);
      ListMarker[index].occupants = []
      for (let occupant = 0; occupant <= ListMarker[index].danger; occupant++) {
        if(ListMarker[index].danger > 0)
          ListMarker[index].occupants.push({hp:getRandomInt(0,25)*ListMarker[index].danger,damage:getRandomInt(0,25)*ListMarker[index].danger})
      }
      var listItemsEvent = [];
      for (let index = 0; index < getRandomInt(10,20)*(ListMarker[index].danger+1); index++) {
        let item = addItemFnc();
        if(item)
          listItemsEvent.push(item);
      }
      ListMarker[index].items = listItemsEvent;
    });
    this.setState({event:ListMarker,
      player:{"latitude": this.props.state.user.latitude, "longitude": this.props.state.user.longitude},
      first:{"latitude": this.props.state.user.latitude, "longitude": this.props.state.user.longitude},
      lastCoord:{"latitude": this.props.state.user.latitude, "longitude": this.props.state.user.longitude},
})
    //RNFS.readFile(path, 'utf8').then((success) => {})
    this.Zoom()
  }

  render() {
    if(this.state.modal){
      var modal =<View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} /*visible={modalVisible}*/ >
          <View style={styles.centeredView}>
            <View style={{...styles.modalView,width : Dimensions.get('window').width *0.8,height : Dimensions.get('window').height *0.6}}>
              <Text style={styles.modalTextTitle}>{this.state.modal.title}</Text>
                <SafeAreaView style={{height:Math.round(350-(this.state.modal.button.length*50))}}>
                  <ScrollView>
                    <Text style={styles.modalText}>{this.state.modal.text}</Text>
                  </ScrollView>
                </SafeAreaView>
                <View style={{/*flex:1, flexDirection: 'row',*/bottom:30,position:"absolute"}}>
                  {this.state.modal.button.map((button) =>{ return button.text.length > 0 ? <TouchableHighlight key={button.text}
                    style={{ ...styles.openButton, backgroundColor: "#222222",color:"#b2bec3",height:40 }}
                    onPress={() => {button.onPress();}}>
                  <View style={{bottom:0,flex:1,flexDirection: 'row'}}>
                    <MaterialCommunityIcons name={button.icon} size={37} color="#b2bec3" style={{bottom:5,height:37}}/><Text style={{...styles.textStyle,bottom:0,}}> {button.text}</Text></View>
                </TouchableHighlight> : <View></View>})}
              </View>
            </View>
          </View>
        </Modal>
    </View>
    }
    
    var d = new Date();
    var n = d.getHours();

    var state = this.state;
    var events = this.state.event.length > 0 ? this.state.event.map((loot)=>{return <Marker onPress={(event) => this.onPress(event,"nope",loot)} icon={{uri: 'building'}} opacity={state.zoom < 5 ? 0 : (state.zoom > 10 ? 1 : (0.1)*state.zoom)} key={loot.i} /*onCalloutPress={() => this.chooseEvent(loot)}*/ title={this.props.state.user.exploreEvent.includes(loot.i) ? 'Already Visited' : (getDistanceFromLatLonInKm(this.state.player.latitude,this.state.player.longitude,loot.latitude,loot.longitude) < 5 ? "Visit building \nDangerosity : ("+(loot.danger)+"/5)" : "Building too far")} coordinate={{"latitude": loot.latitude, "longitude": loot.longitude}}/>}) : <View></View>
    var fires = this.state.fire.length > 0 ? this.state.fire.map((fire)=>{return <Marker onPress={(event) => this.onPress(event,fire)} icon={{uri: 'campfire'}} title={"Fire intensity : "+((Math.round(fire.intensity*10))/10)} /*icon={{uri: 'building'}}*/ opacity={state.zoom < 5 ? 0 : (state.zoom > 10 ? 1 : (0.1)*state.zoom)} key={fire.i} coordinate={{"latitude": fire.latitude, "longitude": fire.longitude}}/>}) : <View></View>
    this.state.fire.forEach((fire,index) => {
      if(fire.intensity > 0){
        fire.intensity -= 0.01;
      }else{
        delete this.state.fire[index];
      }
    });

    var player = state.inMove == 0 ? <Marker.Animated
      icon={{uri: this.props.state.user.rest == 1 ? 'tente' : 'character'}}
      ref={(ref) => { this.marker = ref; }}
      coordinate={{"latitude": state.player.latitude, "longitude": state.player.longitude}} title={"Player"} 
    /> : <View></View>
    var loot = state.inMove == 0 ? this.state.loot.map((loot)=>{return <Marker onCalloutPress={()=>this.pickUpItem(loot)} icon={{uri: 'crate'}} key={loot.i} title={loot.item.name} coordinate={{"latitude": loot.latitude, "longitude": loot.longitude}}/>}) : <View></View>
    
      var direction = <Polyline
      coordinates={state.wayPoints}
      lineDashPattern={[10,20,10,20]}
		strokeColor = "#9C9C9C"
		strokeWidth={1}
    />

    var fab = <Fab active={this.state.active} direction="up" style={{ backgroundColor: '#222222' }} position="bottomRight" onPress={() => this.setState({ active: !this.state.active },()=>{this.map.animateCamera({center: {latitude: this.state.player.latitude,longitude: this.state.player.longitude,}, pitch: 0,heading: 0,},500)})}>
              <Icon name="user" size={30} color="#ffffff" />
              <Button onPress={() => this.createFire()} style={{ backgroundColor: '#222222' }}>
                <Icon name="fire" size={20} color="#ffffff" />
              </Button>
              <Button onPress={this.state.fouille == 0 ? () => this.setState({loot:this.createLoot(this.state.player)}) : () => showMessage({message: "Impossible !",description: "Already searched",type: "danger",})} style={{ backgroundColor: '#222222' }}>
                <Icon name="search" size={20} color="#ffffff" />
              </Button>
              <Button onPress={() => this.rest()} style={{ backgroundColor: '#222222' }}>
                <Icon name="bed" size={20} color="#ffffff" />
              </Button>
              <Button onPress={() => this.rest()} style={{ backgroundColor: '#222222' }}>
                <Icon name="paw" size={20} color="#ffffff" />
              </Button>
              { this.state.nearFire !== undefined ? <View><Button /*onPress={() => this.rest()}*/ style={{ backgroundColor: '#222222' }}>
                <Icon name="chef-hat" size={20} color="#ffffff" />
              </Button>
              <Button /*onPress={() => this.rest()}*/ style={{ backgroundColor: '#222222' }}>
                <Icon name="water" size={20} color="#ffffff" />
              </Button></View> : <View></View>}
            </Fab>

    return (
      <View>
      <MapView coordinate={{"latitude": state.player.latitude, "longitude": state.player.longitude}} moveOnMarkerPress={false} showsTraffic={false} ref={(ref) => { this.map = ref; }} initialCamera={{center: this.state.first, pitch: 0, heading: 0, altitude: 100, zoom:12}} onPress={(event)=>this.onPress(event)  } style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} customMapStyle={ n > 20 || n < 8 ? mapStyleNight : mapStyle} provider={PROVIDER_GOOGLE} showsUserLocation initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922,  longitudeDelta: 0.0421}} >
        {events}
        {direction}
        {loot}
        {fires}
        {player}
      </MapView>
        {/*<Snow snowfall= 'medium'/>*/}
        {modal}
        <View style={{ position: 'absolute', bottom: 60, left: 80 }}>
          {fab}
        </View>
    </View>
    );
  }

  Zoom(){
    setInterval(() => {
    if(this.map){
      if(this.map.__lastRegion){
        const bounds = [
          this.map.__lastRegion.longitude - this.map.__lastRegion.longitudeDelta,
          this.map.__lastRegion.latitude - this.map.__lastRegion.latitudeDelta,
          this.map.__lastRegion.longitude + this.map.__lastRegion.longitudeDelta,
          this.map.__lastRegion.latitude + this.map.__lastRegion.latitudeDelta,
        ]
        const zoom = geoViewport.viewport(bounds, [height, width])
        if(zoom !== this.state.zoom)
          this.setState({zoom:zoom.zoom})
      }
    }
    }, 1000);
  }

  pickUpItem(item){
    this.props.AddItem(item.item);
    var loots = this.state.loot.filter(loot => loot.i !== item.i);
    this.setState({loot:loots})
  }

  createLoot(coordinate){
    this.state.fouille = 1;
    var loot=[];
    var i = 0;
    for (let index = 0; index < getRandomInt(0,4); index++) {
      var item = addItemFnc();
      if(item) {
        var length = lengthdir(coordinate.latitude, coordinate.longitude,getRandomInt(0,360), getRandomInt(5,10)/10000)
        loot.push({latitude:length[0],longitude:length[1],item:item,i:i});
        i++;
      }
    }
    return loot;
  }

  createHunt(coordinate){
    this.state.fouille = 1;
    var hunts=[];
    var i = 0;
    for (let index = 0; index < getRandomInt(0,4); index++) {
      var item = addItemFnc();
      if(item) {
        var length = lengthdir(coordinate.latitude, coordinate.longitude,getRandomInt(0,360), getRandomInt(5,10)/10000)
        hunts.push({latitude:length[0],longitude:length[1],item:item,i:i});
        i++;
      }
    }
    return hunts;
  }

  generateArray(event){
    event.nativeEvent.coordinate.i = this.state.event.length;
    event.nativeEvent.coordinate.type = 2;
    this.setState({event : [...this.state.event, event.nativeEvent.coordinate]},()=>{
      // write the file
      RNFS.writeFile(path, JSON.stringify(this.state.event), 'utf8')
      .then((success) => {console.log('FILE WRITTEN!',path);})
      .catch((err) => {console.log(err.message);});
    })
  }

  rest(){this.props.TakeARest();}

  createFire(){
    var intensity = 0;
    var itemChoosed = undefined;

    for(item in this.props.state.user.items){
      if(this.props.state.user.items[item].type == "combustible"){
        itemChoosed = item
        break;
      }
    }

    if(itemChoosed){
      Alert.alert(
        "Warning !",
        "Are you sure you want to create fire with "+this.props.state.user.items[itemChoosed].name+(this.props.state.user.items[itemChoosed].value ? ("\n\n- "+this.props.state.user.items[itemChoosed].label+" +"+((this.props.state.user.items[itemChoosed].value[0]) ? this.props.state.user.items[itemChoosed].value[0]: this.props.state.user.items[itemChoosed].value) )  : ""),
        [
          {text: "No",style: "cancel"},
          { text: "Yes", onPress: () => {
            intensity = this.props.state.user.items[itemChoosed].value;
            this.props.DeleteItem(itemChoosed);
            if(intensity !== 0){
              if(this.state.nearFire){
                this.state.nearFire.intensity += intensity;
              }else{
                var tempFire = {latitude:this.state.player.latitude,longitude:this.state.player.longitude,i:this.state.fireLength,intensity:intensity};
                this.state.fireLength++;
                this.props.AddDistance({distance:1,nearFire:tempFire,latitude: this.state.player.latitude, longitude: this.state.player.longitude});
                this.setState({fire :[...this.state.fire,tempFire],nearFire:tempFire})
              }
            }
          } }
        ],
        { cancelable: false }
      );
    }
  }

  onPress(event,fire="nope",building="nope"){
    const params = {
      access_key: 'aced64c9d1efb8ba1f855f001dab39f2',
      latitude: event.nativeEvent.coordinate.latitude ,
      longitude: event.nativeEvent.coordinate.longitude,
    }
    fetch('http://api.positionstack.com/v1/reverse?access_key='+params.access_key+'&query='+params.latitude+','+params.longitude, {method: 'GET',})
      .then((response) => response.json())
      .then((responseJson) => {this.setState({typeArea:responseJson.data[0].type})})
      .catch((error) => {console.error(error);});
    if(this.state.typeArea == "ocean" || this.state.typeArea == "marineaera")
      showMessage({message: "Danger !",description: "Ice is fragile, move to solid ground",type: "danger",});
    
    if(this.state.inMove == 0 ){
      var distance = getDistanceFromLatLonInKm(this.state.player.latitude,this.state.player.longitude,event.nativeEvent.coordinate.latitude,event.nativeEvent.coordinate.longitude);
      if (distance < 5) {
        if (this.props.state.user.stats["energie"] > 0) {
          if (fire != "nope"){
            this.state.nearFire = fire;
          }else{
            this.state.nearFire = undefined;
          }
          if (building != "nope"){
            this.state.nearFire = building;
          }else{
            this.state.nearEvent = undefined;
          }
          if(this.state.wayPoints.length >= 23){
            this.state.wayPoints = this.state.wayPoints.slice(2)
            this.state.first = this.state.wayPoints[0]
          }
          this.setState({lastCoord:this.state.player,player:event.nativeEvent.coordinate,inMove:1,wayPoints: [...this.state.wayPoints, event.nativeEvent.coordinate],fouille:0})
          var time = 500;
          this.map.animateCamera({center: {latitude: event.nativeEvent.coordinate.latitude,longitude: event.nativeEvent.coordinate.longitude,}, pitch: 0,heading: 0,},time)
          this.marker.animateMarkerToCoordinate({latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude},time)
          //event.persist();
          setTimeout(() => {
            if(!this.props.state.user.exploreEvent.includes(building.i)) {building != "nope" ? this.chooseEvent(building) : ''}
            this.setState({inMove:0})
          }, time);
          this.props.AddDistance({distance:distance*10,nearFire:this.state.nearFire,latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude});
        }else{
        showMessage({message: "Impossible !",description: "you are too tired, rest!",type: "danger",});
      }
      }else{
        this.state.nearEvent = undefined;
        showMessage({message: "Impossible !",description: "Distance too high",type: "danger",
        });
      }
    }
  }
}

const mapStateToProps = (state) => {
  return { state }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({AddDistance,AddItem,DeleteItem,EndEvent,TakeARest,UserAction,UpgradeJob,}, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Maps);


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding:20,
    marginBottom:60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: { 
    backgroundColor: "#222222",
    borderRadius: 1,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize:20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize:20,
  },
  modalTextTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontSize:30,
  }
});