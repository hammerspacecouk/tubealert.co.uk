'use strict';

export const ALL_LINES = 'allLines';
export const SUBSCRIPTIONS = 'subscriptions';

const DBKEY = 'TubeAlert';
const DBVERSION = 1;

let DbInstance = null;

const initDB = (callback) => {
    if (!('indexedDB' in window)) {
        return;
    }

    if (DbInstance) {
        return callback();
    }

    const DB = window.indexedDB.open(DBKEY, DBVERSION);
    DB.onsuccess = evt => {
        DbInstance = evt.target.result;
        callback();
    };
    DB.onupgradeneeded = (evt) => {
        const dbobject = evt.target.result;
        if (evt.oldVersion < DBVERSION) {
            // Create our object store and define indexes.
            dbobject.createObjectStore('data');
        }
    };
};

const getDatabaseTable = () => {
    const transaction = DbInstance ? DbInstance.transaction(['data'], 'readwrite') : null;
    return transaction ? transaction.objectStore('data') : null;
};

export const getKey = (key, callback) => {
    initDB(() => {
        const tbl = getDatabaseTable();
        if (tbl) {
            tbl.get(key).onsuccess = event => {
                const result = event.target.result;
                if (result && callback) {
                    callback(JSON.parse(result));
                }
            };
        }
    });
};

export const setKey = (key, value, callback) => {
    initDB(() => {
        const tbl = getDatabaseTable();
        if (tbl) {
            const request = tbl.put(JSON.stringify(value), key);
            request.onsuccess = () => {
                if (callback) {
                    callback();
                }
            };
        }
    });
};
