const newBookBtn = document.querySelector('.newbook-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const submitBtn = document.querySelector('.submit-btn');
const newBookDialog = document.querySelector('.newbook-dialog');
const inputTitle = document.getElementById('title');
const inputAuthor = document.getElementById('author');
const inputGenre = document.getElementById('genre');
const inputYear = document.getElementById('year');
const inputPages = document.getElementById('pages');
const inputRead = document.getElementById('read');
const libraryTable = document.querySelector('.library-table');
const libraryTbody = libraryTable.querySelector('tbody');

newBookBtn.addEventListener('click', () => {
    submitBtn.textContent = "Add";
    newBookDialog.returnValue = "";
    newBookDialog.showModal();
});
cancelBtn.addEventListener('click', () => newBookDialog.close());

// return value = id of current book that user is editing. if empty = new book.
newBookDialog.addEventListener('submit', (e) => {
    if(newBookDialog.returnValue !== ""){
        editBook(newBookDialog.returnValue);
    }
    else
        addNewBookToLibrary(inputTitle.value, inputAuthor.value, inputGenre.value, inputYear.value, inputPages.value, inputRead.checked);
});

newBookDialog.addEventListener('close', () => {
    inputTitle.value = '';
    inputAuthor.value = '';
    inputGenre.value = '';
    inputYear.value = '';
    inputPages.value = '';
    inputRead.checked = false;
});

const libraryArr = [];

function Book(title, author, genre, year, pages, read){
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
}

function addNewBookToLibrary(title, author, genre, year, pages, read){
    const book = new Book(title, author, genre, year, pages, read);
    libraryArr.push(book);
    updateLibraryTable();
}

function editBook(bookID){
    let book = libraryArr.find(item => item.id === bookID);

    book.title = inputTitle.value;
    book.author = inputAuthor.value;
    book.genre = inputGenre.value;
    book.year = inputYear.value;
    book.pages = inputPages.value;
    book.read = inputRead.checked;
    updateLibraryTable();
}

Book.prototype.toggleRead = function(){
    this.read = !this.read;
}

function updateLibraryTable(){
    // clear table
    while(libraryTbody.firstChild)
        libraryTbody.removeChild(libraryTbody.firstChild);

    libraryArr.forEach(book => {
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-id", book.id);
        for(const [key, value] of Object.entries(book)){
            if(key=== "id")
                continue
            const newCell = document.createElement("td");
            newCell.headers = `${key}-column`;
            if(key === "read"){
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener('change', () => book.toggleRead());
                newCell.appendChild(checkbox);
                checkbox.checked = book.read;
            }
            else{
                if(value === '')
                    newCell.textContent = "N/A";
                else {
                    newCell.textContent = value;
                }
            }

            newRow.appendChild(newCell);
        }

        // add a cell with an edit  button
        const editCell = document.createElement("td");
        editCell.headers = "edit-column";
        const editButton = document.createElement("button");
        editButton.addEventListener('click', () => {
            newBookDialog.returnValue = book.id;
            newBookDialog.showModal();
            inputTitle.value = book.title;
            inputAuthor.value = book.author;
            inputGenre.value = book.genre;
            inputYear.value = book.year;
            inputPages.value = book.pages;
            inputRead.checked = book.read;
            submitBtn.textContent = "Edit";
        });

        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editCell.appendChild(editButton);
        newRow.appendChild(editCell);

        // add a cell with a remove  button
        const removeCell = document.createElement("td");
        removeCell.headers = "remove-column";
        const removeButton = document.createElement("button");
        removeButton.addEventListener('click', () => {
            libraryArr.splice(libraryArr.find(item => item.id === book.id), 1);
            libraryTbody.removeChild(newRow)
        });

        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeCell.appendChild(removeButton);
        newRow.appendChild(removeCell);

        libraryTbody.appendChild(newRow);
    });
}