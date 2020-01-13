import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.navigation.getParam("update", false));

    this.state = {
      notes: [],
      refreshing: false
    };
    console.log('NEWHOMESCREEN');
  }

  static navigationOptions = {
    title: "Notes"
  };

  componentDidMount() {
    this.update().then(() => {
      //console.log(this.state);
    });
  }

  onPressNote(id) {
    console.log(id + " note was pressed");
  }

  render() {
    const notes = this.state.notes;
    /*
      if (notes === null || notes.length === 0){
          console.log('0 notes found');
          return null;
      }
             */

    let notesToRender = null;
    if (notes !== null && notes.length > 0) {
      notesToRender = notes.map(value => {
        return (
          <TouchableOpacity
            //title={value.title}
            key={value.id}
            onPress={() => this.onPressNote(value.id)}
          >
            <Text>{value.title}</Text>
          </TouchableOpacity>
        );
      });
    }

    return (
      <View>
        <Button
          title="Add Note"
          onPress={() => {
            console.log("add note was pressed");
            this.props.navigation.navigate("Note", {
              onGoBack: () => {
                this.update().then(r => {
                  //do nothing. yet.
                });
              }
            });
          }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.update}
            />
          }
        >
          {notesToRender}
        </ScrollView>
      </View>
    );
  }

  update = async () => {
    console.log("update");

    await this.setState({ refreshing: true });

    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists notes (id integer primary key not null, title text, body text);"
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        "select * from notes",
        [],
        async (_, { rows: { _array } }) => {
          await this.setState({ notes: _array, refreshing: false });
        }
      );
    });
  };
}
