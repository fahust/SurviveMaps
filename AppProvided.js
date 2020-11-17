import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import React, { Component } from 'react';

import Maps from './components/Maps'
import User from './components/User'
import Items from './components/Items'

import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from "react-native-flash-message";

import { connect } from 'react-redux';


const Tab = createBottomTabNavigator();

class MyTabs extends React.Component {


 constructor(props) {
    super(props);

    this.state = {
    };
  }
   render() {
      var damage = 0;
      for (part in this.props.state.user.body) {
        if(this.props.state.user.body[part] != 0)
          damage++
      }
      if(this.props.state.user.stats["vie"] < 10) damage++
      if(this.props.state.user.stats["faim"] < 10) damage++
      if(this.props.state.user.stats["soif"] < 10) damage++
      if(this.props.state.user.stats["energie"] < 10) damage++
      if(this.props.state.user.stats["poids"] > this.props.state.user.stats["poids max"]-20) damage++
      if(this.props.state.user.stats["température"] < 10) damage++
      var screens = <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={{
        activeTintColor: '#2C2C2C'
      }}
    ><Tab.Screen
        name="Maps"
        component={Maps}
        options={{
          tabBarLabel: 'Maps',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-maps" color={color} size={size} />
          ),
        }}
      />
      {damage > 0 ?
      <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-box" color={color} size={size} />
          ),
          tabBarBadge: damage,
        }}
      /> : <Tab.Screen
        name="User"
        component={User}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-box" color={color} size={size} />
          ),
        }}
      />}
      <Tab.Screen
        name="Items"
        component={Items}
        options={{
          tabBarLabel: 'Items',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bag-personal" color={color} size={size} />
          ),
        }}
      />
      </Tab.Navigator>


  return (
    <NavigationContainer>
    {screens}
  <FlashMessage position="top"/>
</NavigationContainer>
  );
}
}

const mapStateToProps = (state) => {
  return { state }
};

export default connect(mapStateToProps)(MyTabs);