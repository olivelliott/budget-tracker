let db;

const request = indexedDB.open('budget_tracker', 1)

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_budget_item', { autoIncrement: true });
};

request.onsuccess = function(e) {
    db = e.target.result;

    if (navigator.onLine) {
        // * <<>>
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode)
};