import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

//import DraggableFlatList from "react-native-draggable-flatlist";

import { Container, Header, Tab, Tabs, ScrollableTab,getTheme,TabHeading } from 'native-base';

import ListIstems from './items/ListItems';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


export default class App extends React.Component {


 constructor(props) {
    super(props);

    this.state = {
      items:[],
      stats:{
        "faim":50,
        "soif":50,
        "energie":50,//
        "poids":10,
        "poids max":100,
        "température":38,
        "vent":10,
    },
      
    };
  }

  calculatePods(){
    var pods= 0;
    this.state.items.forEach(item => {
      pods += item["poids"]
    });
  }


  render() {
    var state = this.state;

    return (
      <Container>
        <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab activeTextStyle={{width:50}} textStyle={{width:60}} heading={ <TabHeading><FontAwesome name="food-apple" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Food</Text></TabHeading>}>
            <ListIstems theme={"nourriture"}/>
          </Tab>
          <Tab activeTextStyle={{width:60}} textStyle={{width:70}} heading={ <TabHeading><FontAwesome name="cup-water" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Drinks</Text></TabHeading>}>
            <ListIstems theme={"boisson"}/>
          </Tab>
          <Tab activeTextStyle={{width:50}} textStyle={{width:60}} heading={ <TabHeading><FontAwesome name="medical-bag" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Heal</Text></TabHeading>}>
            <ListIstems theme={"antibiotique"}/>
          </Tab>
          <Tab activeTextStyle={{width:70}} textStyle={{width:80}} heading={ <TabHeading><FontAwesome name="tshirt-crew" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Clothes</Text></TabHeading>}>
            <ListIstems theme={"vêtements"}/>
          </Tab>
          <Tab activeTextStyle={{width:70}} textStyle={{width:80}} heading={ <TabHeading><FontAwesome name="pistol" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Weapons</Text></TabHeading>}>
            <ListIstems theme={"arme"}/>
          </Tab>
          <Tab activeTextStyle={{width:70}} textStyle={{width:80}} heading={ <TabHeading><FontAwesome name="ammunition" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Bullet</Text></TabHeading>}>
            <ListIstems theme={"munition"}/>
          </Tab>
          <Tab activeTextStyle={{width:50}} textStyle={{width:60}} heading={ <TabHeading><FontAwesome name="toolbox" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Tools</Text></TabHeading>}>
            <ListIstems theme={"métier"}/>
          </Tab>
          <Tab activeTextStyle={{width:50}} textStyle={{width:60}} heading={ <TabHeading><FontAwesome name="campfire" size={25} color="#ffffff" /><Text style={{color:"#ffffff"}}>Fuel</Text></TabHeading>}>
            <ListIstems theme={"combustible"}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }



}