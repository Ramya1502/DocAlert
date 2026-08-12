 // ===============================
// Sample Documents
// ===============================

let documents = JSON.parse(localStorage.getItem("documents")) || [
    {
        name: "Passport",
        type: "Identity",
        expiry: "2026-08-20"
    },
    {
        name: "Driving License",
        type: "License",
        expiry: "2026-12-30"
    },
    {
        name: "Insurance",
        type: "Insurance",
        expiry: "2026-08-01"
    }
];


// ===============================
// Show Today's Date
// ===============================

let today = new Date();

document.getElementById("today").innerText =
    today.toLocaleDateString();


// ===============================
// Add Document
// ===============================

function addDocument() {

    let name = document.getElementById("documentName").value;
    let type = document.getElementById("documentType").value;
    let expiry = document.getElementById("expiryDate").value;

    if (name === "" || type === "" || expiry === "") {
        alert("Please fill all fields");
        return;
    }

    documents.push({
        name: name,
        type: type,
        expiry: expiry
    });

    localStorage.setItem("documents", JSON.stringify(documents));

    document.getElementById("documentName").value = "";
    document.getElementById("documentType").value = "";
    document.getElementById("expiryDate").value = "";

    alert("Document added successfully!");

    // Update document list
    displayDocuments();

    // Update reminders
    showReminders();
}


// ===============================
// Display Documents
// ===============================

function displayDocuments(list = documents) {

    let table = document.getElementById("documentList");

    table.innerHTML = "";

    let active = 0;
    let expiring = 0;
    let expired = 0;

    let today = new Date();

    today.setHours(0, 0, 0, 0);


    list.forEach((doc) => {

        let expiryDate = new Date(doc.expiry);

        let difference = expiryDate - today;

        let days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


        let status;
        let statusClass;


        if (days < 0) {

            status = "Expired";
            statusClass = "status-expired";
            expired++;

        }
        else if (days <= 30) {

            status = "Expiring Soon";
            statusClass = "status-warning";
            expiring++;

        }
        else {

            status = "Active";
            statusClass = "status-active";
            active++;
        }


        // Find original document index
        let originalIndex = documents.indexOf(doc);


        let row = `
            <tr>

                <td>📄 ${doc.name}</td>

                <td>${doc.type}</td>

                <td>${doc.expiry}</td>

                <td>
                    ${days < 0 ? "Expired" : days + " days"}
                </td>

                <td class="${statusClass}">
                    ${status}
                </td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteDocument(${originalIndex})">
                        Delete
                    </button>
                </td>

            </tr>
        `;

        table.innerHTML += row;
    });


    // ===============================
    // Update Dashboard
    // ===============================

    document.getElementById("total").innerText =
        documents.length;

    document.getElementById("active").innerText =
        countStatus("active");

    document.getElementById("expiring").innerText =
        countStatus("expiring");

    document.getElementById("expired").innerText =
        countStatus("expired");
}


// ===============================
// Count Status
// ===============================

function countStatus(type) {

    let count = 0;

    let today = new Date();

    today.setHours(0, 0, 0, 0);


    documents.forEach(function(doc) {

        let expiryDate = new Date(doc.expiry);

        let difference = expiryDate - today;

        let days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


        if (type === "active" && days > 30) {
            count++;
        }

        if (type === "expiring" && days >= 0 && days <= 30) {
            count++;
        }

        if (type === "expired" && days < 0) {
            count++;
        }

    });

    return count;
}


// ===============================
// Delete Document
// ===============================

function deleteDocument(index) {

    if (confirm("Are you sure you want to delete this document?")) {

        documents.splice(index, 1);

        localStorage.setItem("documents", JSON.stringify(documents));


        // Update document list
        displayDocuments();

        // Update reminders
        showReminders();
    }
}


// ===============================
// Search Documents
// ===============================

function searchDocuments() {

    let search =
        document.getElementById("search")
        .value
        .toLowerCase();


    let filtered =
        documents.filter(function(doc) {

            return doc.name
                .toLowerCase()
                .includes(search);

        });


    displayDocuments(filtered);
}


// ===============================
// Show Expiry Reminders
// ===============================

function showReminders() {

    let reminderList =
        document.getElementById("reminderList");


    if (!reminderList) {
        return;
    }


    reminderList.innerHTML = "";


    let today = new Date();

    today.setHours(0, 0, 0, 0);


    let found = false;


    documents.forEach(function(doc) {

        let expiryDate = new Date(doc.expiry);

        let difference = expiryDate - today;

        let days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


        // Show documents expiring within 30 days
        if (days >= 0 && days <= 30) {

            found = true;


            reminderList.innerHTML += `
                <div class="reminder-item">

                    🔔 <strong>${doc.name}</strong>

                    <br>

                    📄 Type: ${doc.type}

                    <br>

                    📅 Expiry Date: ${doc.expiry}

                    <br>

                    ⏳ ${days} days remaining

                </div>
            `;
        }

    });


    if (!found) {

        reminderList.innerHTML = `
            <p>No documents are expiring soon.</p>
        `;
    }
}


// ===============================
// Load Documents
// ===============================

displayDocuments();

showReminders();