import React, { Component } from "react";
import {
    Button,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    StyleSheet,
} from "react-native";

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            refreshing: false
        };
        console.log('HOMESCREEN');
    }

    static navigationOptions = {
        title: "Notes"
    };

    componentDidMount() {
      console.log('component did mount Home')
      this.update().then(() => {
          console.log(this.state);
      });
    }

    render() {
        console.log("param update is " + this.props.navigation.getParam("update", false));

        const notes = this.state.notes;

        if (notes.length > 0) {
            console.log(notes.length + ' notes found');
        } else {
            console.log('0 notes found');
        }

        return (
            <SafeAreaView style = {styles.container}>
                <Button style = {styles.buttonAddNote}
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
                    <FlatList
                        data={this.state.notes}
                        renderItem={({ item }) =>
                            <TouchableOpacity style = {styles.listOfNotes}
                                key = {item.id}
                                onPress = {() => {
                                    console.log(item.id + ' note was pressed');

                                    this.props.navigation.navigate("Note", {
                                        id: item.id,
                                        onGoBack: () => {
                                            this.update().then(r => {
                                                console.log("on go back called");
                                            });
                                        }
                                    });
                                }}
                            >
                                <Text style = {styles.titleOfNotes}>{item.title}</Text>
                            </TouchableOpacity>}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
            </SafeAreaView>
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

const styles = StyleSheet.create({

   container: {
       flex: 1,
       marginBottom: 10,
   },

    listOfNotes: {
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        marginTop: 5,
        flexDirection: 'row',
        backgroundColor: 'rgba(239,193,3,0.17)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 5,
    },

    titleOfNotes: {
        fontSize: 24,
        color: 'rgba(81,58,13,0.95)',
    },

    buttonAddNote: {
        marginHorizontal: 5,
        color: 'rgba(81,58,13,0.95)',
    },
});
