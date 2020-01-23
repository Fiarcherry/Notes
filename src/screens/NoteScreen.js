import React, { Component } from 'react';
import {
    SafeAreaView,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    DatePickerAndroid,
    TimePickerAndroid,
} from 'react-native';

class NotificationDateTime extends Component{
}

export class NoteScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: {
                title: null,
                body: null,
            },
            notification: {
                day: null,
                month: null,
                year: null,
                hour: null,
                minute: null,
            }
        };

        console.log('NOTESCREEN');
    };

    static navigationOptions = {
        title: this.title,
    };

    componentDidMount() {
        console.log('component did mount Note')
    };

    componentWillMount() {
        console.log('component will mount Note');

        let id = this.props.navigation.getParam('id', null);

        if (id != null) {
            this.select(id);
        }
    };

    async pickDate() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                mode: 'spinner',
                date: new Date(),
            });

            if (action !== DatePickerAndroid.dissmissedAction) {
                console.log('DatePickerAndroid.dissmissedAction');
                this.setState({
                    notification: {
                        day: day,
                        month: month + 1,
                        year: year,
                        hour: this.state.notification.hour,
                        minute: this.state.notification.minute,
                    },
                });
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    };

    async pickTime() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 0,
                minute: 0,
                is24Hour: true,
                mode: 'spinner',
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                console.log('TimePickerAndroid.dissmissedAction');
                this.setState({
                    notification: {
                        day: this.state.notification.day,
                        month: this.state.notification.month,
                        year: this.state.notification.year,
                        hour: hour,
                        minute: minute,
                    },
                });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    };

    render() {
        return(
            <SafeAreaView style = {styles.container}>
                <Button
                    title = 'Pick Date'
                    onPress = {() => this.pickDate()}
                />
                <Button
                    title = 'Pick Time'
                    onPress = {() => this.pickTime()}
                />
                <Text>{this.state.notification.day}.{this.state.notification.month}.{this.state.notification.year}   {this.state.notification.hour}:{this.state.notification.minute}</Text>
                <TextInput style = {styles.title}
                    placeholder = 'Title'
                    onChangeText = {(title) => {
                        this.setState({
                            note: {
                                title: title,
                                body : this.state.note.body,
                            }
                        })
                    }}
                    onSubmitEditing = {() => {console.log(this.state.note.title)}}
                    value = {this.state.note.title}
                />
                <ScrollView>
                    <TextInput style = {styles.text}
                        placeholder = 'Body'
                        onChangeText = {(body) => {
                            this.setState({
                                note: {
                                    title: this.state.note.title,
                                    body : body,
                                }
                            })
                        }}
                        onSubmitEditing = {() => {console.log(this.state.note.body)}}
                        multiline = { true }
                        value = {this.state.note.body}
                    />
                </ScrollView>
                <Button
                    title = 'Save Note'
                    onPress = {() => {
                        let id = this.props.navigation.getParam('id', null);
                        let note = {
                            title: this.state.note.title,
                            body: this.state.note.body,
                        };
                        let notification = {
                            day: this.state.notification.day,
                            month: this.state.notification.month,
                            year: this.state.notification.year,
                            hour: this.state.notification.hour,
                            minute: this.state.notification.minute,
                        };

                        this.save(id, note, notification);

                        console.log('save note button pressed');

                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.navigate("Home", {
                            update: true
                        });
                    }}
                />
                <Button
                    title = "Delete Note"
                    onPress = {() => {
                        this.delete(this.props.navigation.getParam('id', null));

                        console.log('delete note button pressed');

                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.navigate("Home", {
                            update: true
                        });
                    }}
                />
            </SafeAreaView>
        )
    };

    checkEmptyInput(textInput){
        if (textInput === null || textInput === ''){
            return 'Untitled';
        }

        return textInput;
    };

    executeSqlCommand(sqlStatement, args,
                      callback = (transaction, { rows: { _array } }) => {
                          console.log(JSON.stringify(_array));
                      },
                      errorCallback = (transaction, _error) => {
                          console.log(JSON.stringify(_error));
                      }){
        db.transaction(tx => {
            tx.executeSql(sqlStatement, args, callback, errorCallback);
        });
    }

    save(id, note, notification){
        console.log("save method called")

        note.title = this.checkEmptyInput(note.title);

        if (id == null) {
            this.executeSqlCommand(
                'insert into notes ' +
                    '(title, body) ' +
                    'values (?, ?);',
                [note.title, note.body]
            );

            this.executeSqlCommand(
                'insert into notifications ' +
                    '(day, month, year, hour, minute, noteId) ' +
                    'values (?, ?, ?, ?, ?, ?);',
                [notification.day, notification.month, notification.year, notification.hour, notification.minute, id]
            );
        } else {
            this.executeSqlCommand(
                'update notes set ' +
                    'title = ?, ' +
                    'body = ? ' +
                    'where id = ?;',
                [note.title, note.body, id]
            );

            this.executeSqlCommand(
                'update notifications set ' +
                    'day = ?, ' +
                    'month = ?, ' +
                    'year = ?, ' +
                    'hour = ?, ' +
                    'minute = ? ' +
                    'where noteId = ?;',
                [notification.day, notification.month, notification.year, notification.hour, notification.minute, id]
            );
        }
    };

    select(id){
        console.log('select method called');

        this.executeSqlCommand(
            'select * from notes where id = ?',
            [id],
            async (_, { rows: { _array } }) => {
            await this.setState({
                note: {
                    title: _array[0].title,
                    body: _array[0].body,
                },
            });
        });

        this.executeSqlCommand(
            'select * from notifications where noteId = ?',
            [id],
            async (_, { rows: { _array } }) => {
            await this.setState({
                day: _array[0].day,
                month: _array[0].month,
                year: _array[0].year,
                hour: _array[0].hour,
                minute: _array[0].minute,
            });
        });
    };

    delete(id){
        console.log("delete method called")

        this.executeSqlCommand('delete from notes where id = ?', [id]);
    };
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(239,193,3,0.17)',
    },

    title: {
        paddingHorizontal: 10,
        fontSize: 24,
        color: 'rgb(0,0,0)',
        textAlign: 'center',
    },

    text: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'rgba(81,58,13,0.95)',
        marginBottom: 3,
    },

    buttonSaveNote: {
        marginHorizontal: 30,
        marginVertical: 10,
        fontSize: 24,
        color: 'rgba(63,31,0,0.85)',
    },

    buttonDeleteNote: {
        marginHorizontal: 5,
        fontSize: 24,
        color: 'rgba(63,31,0,0.85)',
    },
});