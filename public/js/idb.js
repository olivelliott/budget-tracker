let db;

const request = indexedDB.open('budget_tracker', 1)

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_budget_item', { autoIncrement: true });
};

request.onsuccess = function(e) {
    db = e.target.result;
    if (navigator.onLine) {
        uploadBudgetItem();
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode)
};

function saveRecord(record) {
    const transaction = db.transaction(['new_budget_item'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget_item');
    budgetObjectStore.add(record);
};

function uploadBudgetItem() {
    const transaction = db.transaction(['new_budget_item'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget_item');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse.message);
                }
                const transaction = db.transaction(['new_budget_item'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_budget_item');
                budgetObjectStore.clear();

                alert('All budget items have been successfully submitted!')
            })
            .catch(err => {console.log(err)});
        }
    };
};

window.addEventListener('online', uploadBudgetItem);