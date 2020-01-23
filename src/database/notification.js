import {executeSqlCommand} from "./model";

export function createNotifications() {
    executeSqlCommand(
        'create table if not exists notifications (' +
        'id integer primary key autoincrement not null, ' +
        'day integer, ' +
        'month integer, ' +
        'year integer, ' +
        'hour integer, ' +
        'minute integer, ' +
        'noteId integer, ' +
        'foreign key(noteId) references notes(id))',
        []
    );
}