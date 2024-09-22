//fetching API
const getUsers = async () => {
    try {
        const response = await fetch("http://gsmktg.azurewebsites.net/api/v1/techlabs/test/students");
        if (!response.ok) {
            throw new Error(`Error Occurred: ${response.status}`);
        }
        const json = await response.json();
        console.log("Raw JSON Response:", json);


        const users = json.map(student => ({
            RollNo: student.rollNo,
            Name: student.name || 'N/A',
            Email: student.email || 'N/A',
            Id: student.id || 'N/A'
        }));

        console.log("Extracted Users:", users);
        displayUsers(users);

    } catch (error) {
        console.error("Fetch error: ", error);
    }
};

//display
const displayUsers = (users) => {
    const userTableContainer = document.querySelector(".user-list-section");
    userTableContainer.innerHTML = "";

    const tableHeader = `
    <table>
    <thead>
    <tr>
        <th>RollNo</th>
        <th>Name</th>
        <th>Email</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
          ${users.map(user => createUserRow(user)).join('')}
    </tbody>
    </table>
    `;

    userTableContainer.innerHTML = tableHeader;
};


const createUserRow = (user) => {
    return `
    <tr data-user-id="${user.Id}">
        <td>${user.RollNo}</td>
        <td><input type="text" value="${user.Name}" disabled></td>
        <td><input type="text" value="${user.Email}" disabled></td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="enableEditing('${user.Id}')">Edit</button>
            <button class="delete-btn" onclick="deleteUser('${user.Id}')">Delete</button>
        </td>
    </tr>
    `;
};

//Create
const button = document.querySelector(".button");
button.addEventListener("click", async () => {
    const rollNo = document.querySelector("#RollNoInput").value;
    const name = document.querySelector("#nameInput").value;
    const email = document.querySelector("#emailInput").value;

    const newUser = { rollNo, name, email };

    try {
        const response = await fetch("http://gsmktg.azurewebsites.net/api/v1/techlabs/test/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error(`Failed to add user: ${response.status}`);
        }


        const addedUserId = await response.json();
        console.log("User Added ID:", addedUserId);

        await getUsers();

        document.querySelector("#RollNoInput").value = '';
        document.querySelector('#nameInput').value = '';
        document.querySelector('#emailInput').value = '';

    } catch (err) {
        console.error('Error adding user:', err);
    }
});
//delete
const deleteUser = async (userId) => {
    try {
        const response = await fetch(`http://gsmktg.azurewebsites.net/api/v1/techlabs/test/students/${userId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.status}`);
        }

        removeUserFromTable(userId);
        alert("User deleted successfully");

        console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
        console.error("Delete error: ", error);
    }
};


const removeUserFromTable = (userId) => {
    const rowToDelete = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (rowToDelete) {
        rowToDelete.remove();
    }
};
//update
const enableEditing = (userId) => {
    const row = document.querySelector(`tr[data-user-id="${userId}"]`);
    const nameInput = row.querySelector("td:nth-child(2) input");
    const emailInput = row.querySelector("td:nth-child(3) input");
    const editButton = row.querySelector(".edit-btn");

    if (editButton.textContent === "Edit") {

        nameInput.disabled = false;
        emailInput.disabled = false;
        editButton.textContent = "Save";
    } else {

        const updatedUser = {
            name: nameInput.value,
            email: emailInput.value
        };


        updateUser(userId, updatedUser);

        nameInput.disabled = true;
        emailInput.disabled = true;
        editButton.textContent = "Edit";
    }
};


const updateUser = async (userId, updatedUser) => {
    try {
        const response = await fetch(`http://gsmktg.azurewebsites.net/api/v1/techlabs/test/students/${userId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status}`);
        }

        const result = await response.json();
        console.log("User updated successfully:", result);

    } catch (error) {
        console.error("Update error: ", error);
    }
};


getUsers();
