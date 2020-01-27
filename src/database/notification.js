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

export function createNotification() {
    executeSqlCommand(
        'create table if not exists notification (' +
        'id integer primary key autoincrement not null, ' +
        'day integer, ' +
        'month integer, ' +
        'year integer, ' +
        'hour integer, ' +
        'minute integer',
        []
    );
}

export function dropNotification() {
    executeSqlCommand('drop table notification', []);
}