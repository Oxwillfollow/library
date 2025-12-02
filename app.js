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

newBookBtn.addEventListener('click', () => newBookDialog.showModal());
cancelBtn.addEventListener('click', () => newBookDialog.close());
newBookDialog.addEventListener('submit', () => {
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
}

function addNewBookToLibrary(title, author, genre, year, pages, read){
    const book = new Book(title, author, genre, year, pages, read);
    libraryArr.push(book);
    updateLibraryTable();
}

function updateLibraryTable(){
    // clear library table
    while(libraryTbody.firstChild)
        libraryTbody.removeChild(libraryTbody.firstChild);

    libraryArr.forEach(book => {
        const newRow = document.createElement("tr");
        for(const [key, value] of Object.entries(book)){
            const newCell = document.createElement("td");
            newCell.headers = `${key}-column`;

            if(key === "read"){
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener('change', () => book.read = !book.read);
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

        // add a cell with a delete button
        const removeCell = document.createElement("td");
        removeCell.headers = "remove-column";
        const removeButton = document.createElement("button");
        removeButton.addEventListener('click', () => {
            libraryArr.splice(libraryArr.indexOf(book), 1);
            libraryTbody.removeChild(newRow)
        });

        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeCell.appendChild(removeButton);
        newRow.appendChild(removeCell);

        libraryTbody.appendChild(newRow);
    });
}