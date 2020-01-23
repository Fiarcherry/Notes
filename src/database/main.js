import {createNotes, dropNotes} from "./notes";
import{executeSqlCommand} from "./model";

export function dropAllTables(){
    dropNotes();
}

export function onStart() {
    executeSqlCommand('PRAGMA foreign_keys=on', []);
    createNotes();
}