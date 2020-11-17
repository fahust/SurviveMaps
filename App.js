import React, { Component } from 'react';

import { Provider } from 'react-redux';
import  AppProvider  from './AppProvided';

import { createStore } from 'redux';
import friendsReducer from './redux/ProReducer';
import {
getTheme,
    StyleProvider,
} from "native-base";

import customVariables from "./variables"


class App extends Component {

constructor(properties) {
  super(properties);
 
}


  render(){
    const store = createStore(friendsReducer);
    return <Provider store={store}>
      <StyleProvider style={getTheme(customVariables)}>
        <AppProvider/>
      </StyleProvider>
    </Provider>
  }
  
}


export default App;

