import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableNativeFeedback, } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { NoteScreen } from './src/screens/NoteScreen';
import * as SQLite from 'expo-sqlite';
global.db = SQLite.openDatabase("db.db");

const AppNavigator = createStackNavigator({
    Home: {screen: HomeScreen},
    Note: {screen: NoteScreen},
    },
    {initialRouteName: 'Home'}
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {

    return (
        <AppContainer/>
        // <View style={styles.container}>
        //     <AddNotes/>
        // </View>
    );
}

class AddNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayOfNotes: [],
        };
        this.index = 0;
    }

    _onPress() {
        let temp = this.index++;
        let newArrayOfNotes = this.state.arrayOfNotes;
        newArrayOfNotes.push(temp);
        this.setState({arrayOfNotes: newArrayOfNotes });
    }

    render() {
        let notes = this.state.arrayOfNotes.map((note, key) => {
            return <View key = {key} style = {styles.notesList}>
                <Text style = {styles.notesListText}>{note}</Text>
            </View>
        });

        return(
            <View>
                <TouchableNativeFeedback
                    onPress = {() => this._onPress()}
                    background = {TouchableNativeFeedback.SelectableBackground()}>
                    <View style = {styles.notesAddButton}>
                        <Text style = {styles.notesAddButtonText}>Добавить заметку</Text>
                    </View>
                </TouchableNativeFeedback>
                <ScrollView>
                    {notes}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: 5,
        marginTop: 40,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },

    notesList: {
        backgroundColor: '#ebebeb',
        margin: 5,
        alignItems: 'flex-start',
        borderRadius: 3,
    },

    notesListText: {
        margin: 10,
        fontSize: 20,
    },

    notesAddButton: {
        margin: 5,
        backgroundColor: '#6499ff',
        alignItems: 'center',
        borderRadius: 10,
    },

    notesAddButtonText: {
        margin: 20,
        fontSize: 22,
    }
});