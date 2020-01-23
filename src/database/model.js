export function executeSqlCommand(
    sqlStatement,
    args,
    callback = (transaction, { rows: { _array } }) => {
        console.log(JSON.stringify(_array));
    },
    errorCallback = (transaction, _error) => {
        console.log(JSON.stringify(_error));
    }){
    db.transaction(tx => {
        tx.executeSql(sqlStatement, args, callback, errorCallback);
    });
}