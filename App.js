import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList } from 'react-native';

export default function App() {
    return (
        <ScrollView>
            <View style = {styles.container}>
                <View style = {styles.textContainer}>
                    <Text>Hello, world!</Text>
                </View>

                <TextInputAndTextComponent
                    placeholder = {'Введите текст'}
                />

                <FlatListComponent/>

                <ButtonComponent
                    title = {'Add Note'}
                />
            </View>
        </ScrollView>
    );
}

class ButtonComponent extends Component {
    onPressButton = () => {
        alert('add note');
    };

    render() {
        return (
            <View  style = {styles.buttonContainer}>
                <Button
                    onPress = {this.onPressButton}
                    title = { this.props.title }
                />
            </View>
        );
    }
}

class TextInputAndTextComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        }
    }

    render() {
        return (
            <View style = {styles.textInputContainer}>
                <TextInput
                    placeholder = {this.props.placeholder}
                    onChangeText = {(text) => this.setState({text})}
                    value = {this.state.text}
                />
                <Text>
                    {this.state.text}
                </Text>
            </View>
        );
    }
}

class FlatListComponent extends Component {
    render() {
        return (
            <View style={styles.flatListContainer}>
                <FlatList
                    data={[
                        {key: 'Devin'},
                        {key: 'Dan'},
                        {key: 'Dominic'},
                        {key: 'Jackson'},
                        {key: 'James'},
                        {key: 'Joel'},
                        {key: 'John'},
                        {key: 'Jillian'},
                        {key: 'Jimmy'},
                        {key: 'Julie'},
                    ]}
                    renderItem={({item}) => <Text style = {{fontSize:26}}>{item.key}</Text>}
                />
            </View>
        )
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
})