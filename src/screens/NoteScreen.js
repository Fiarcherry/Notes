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
    Switch,
    View,
    Animated,
} from 'react-native';
import {executeSqlCommand} from "../database/executeCommand";

export class NoteScreen extends Component {
    constructor(props) {
        super(props);

        this.animOpacityValue = new Animated.Value(0);
        this.animHeightValue = new Animated.Value(0);

        this.state = {
            note: {
                title: null,
                body: null,
            },
            notification: {
                id: null,
                enable: false,
                day: null,
                month: null,
                year: null,
                hour: null,
                minute: null,
                noteId: null,
            },
            switchValue: false,
        };

        console.log('NOTESCREEN');
    };

    static navigationOptions = {
        title: this.title,
    };

    componentDidMount() {

    };

    componentWillMount() {
        let id = this.props.navigation.getParam('id', null);

        if (id != null) {
            this.select(id);
        }
    };

    async pickDate() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                mode: 'spinner',
                minDate: new Date(),
            });
            let dayToAssign;
            let monthToAssign;
            if (action == DatePickerAndroid.dateSetAction) {
                dayToAssign = this.checkForZero(day);
                monthToAssign = this.checkForZero(month + 1);

                this.setState({
                    notification: {
                        id: this.state.notification.id,
                        enable: this.state.notification.enable,
                        day: dayToAssign,
                        month: monthToAssign,
                        year: year,
                        hour: this.state.notification.hour,
                        minute: this.state.notification.minute,
                        noteId: this.state.notification.noteId,
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
                is24Hour: true,
                mode: 'spinner',
            });
            let hourToAssign;
            let minuteToAssign;
            if (action == TimePickerAndroid.timeSetAction) {
                hourToAssign = this.checkForZero(hour);
                minuteToAssign = this.checkForZero(minute);
                this.setState({
                    notification: {
                        id: this.state.notification.id,
                        enable: this.state.notification.enable,
                        day: this.state.notification.day,
                        month: this.state.notification.month,
                        year: this.state.notification.year,
                        hour: hourToAssign,
                        minute: minuteToAssign,
                        noteId: this.state.notification.noteId,
                    },
                });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    };

    checkForZero(value){
        if (value < 10) return '0' + value;
        return value;
    }

    //не работает
    onPressDeleteNote(){
        this.delete(this.props.navigation.getParam('id', null));

        this.props.navigation.state.params.onGoBack();
        this.props.navigation.navigate("Home", {
            update: true
        });
    }

    setTodayDate(){
        this.state.notification.day = this.checkForZero(new Date().getDate());
        this.state.notification.month = this.checkForZero(new Date().getMonth() + 1);
        this.state.notification.year = new Date().getFullYear();
        this.state.notification.hour = this.checkForZero(new Date().getHours() + 1);
        this.state.notification.minute = this.checkForZero(new Date().getMinutes());

        // this.setState({
        //     notification: {
        //         id: this.state.notification.id,
        //         enable: this.state.notification.enable,
        //         day: this.checkForZero(new Date().getDate()),
        //         month: this.checkForZero(new Date().getMonth() + 1),
        //         year: new Date().getFullYear(),
        //         hour: this.checkForZero(new Date().getHours() + 1),
        //         minute: this.checkForZero(new Date().getMinutes()),
        //         noteId: this.state.notification.noteId,
        //     },
        // });
    }

    toggleSwitch = (value) => {
        this.setState({switchValue: value});

        let opacityEndValue;
        let heightEndValue;

        if (this.state.switchValue){
            opacityEndValue = 0;
            heightEndValue = 0;
            this.setState({
                notification: {
                    id: this.state.notification.id,
                    enable: false,
                    day: this.state.notification.day,
                    month: this.state.notification.month,
                    year: this.state.notification.year,
                    hour: this.state.notification.hour,
                    minute: this.state.notification.minute,
                    noteId: this.state.notification.noteId,
                }
            });
        } else {
            this.setTodayDate();
            opacityEndValue = 1;
            heightEndValue = 30;
            this.setState({
                notification: {
                    id: this.state.notification.id,
                    enable: true,
                    day: this.state.notification.day,
                    month: this.state.notification.month,
                    year: this.state.notification.year,
                    hour: this.state.notification.hour,
                    minute: this.state.notification.minute,
                    noteId: this.state.notification.noteId,
                }
            });
        }
        Animated.parallel([
            Animated.timing(
                this.animOpacityValue,
                {
                    toValue: opacityEndValue,
                    duration: 500,
                }
            ),
            Animated.timing(
                this.animHeightValue,
                {
                    toValue: heightEndValue,
                    duration: 500,
                }
            )
        ]).start();
    };

    render() {
        return(
            <SafeAreaView style = {styles.container}>
                <TouchableOpacity
                    style = {styles.buttonDeleteNote}
                    onPress={() => {
                        this.delete(this.props.navigation.getParam('id', null));

                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.navigate("Home", {
                            update: true
                        });
                    }}
                >
                    <Text>Delete</Text>
                </TouchableOpacity>

                <View style = {styles.notificationView}>
                    <Text style = {styles.notificationText}>Напомнить</Text>
                    <Switch
                        onValueChange = {this.toggleSwitch}
                        value = {this.state.switchValue}
                        thumbColor = {'#6499ff'}
                        trackColor = {{true: 'rgba(100,153,255,0.5)'}}
                    />
                </View>
                <Animated.View style = {[styles.notificationView, {opacity: this.animOpacityValue, height: this.animHeightValue}]}>
                    <TouchableOpacity
                        onPress = {() => this.pickDate()}
                    >
                        <Text style = {styles.notificationText}>{this.state.notification.day}.{this.state.notification.month}.{this.state.notification.year}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => this.pickTime()}
                    >
                        <Text style = {styles.notificationText}>{this.state.notification.hour}:{this.state.notification.minute}</Text>
                    </TouchableOpacity>
                </Animated.View>
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
                    onSubmitEditing = {() => {
                        //TODO сохранить заметку
                    }}
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
                        onSubmitEditing = {() => {
                            //TODO сохранить заметку
                        }}
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
                            id: this.state.notification.id,
                            enable: this.state.notification.enable,
                            day: this.state.notification.day,
                            month: this.state.notification.month,
                            year: this.state.notification.year,
                            hour: this.state.notification.hour,
                            minute: this.state.notification.minute,
                            noteId: this.state.notification.noteId,
                        };

                        this.save(id, note, notification);

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
                      callback = (transaction, { rows: { _array } }) => {},
                      errorCallback = (transaction, _error) => {}){
        db.transaction(tx => {
            tx.executeSql(sqlStatement, args, callback, errorCallback);
        });
    }

    save(id, note, notification){
        console.log('функция save');
        note.title = this.checkEmptyInput(note.title);

        if (id == null) {
            this.executeSqlCommand(
                'insert into note ' +
                    '(title, body) ' +
                    'values (?, ?);',
                [note.title, note.body]
            );
        } else {
            this.executeSqlCommand(
                'update note set ' +
                'title = ?, ' +
                'body = ? ' +
                'where id = ?;',
                [note.title, note.body, id]
            );
        }

        console.log('enable ' + this.state.notification.enable);
        console.log('noteId ' + this.state.notification.noteId);

        if (this.state.notification.enable){
            if (this.state.notification.noteId == null) {
                console.log('проходит');
                console.log(this.state.notification);
                this.executeSqlCommand(
                    'insert into notification ' +
                    '(day, month, year, hour, minute, noteId) ' +
                    'values (?, ?, ?, ?, ?, ?);',
                    [notification.day.toString(), notification.month.toString(), notification.year, notification.hour, notification.minute, id]
                );
            } else {
                this.executeSqlCommand(
                    'update notification set ' +
                    'day = ?, ' +
                    'month = ?, ' +
                    'year = ?, ' +
                    'hour = ?, ' +
                    'minute = ?, ' +
                    'noteId = ? ' +
                    'where id = ?;',
                    [notification.day.toString(), notification.month.toString(), notification.year, notification.hour, notification.minute, id, notification.id]
                );
            }
            this.executeSqlCommand(
            'select * from notification;',
            [id],
            async (_, { rows: { _array } }) => {
                await console.log(_array[0]);
            });
        }
    };

    select(id){
        console.log('функция select');
        this.executeSqlCommand(
            'select * from note where id = ?',
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
            'select * from notification where noteId = ?',
            [id],
            async (_, { rows: { _array } }) => {
            if (_array != null) {
                console.log('выборка уведомления');
                await this.setState({
                    notification: {
                        id: _array[0].id,
                        day: _array[0].day,
                        month: _array[0].month,
                        year: _array[0].year,
                        hour: _array[0].hour,
                        minute: _array[0].minute,
                        noteId: _array[0].noteId,
                    },
                });
            } else {
                console.log('уведомления для записи нет');
            }
        });

    };

    delete(id){
        this.executeSqlCommand('delete from note where id = ?', [id]);
        this.executeSqlCommand('delete from notification where noteId = ?', [id]);

        //db.exec({sql: 'vacuum note'})
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

    notificationView: {
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    notificationText: {
        fontSize: 18,
    },

    testBorder: {
        borderColor: '#f00',
        borderStyle: 'solid',
        borderWidth: 1,
    },
});