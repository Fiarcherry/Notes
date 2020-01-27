import{executeSqlCommand} from "./executeCommand";
import {createNote, dropNote} from "./note";
import {createNotification, dropNotification} from "./notification";

export function dropAllTables(){
    dropNote();
    dropNotification();
}

export function onStart() {
    executeSqlCommand('PRAGMA foreign_keys=on', []);
    createNote();
    createNotification();
}