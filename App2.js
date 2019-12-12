import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList, Animated, TouchableOpacity, Image } from 'react-native';

export default function App() {


    return (
        <View style={styles.container}>
            <ListOfNotes></ListOfNotes>
            <AddNoteButton></AddNoteButton>
        </View>
    );
}

class ListOfNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueArray: [],
            animatedValue: new Animated.Value(0),
        }
        this.index = 0;
        this.addNote = this.addNote.bind(this);
    }

    render(){
        const animationValue = this.state.animatedValue.interpolate(
            {
                inputRange: [0, 1],
                outputRange: [-59, 0]
            });

        let newArray = this.state.valueArray.map((item, key) => {
            if ((key) == this.index) {
                return (
                    <Animated.View
                        key={key}
                        style={[
                            styles.viewHolder,
                            { opacity: this.state.animatedValue, transform: [{ translateY: animationValue }] }]}>
                        <Text style={styles.headerText}>Заметка {item.index}</Text>
                    </Animated.View>
                );
            }
            else {
                return (
                    <View key={key} style={styles.viewHolder}>
                        <Text style={styles.headerText}>Заметка {item.index}</Text>
                    </View>
                );
            }
        });

        return (
            <ScrollView>
                <View>
                    {newArray.reverse()}
                </View>
            </ScrollView>
        );
    };
}

class AddNoteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
        }
    }

    addNote()
    {
        this.state.animatedValue.setValue(0);
        let newlyAddedValue = { index: this.index }
        this.setState({
            disabled: true,
            valueArray: [...this.state.valueArray, newlyAddedValue]
        }, () => {
            Animated.timing(
                this.state.animatedValue,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start(() => {
                this.index = this.index + 1;
                this.setState({ disabled: false });
            });
        });
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonDesign}
                disabled={this.state.disabled}
                onPress={this.addNote}
            >
                <Image source={require('./assets/plus.png')} style={styles.buttonImage} />
            </TouchableOpacity>
        );
    }
}

class ButtonComponent extends Component {
    onPressButton = () => {
        alert('add note');
    };

    render() {
        return (
            <View  style = {styles.buttonAddNotesContainer}>
                <Button
                    onPress = {this.onPressButton}
                    title = { this.props.title }
                />
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

    viewHolder: {
        height: 55,
        margin: 4,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 25
    },

    buttonDesign: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonImage: {
        resizeMode: 'contain',
        width: '100%',
    }
})