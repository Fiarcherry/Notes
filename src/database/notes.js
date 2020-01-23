import {executeSqlCommand} from "./model";

export  function selectAllNotes() {
    executeSqlCommand(
        'select * from notes',
        [],
        async (_, { rows: { _array } }) => {
        await this.setState({
            notes: _array,
            refreshing: false
        });
    });
}

export function createNotes() {
    executeSqlCommand(
        'create table if not exists notes (' +
        'id integer primary key autoincrement not null, ' +
        'title text, ' +
        'body text)',
        []
    );
}

export function dropNotes() {
    executeSqlCommand('drop table notes', []);
}

