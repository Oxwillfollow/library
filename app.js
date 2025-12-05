class Book{
    constructor(title, author, genre, year, pages, read){
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.pages = pages;
        this.read = read;
    }

    id = crypto.randomUUID();
}

const libraryManager = (function(){ 
    const libraryArr = [];

    const cacheDOM = (function (){
        const newBookBtn = document.querySelector('.newbook-btn');
        const submitBtn = document.querySelector('.submit-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        const placeholderRow = document.getElementById('placeholder-row');
        const bookDialog = document.querySelector('.book-dialog');
        const inputTitle = document.getElementById('title');
        const inputAuthor = document.getElementById('author');
        const inputGenre = document.getElementById('genre');
        const inputYear = document.getElementById('year');
        const inputPages = document.getElementById('pages');
        const inputRead = document.getElementById('read');
        const libraryTable = document.querySelector('.library-table');
        const libraryTbody = libraryTable.querySelector('tbody');

        return {
            newBookBtn,
            submitBtn,
            cancelBtn,
            placeholderRow,
            bookDialog,
            inputTitle,
            inputAuthor,
            inputGenre,
            inputYear,
            inputPages,
            inputRead,
            libraryTable,
            libraryTbody,
        }
    })();

    function bindEvents(){
        cacheDOM.newBookBtn.addEventListener('click', () => {
            cacheDOM.submitBtn.textContent = "Add";
            cacheDOM.bookDialog.returnValue = "";
            cacheDOM.bookDialog.showModal();
        });
        cacheDOM.cancelBtn.addEventListener('click', () => cacheDOM.bookDialog.close());

        // return value = id of current book that user is editing. if empty = new book.
        cacheDOM.bookDialog.addEventListener('submit', (e) => {
            if(cacheDOM.bookDialog.returnValue !== ""){
                editBook(cacheDOM.bookDialog.returnValue);
            }
            else
                addNewBookToLibrary(cacheDOM.inputTitle.value, cacheDOM.inputAuthor.value, cacheDOM.inputGenre.value, cacheDOM.inputYear.value, cacheDOM.inputPages.value, cacheDOM.inputRead.checked);
        });

        cacheDOM.bookDialog.addEventListener('close', () => {
            cacheDOM.inputTitle.value = '';
            cacheDOM.inputAuthor.value = '';
            cacheDOM.inputGenre.value = '';
            cacheDOM.inputYear.value = '';
            cacheDOM.inputPages.value = '';
            cacheDOM.inputRead.checked = false;
        });
    }

    function init(){
        bindEvents();
    }


    function addNewBookToLibrary(title, author, genre, year, pages, read){
        const book = new Book(title, author, genre, year, pages, read);
        libraryArr.push(book);
        updateLibraryTable();
    }

    function editBook(bookID){
        let book = libraryArr.find(item => item.id === bookID);

        book.title = cacheDOM.inputTitle.value;
        book.author = cacheDOM.inputAuthor.value;
        book.genre = cacheDOM.inputGenre.value;
        book.year = cacheDOM.inputYear.value;
        book.pages = cacheDOM.inputPages.value;
        book.read = cacheDOM.inputRead.checked;
        updateLibraryTable();
    }

    Book.prototype.toggleRead = function(){
        this.read = !this.read;
    }

    function updateLibraryTable(){
        // clear table
        let rowArray = [...cacheDOM.libraryTbody.children];
        rowArray.forEach(child => {
            if(child.id !== "placeholder-row")
                cacheDOM.libraryTbody.removeChild(child);           
        });

        if(libraryArr.length <= 0){
            cacheDOM.placeholderRow.style.display = "table-row";
            return;
        }

        cacheDOM.placeholderRow.style.display = "none";

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
                cacheDOM.bookDialog.returnValue = book.id;
                cacheDOM.bookDialog.showModal();
                cacheDOM.inputTitle.value = book.title;
                cacheDOM.inputAuthor.value = book.author;
                cacheDOM.inputGenre.value = book.genre;
                cacheDOM.inputYear.value = book.year;
                cacheDOM.inputPages.value = book.pages;
                cacheDOM.inputRead.checked = book.read;
                cacheDOM.submitBtn.textContent = "Edit";
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
                libraryArr.splice(libraryArr.findIndex(item => item.id === book.id), 1);
                updateLibraryTable();
            });

            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-btn");
            removeCell.appendChild(removeButton);
            newRow.appendChild(removeCell);

            cacheDOM.libraryTbody.appendChild(newRow);
        });
    }

    init();
})();