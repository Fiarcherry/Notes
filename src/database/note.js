import {executeSqlCommand} from "./executeCommand";

//не работает
export  function selectAllNote() {
    executeSqlCommand(
    'select * from note',
    [],
    async (_, { rows: { _array } }) => {
        return(await _array);
    })
}

export function createNote() {
    executeSqlCommand(
        'create table if not exists note (' +
        'id integer primary key autoincrement not null, ' +
        'title text, ' +
        'body text) ',
        // 'notificationId integer' +
        // 'foreign key(notificationId) references notification(id))',
        []
    );
}

export function dropNote() {
    executeSqlCommand('drop table note', []);

}

