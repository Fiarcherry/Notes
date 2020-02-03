import {executeSqlCommand} from "./executeCommand";

export  function selectAllNotification() {
    executeSqlCommand(
    'select * from notification',
    [],
    async (_, { rows: { _array } }) => {
        await this.setState({
            notes: _array,
            refreshing: false
        });
    });
}

export  function selectOneNotification(id) {
    executeSqlCommand(
    'select * from notification where id = ' + id,
    [],
    async (_, { rows: { _array } }) => {
        await this.setState({
            notes: _array,
            refreshing: false
        });
    });
}

export function createNotification() {
    executeSqlCommand(
        'create table if not exists notification (' +
        'id integer primary key autoincrement not null, ' +
        'day text, ' +
        'month text, ' +
        'year integer, ' +
        'hour integer, ' +
        'minute integer' +
        'noteId integer' +
        'foreign key(noteId) references note(id))',
        []
    );
}

export function dropNotification() {
    executeSqlCommand('drop table notification', []);
}