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

export class NoteScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            body: null,
            day: null,
            month: null,
            year: null,
            hour: null,
            minute: null,
        };
        console.log('NOTESCREEN');
    }

    static navigationOptions = {
        title: this.title,
    };

    componentDidMount() {
        console.log('component did mount Note')
    }

    componentWillMount() {
        console.log('component will mount Note');

        let id = this.props.navigation.getParam('id', null);

        if (id != null) {
            this.select(id);
        }
    }

    async pickDate() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                mode: 'spinner',
                date: new Date(),
            });

            if (action !== DatePickerAndroid.dissmissedAction) {
                console.log('DatePickerAndroid.dissmissedAction');
                this.setState({
                    day: day,
                    month: month + 1,
                    year: year,
                });
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

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
                    hour: hour,
                    minute: minute,
                });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }

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
                <Text>{this.state.day}.{this.state.month}.{this.state.year}   {this.state.hour}:{this.state.minute}</Text>
                <TextInput style = {styles.title}
                    placeholder = 'Title'
                    onChangeText = {title => this.setState({title})}
                    onSubmitEditing = {() => {console.log(this.state.title)}}
                    value = {this.state.title}
                />
                <ScrollView>
                    <TextInput style = {styles.text}
                        placeholder = 'Body'
                        onChangeText = {body => this.setState({body})}
                        onSubmitEditing = {() => {console.log(this.state.body)}}
                        multiline = { true }
                        value = {this.state.body}
                    />
                </ScrollView>
                <Button
                    title = 'Save Note'
                    onPress = {() => {
                        let id = this.props.navigation.getParam('id', null);

                        this.save(id, this.state.title, this.state.body, this.state.day, this.state.month, this.state.year, this.state.hour, this.state.minute);
                        this.setState({
                            title: null,
                            body: null,
                        });

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
    }

    checkEmptyInput(textInput){
        if (textInput === null || textInput === ''){
            return 'Untitled';
        }

        return textInput;
    }

    save(id, title, body, day, month, year, hour, minute){
        console.log("save method called")

        title = this.checkEmptyInput(title);

        if (id == null) {
            db.transaction(
                tx => {
                    tx.executeSql('insert into notes (title, body, day, month, year, hour, minute) values (?, ?, ?, ?, ?, ?, ?)',
                        [title, body, day, month, year, hour, minute]
                    );
                }
            );
        } else {
            db.transaction(
                tx => {
                    tx.executeSql('update notes set title = ?, body = ?, day = ?, month = ?, year = ?, hour = ?, minute = ? where id = ?',
                        [title, body, day, month, year, hour, minute, id]
                    );
                }
            );
        }
    }

    select(id){
        console.log('select method called');

        db.transaction(
            tx => {
                tx.executeSql('select * from notes where id = ?',
                    [id],
                    async (_, { rows: { _array } }) => {
                    await this.setState({
                        title: _array[0].title,
                        body: _array[0].body,
                        day: _array[0].day,
                        month: _array[0].month,
                        year: _array[0].year,
                        hour: _array[0].hour,
                        minute: _array[0].minute,
                    });
                });
            }
        );
    }

    delete(id){
        console.log("delete method called")

        db.transaction(
            tx => {
                tx.executeSql('delete from notes where id = ?',
                    [id]
                );
            }
        );
    }
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