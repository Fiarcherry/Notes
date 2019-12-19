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
        this.state = {
            notes: [],
        };
    }

  static navigationOptions = {
    title: "Notes"
  };

  componentDidMount() {

  }

  onPressNote(id){
      console.log(id + ' note was pressed');
  }

  render() {
      this.update();

      const notes = this.state.notes;

      if (notes === null || notes.length === 0){
          console.log('0 notes found');
          return null;
      }

      let notesToRender = notes.map((value) => {
          return <TouchableNativeFeedback
              title = {value.title}
              key = {value.id}
              onPress = {() => this.onPressNote(value.id)}
          />
      });

      return (
          <View>
              <Button
                  title="Add Note"
                  onPress={() => {
                      console.log('add note was pressed')
                      this.props.navigation.navigate("Note");
                  }}
              />
              <ScrollView>
                  {notesToRender}
              </ScrollView>
          </View>
      );
  }

  update() {
      console.log('update');

      db.transaction(tx => {
          tx.executeSql(
              "create table if not exists notes (id integer primary key not null, title text, body text);"
          );
      });

      db.transaction(tx => {
          tx.executeSql(
              'select * from notes', [], (_, {rows: {_array}}) => {
                  this.setState({notes: _array})
              }
          );
      });
  }
}
