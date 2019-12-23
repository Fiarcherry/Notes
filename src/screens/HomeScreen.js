import React, { Component } from "react";
import {
    Button,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from "react-native";

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            refreshing: false
        };
    }

  static navigationOptions = {
    title: "Notes"
  };

  componentDidMount() {
      console.log('component did mount Home')
      //this.update().then(() => {
          //console.log(this.state);
      //});
  }

  onPressNote(id){
      console.log(id + ' note was pressed');
  }

  render() {
      console.log("param update is " + this.props.navigation.getParam("update", false));

      const notes = this.state.notes;

      let notesToRender = null;
      if (notes.length > 0) {
          notesToRender = notes.map(value => {
              return (
                  <TouchableOpacity
                      key = {value.id}
                      onPress = {() => {
                          this.onPressNote(value.id);

                          this.props.navigation.navigate("Note", {
                              id: value.id
                          });
                      }}
                  >
                      <Text>{value.title}</Text>
                  </TouchableOpacity>
              );
          });
      } else {
          console.log('0 notes found');
      }

      return (
          <View>
              <Button
                  title = "Add Note"
                  onPress = {() => {
                      console.log("add note was pressed");
                      this.props.navigation.navigate("Note", {
                          onGoBack: () => {
                              this.update().then(r => {
                                  console.log("on go back called");
                              });
                          }
                      });
                  }}
              />
              <ScrollView
                  refreshControl = {
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
      console.log("update method called");

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
                  await this.setState({
                      notes: _array,
                      refreshing: false
                  });
              }
          );
      });
  };
}
