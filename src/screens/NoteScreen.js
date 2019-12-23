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
        console.log('t:' + this.state.title);
        console.log(this.state.body);

        let id = this.props.navigation.getParam('id', null);
        if (id != null) {
            this.select(id);
        }

        console.log(this.state.title);
        console.log(this.state.body);
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
                            this.add(this.state.title, this.state.body);
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
                </ScrollView>
            </View>
        )
    }

    add(title, body){
        console.log("add method called")

        if (title === null || title === '' || body === null || body === ''){
            console.log('something is empty');
            return false;
        }

        db.transaction(
            tx => {
                tx.executeSql('insert into notes (title, body) values (?, ?)',
                    [title, body]
                );
            }
        );
    }

    select(id){
        console.log('select method called');

        db.transaction(
            tx => {
                tx.executeSql('select * from notes where id = ?',
                    [id],
                    async (_, { rows: { _array } }) => {
                    await this.setState({
                        title: _array.title,
                        body: _array.body
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