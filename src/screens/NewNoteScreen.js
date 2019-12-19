import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableNativeFeedback,
    TextInput, Button
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db.db");

export class NoteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            body: null,
        };
    }

    static navigationOptions = {
        title: this.title,
    };

    render() {
        return(
            <View>
                <TextInput
                    placeholder = 'Title'
                    onChangeText = {title => this.setState({title})}
                    onSubmitEditing = {() => {console.log(this.state.title)}}
                />
                <TextInput
                    placeholder = 'Body'
                    onChangeText = {body => this.setState({body})}
                    onSubmitEditing = {() => {console.log(this.state.body)}}
                    multiline = { true }
                />
                <Button
                    title="Save Note"
                    onPress={() => {
                        this.add(this.state.title, this.state.body);
                        this.setState({
                            title: null,
                            body: null,
                        });

                        console.log('save note');
                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.navigate("Home", {
                            update: true
                        });
                    }}
                />
            </View>
        )
    }

    add(title, body){
        if (title === null || title === '' || body === null || body === ''){
            console.log('something is empty');
            return false;
        }

        db.transaction(
            tx => {
                tx.executeSql('insert into notes (title, body) values (?, ?)', [title, body]);
            }
        );
    }
}