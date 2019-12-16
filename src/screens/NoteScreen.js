import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableNativeFeedback,
    TextInput
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

export class NoteScreen extends Component {
    constructor(props) {
        super(props);
        let title = 'note_title';
    }

    static navigationOptions = {
        title: this.title,
    };v

    render() {
        return(
            <View>
                <TextInput
                    placeholder="Title"
                />
                <TextInput
                    placeholder="Body"
                />
            </View>
        )
    }
}