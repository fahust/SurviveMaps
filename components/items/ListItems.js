import React, { Component } from "react";
import { StyleSheet,View,Alert } from 'react-native'
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  getTheme,
  StyleProvider,
} from "native-base";

import { connect } from 'react-redux';

import { UseItem } from '../../redux/UseItem';
import { RepairItem } from '../../redux/RepairItem';
import { DeleteItem } from '../../redux/DeleteItem';
import { EquipClothes } from '../../redux/EquipClothes';
import { UserAction } from '../../redux/UserActions';

import { bindActionCreators } from 'redux';

import useItemFnc  from '../functionItem/useItem';


class NHListDivider extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      items:{},
    };
  }

  useItem(item){
    if(this.props.theme == "combustible" || this.props.theme == "métier" || this.props.theme == "munition"){
      Alert.alert(
        "Look",
        this.props.state.user.items[item].name+(this.props.state.user.items[item].value ? ("\n\n- "+this.props.state.user.items[item].label+" +"+((this.props.state.user.items[item].value[0]) ? this.props.state.user.items[item].value[0]: this.props.state.user.items[item].value)+(this.props.state.user.items[item].value[1] ? "\n- Drunk +"+this.props.state.user.items[item].value[1] : "") )  : "")+"\n\nWeight : "+this.props.state.user.items[item].poids+" Kg"+(this.props.state.user.items[item].durability ? "\nDurability : "+this.props.state.user.items[item].durability+" %" : ""),
        [
          {
            text: "Quit",
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }else{
      Alert.alert(
        "Warning !",
        "Are you sure you want to use "+this.props.state.user.items[item].name+(this.props.state.user.items[item].value ? ("\n\n- "+this.props.state.user.items[item].label+" +"+((this.props.state.user.items[item].value[0]) ? this.props.state.user.items[item].value[0]: this.props.state.user.items[item].value)+(this.props.state.user.items[item].value[1] ? "\n- Food +"+this.props.state.user.items[item].value[1] : "") )  : "")+"\n\nWeight : "+this.props.state.user.items[item].poids+" Kg"+(this.props.state.user.items[item].durability ? "\nDurability : "+this.props.state.user.items[item].durability+" %" : ""),
        [
          {
            text: "No",
            style: "cancel"
          },
          { text: "Yes", onPress: () => this.validUseItem(item) }
        ],
        { cancelable: false }
      );
    }
  }

  validUseItem(item){
    this.props.UserAction(useItemFnc(this.props.state.user.stats,this.props.state.user.items[item]))
    this.props.UseItem(item) 
  }

  repairItem(repairItem){
    var tempArray = this.props.state.user.items[repairItem].repair;
    var arrayToDelete = [];
    for (item in this.props.state.user.items) {
      if(tempArray.includes(this.props.state.user.items[item].name)){
        tempArray = tempArray.filter(temp => temp != this.props.state.user.items[item].name)
        arrayToDelete.push(item)
      }
    }
    if(tempArray.length <= 0){
      arrayToDelete.forEach((toDelete,index) => {
        this.props.DeleteItem(toDelete)
      });
      this.props.RepairItem({item:repairItem,type:this.props.state.user.items[repairItem].type})
    }else{
      Alert.alert(
        "Impossible",
        "You don't have harvest to repair :"+this.props.state.user.items[repairItem].repair.map((harvest) => {return "\n- "+harvest}),
        [
          {
            text: "Quit",
            style: "cancel"
          },
        ],
      );
    }
  }

  equipClothes(item){
    Alert.alert(
        "Look !",
        "Are you sure you want to "+(this.props.state.user.items[item].equiped ? "unequip" : "equip")+" "+this.props.state.user.items[item].name+(this.props.state.user.items[item].value ? ("\n\n- "+this.props.state.user.items[item].label+" +"+((this.props.state.user.items[item].value[0]) ? this.props.state.user.items[item].value[0]: this.props.state.user.items[item].value)+(this.props.state.user.items[item].value[1] ? "\n- Food +"+this.props.state.user.items[item].value[1] : "") )  : "")+"\n\nWeight : "+this.props.state.user.items[item].poids+" Kg"+(this.props.state.user.items[item].durability ? "\nDurability : "+this.props.state.user.items[item].durability+" %" : ""),
        [
          { text: "Repair", onPress: () => this.repairItem(item) ,
            style: "cancel"},
          {
            text: "No"
          },
          { text: "Yes", onPress: () => this.props.EquipClothes(item) },
        ],
        { cancelable: false }
      );
    
  }

  deleteItem(item){
     Alert.alert(
      "Warning !",
      "Are you sure you want to drop "+this.props.state.user.items[item].name+(this.props.state.user.items[item].value ? ("\n\n- "+this.props.state.user.items[item].label+" +"+((this.props.state.user.items[item].value[0]) ? this.props.state.user.items[item].value[0]: this.props.state.user.items[item].value)+(this.props.state.user.items[item].value[1] ? "\n- Food +"+this.props.state.user.items[item].value[1] : "") )  : "")+"\n\nWeight : "+this.props.state.user.items[item].poids+" Kg"+(this.props.state.user.items[item].durability ? "\nDurability : "+this.props.state.user.items[item].durability+" %" : ""),
      [
        {
          text: "No",
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.props.DeleteItem(item) }
      ],
      { cancelable: false }
    );
  }

  none(){

  }

  render() {
    var items = {};
    this.state.items = {};//console.log(this.props.state.user.items)
    for (key in this.props.state.user.items) {
      if(key){
        if (this.props.state.user.items[key].type == this.props.theme) {
          if(this.props.theme == "vêtements" || this.props.theme == "arme"){
            items[key] = this.props.state.user.items[key];
          }else{
            if(this.state.items[this.props.state.user.items[key].name]){this.state.items[this.props.state.user.items[key].name] = this.state.items[this.props.state.user.items[key].name]+1;}else{this.state.items[this.props.state.user.items[key].name] = 1;items[key] = this.props.state.user.items[key];}
          }
            
        }
      }
    }
    var list = Object.keys(items).map((item)=>{
      return <ListItem noIndent style={this.props.state.user.items[item].equiped == 1 ? {backgroundColor:( this.props.state.user.items[item].value < 20 ? 'rgba(52, 52, 52, 0.2)' : this.props.state.user.items[item].value < 40 ? 'rgba(0, 248, 0, 0.2)' : this.props.state.user.items[item].value < 60 ? 'rgba(0, 0, 248, 0.2)' : this.props.state.user.items[item].value < 80 ? 'rgba(162, 0, 248, 0.2)' : 'rgba(247, 0, 0, 0.2)')} : {}} onLongPress={() => this.deleteItem(item)} onPress={this.props.theme !== "vêtements" &&  this.props.theme !== "arme" ? (() => this.useItem(item)) : (() => this.equipClothes(item)) } key={item}><Left><Text style={this.props.state.user.items[item].durability < 10 ? {color:"#E70000"} : {color:"#222222"}}>{this.props.state.user.items[item].name}</Text></Left><Right>{this.props.theme !== "vêtements" &&  this.props.theme !== "arme" ? <Text>X {this.state.items[this.props.state.user.items[item].name]}</Text> : <View></View>}</Right></ListItem>
    })
    return (
      <Container style={styles.container}>
        <Content>
          {list}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
});

const mapStateToProps = (state) => {
  return { state }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    EquipClothes,
    UseItem,
    DeleteItem,
    UserAction,
    RepairItem,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(NHListDivider);