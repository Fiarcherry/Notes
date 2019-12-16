import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback
} from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db.db");

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "Notes"
  };

  componentDidMount() {
      db.transaction(tx => {
          tx.executeSql(
              "create table if not exists notes (id integer primary key not null, title text, body text);"
          );
      });
  }

  render() {
      const { navigate } = this.props.navigation;

      return (
          <Button
              title="Add Note"
              onPress={() => {
                  console.log('test');
                  this.props.navigation.navigate("Note");
              }}
          />
      );
  }
}
