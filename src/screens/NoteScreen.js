import React, { Component } from 'react';
import {
    View,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';

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

    render() {
        return(
            <View>
                <ScrollView>
                    <TextInput
                        placeholder = 'Title'
                        onChangeText = {title => this.setState({title})}
                        onSubmitEditing = {() => {console.log(this.state.title)}}
                        value = {this.state.title}
                    />
                    <TextInput
                        placeholder = 'Body'
                        onChangeText = {body => this.setState({body})}
                        onSubmitEditing = {() => {console.log(this.state.body)}}
                        multiline = { true }
                        value = {this.state.body}
                    />
                    <Button
                        title = "Save Note"
                        onPress = {() => {
                            let id = this.props.navigation.getParam('id', null);

                            this.save(id, this.state.title, this.state.body);
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
                </ScrollView>
            </View>
        )
    }

    checkEmptyInput(textInput){
        if (textInput === null || textInput === ''){
            return 'Untitled';
        }

        return textInput;
    }

    save(id, title, body){
        console.log("save method called")

        title = this.checkEmptyInput(title);

        if (id == null) {
            db.transaction(
                tx => {
                    tx.executeSql('insert into notes (title, body) values (?, ?)',
                        [title, body]
                    );
                }
            );
        } else {
            db.transaction(
                tx => {
                    tx.executeSql('update notes set title = ?, body = ? where id = ?',
                        [title, body, id]
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
                        body: _array[0].body
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