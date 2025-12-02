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
    inputRead.checked = false;
});

const libraryArr = [];

function Book(title, author, genre, year, pages, haveRead){
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
    this.pages = pages;
    this.haveRead = haveRead;
}

function addNewBookToLibrary(title, author, genre, year, pages, haveRead){
    const book = new Book(title, author, genre, year, pages, haveRead);
    libraryArr.push(book);
    console.dir(book);
}