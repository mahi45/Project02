// Define UI elements
let form = document.querySelector('#book-form');
let booklist = document.querySelector('#book-list');


// Define Class
class Books {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    // Add book to the list
    static addToBookList(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }
    // Clear input field after adding book
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    // Delete books form list
    static deleteFromBook(target) {
        if (target.hasAttribute('href')) {
            if (confirm("Are you sure to delete?")) {
                target.parentElement.parentElement.remove();
                Store.deleteBook(target.parentElement.previousElementSibling.textContent.trim());
                UI.showAlert("You have successfully deleted this book", "warning");
            }
        }
    }
    // Show Alert Message
    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `myclass ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => {
            document.querySelector('.myclass').remove()
        }, 2000);
    }
}

// Local storage Class
class Store {
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        let books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static displayBooks() {
        let books = Store.getBook();
        books.forEach(book => {
            UI.addToBookList(book);
        })
    }
    static deleteBook(isbn) {
        let books = Store.getBook();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}




// Add Event Listner
form.addEventListener('submit', newBook);
booklist.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks())







// Define Function
function newBook(e) {
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let isbn = document.querySelector('#isbn').value;

    let book = new Books(title, author, isbn);

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert("Field must not be empty", "error");
    } else {
        UI.addToBookList(book);
        UI.clearFields();
        UI.showAlert("You have successfully added this book", "success");
        Store.addBook(book);
    }

    e.preventDefault();
}

// Removing Book
function removeBook(e) {
    UI.deleteFromBook(e.target);

    e.preventDefault();
}