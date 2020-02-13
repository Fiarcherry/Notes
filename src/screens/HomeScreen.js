import React from "react";
import {
    Button,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList, StyleSheet,
} from "react-native";
import { Notifications } from 'expo';
import { SQLite } from "expo-sqlite";

import {onStart, dropAllTables} from "../database/main";
import {selectAllNote} from "../database/note";
import {executeSqlCommand} from "../database/executeCommand";

export class AddNoteButton extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity
                style = {styles.buttonAddNote}
                onPress={this.onPressAddNote}
            >
                <Text>+</Text>
            </TouchableOpacity>
        );
    }
}

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            refreshing: false,
            notificationTime: null,
        };
        console.log('HOMESCREEN');
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: "Notes",
            //headerRight: () => <AddNoteButton navigation={navigation}/>,
        };
    };

    componentDidMount() {
        //this.props.navigation.setParams({handleUpdate: this.update()});
        //dropAllTables();
        onStart();
        this.update().then(r => {})
    }

    sendLocalScheduleNotification = () => {
        Notifications.scheduleLocalNotificationAsync(
            {
                title: 'Напоминание',
                body: 'testBody',
                data: (new Date()),
            },
            {
                time: (new Date()).getTime() + 1000,
            })
    };

    onPressNote = (item) => {
        this.props.navigation.navigate("Note", {
            id: item.id,
            onGoBack: () => {
                this.update().then(r => {});
            }
        });
    };

    onPressAddNote = () => {
        this.props.navigation.navigate("Note", {
            onGoBack: () => {
                this.update().then(r => {});
            }
        });
    };

    flatListItem = ({ item, index }) => {
        return(
            <TouchableOpacity
                style = {styles.oneNote}
                key = {index}
                onPress = {this.onPressNote.bind(this, item)}
            >
                <Text style = {styles.titleOfNote}>{item.title}</Text>
                <View style = {{padding: 10, borderRadius: 5, backgroundColor: "#0a0"}}/>
                <Text>{this.state.items[index].hour}:{this.state.items[index].minute}</Text>
                <Text>{this.state.items[index].day}.{this.state.items[index].month}.{this.state.items[index].year}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <SafeAreaView style = {styles.container}>
                <TouchableOpacity
                    style = {styles.buttonAddNote}
                    onPress={this.onPressAddNote}
                >
                    <Text>+</Text>
                </TouchableOpacity>
                <ScrollView style ={styles.scrollView}
                    refreshControl = {
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.update}
                        />
                    }
                >
                    <FlatList
                        style={styles.listOfNotes}
                        data={this.state.items.reverse()}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this.flatListItem}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    update = async () => {

        await this.setState({ refreshing: true });

        executeSqlCommand(
        'select * from note join notification on notification.noteId = note.id',
        [],
        async (_, { rows: { _array } }) => {
            await this.setState({
                items: _array,
            });
            console.log(JSON.stringify(_array));
            console.log(JSON.stringify(this.state));
        });

        await this.setState({ refreshing: false });
    };
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    buttonAddNote: {
        padding: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },

    scrollView: {

    },

    listOfNotes: {

    },

    oneNote: {
        padding: 5,
        paddingHorizontal: 10,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor : "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    },

    titleOfNote: {
    fontSize: 24,
    color: 'rgba(81,58,13,0.95)',
    },
});


