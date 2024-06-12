let data = JSON.parse(localStorage.getItem("object")) || [];
let uniqueId = parseInt(localStorage.getItem("uniqueId")) || data.length;

// Display Books
function displayBooks() {
  let tableData = document.querySelector(".tableData");

  if (!tableData) {
    console.error('Element with class "tableData" not found');
    return;
  }
  let books = localStorage.getItem("object");
  let booksData = JSON.parse(books) || [];
  let element = "";
  booksData.map((record) => {
    element += `<tr>
      <td>${record.id + 1}</td>
      <td>${record.name}</td>
      <td>${record.author}</td>
      <td>${record.publisher}</td>
      <td>${record.date}</td>
      <td>
        <button class="button-style" onclick="deleteBook(${
          record.id
        })">Delete</button>
        <button class="button-style" onclick="edit(${
          record.id
        }, this)">Update</button>
      </td>
    </tr>`;
  });
  tableData.innerHTML = element;
}

// Add Books Function
function add() {
  let bookName = document.querySelector(".bookName").value;
  let authorName = document.querySelector(".authorName").value;
  let publisherName = document.querySelector(".publisherName").value;
  let date = document.querySelector(".date").value;

  if (bookName == "" || authorName == "" || publisherName == "" || date == "") {
    alert("Enter books data");
    return;
  }
  // Check for duplicate book name
  if (data.some((book) => book.name.toLowerCase() === bookName.toLowerCase())) {
    alert("This book name already exists. Please enter a different name.");
    return;
  }

  let newObj = {
    id: uniqueId++,
    name: bookName,
    author: authorName,
    publisher: publisherName,
    date: date,
  };

  data.push(newObj);
  localStorage.setItem("object", JSON.stringify(data));
  localStorage.setItem("uniqueId", uniqueId.toString());
  displayBooks();
}

// Edit Books Function
function edit(id, button) {
  let row = button.parentElement.parentElement;
  let cells = row.querySelectorAll("td:not(:first-child):not(:last-child)");
  cells.forEach((cell) => (cell.contentEditable = true));
  button.textContent = "Save";
  row.classList.add("editing-row");

  // Listen for Enter key to save changes or clicking the Save button again
  button.onclick = function () {
    let updatedName = row.cells[1].textContent;
    let updatedAuthor = row.cells[2].textContent;
    let updatedPublisher = row.cells[3].textContent;
    let updatedDate = row.cells[4].textContent;

    if (
      data.some(
        (book) =>
          book.id !== id &&
          book.name.toLowerCase() === updatedName.toLowerCase()
      )
    ) {
      alert("This book name already exists. Please enter a different name");
      return;
    }

    let index = data.findIndex((rec) => rec.id === id);
    if (index !== -1) {
      data[index] = {
        id: id,
        name: updatedName,
        author: updatedAuthor,
        publisher: updatedPublisher,
        date: updatedDate,
      };
      // Check for duplicate book name

      localStorage.setItem("object", JSON.stringify(data));
      cells.forEach((cell) => (cell.contentEditable = false)); // Disable editing
      button.textContent = "Update";
      button.onclick = () => edit(id, button); // Reassign the original onclick event
      row.classList.remove("editing-row");
    }
  };


}

// Delete Function
function deleteBook(id) {
  data = data.filter((rec) => rec.id !== id);
  localStorage.setItem("object", JSON.stringify(data));
  displayBooks();
}

// Publisher Function
function publishers() {
  let tableData = document.querySelector(".publisherData");

  if (!tableData) {
    console.error('Element with class "publisherData" not found');
    return;
  }

  let books = localStorage.getItem("object");
  let booksData = JSON.parse(books) || [];
  let publisherMap = {};

  // Group books by publisher
  booksData.forEach((record) => {
    if (!publisherMap[record.publisher]) {
      publisherMap[record.publisher] = 0;
    }
    publisherMap[record.publisher]++;
  });

  let element = "";
  for (let publisher in publisherMap) {
    element += `<tr>
      <td>${publisher}</td>
      <td>${publisherMap[publisher]}</td>
      <td>
        <button class="button-style" onclick="deletePublisherBooks('${publisher}')">Delete</button>
      </td>
    </tr>`;
  }
  tableData.innerHTML = element;
}

// Delete Publisher Books Function
function deletePublisherBooks(publisher) {
  data = data.filter((rec) => rec.publisher !== publisher);
  localStorage.setItem("object", JSON.stringify(data));
  publishers();
}

// Author Function
function authors() {
  let authorData = document.querySelector(".authorData");

  if (!authorData) {
    console.error('Element with class "authorData not found');
    return;
  }

  let books = localStorage.getItem("object");
  let booksData = JSON.parse(books) || [];
  let authorMap = {};

  // Group books by author
  booksData.forEach((record) => {
    if (!authorMap[record.author]) {
      authorMap[record.author] = 0;
    }
    authorMap[record.author]++;
  });

  let element = "";
  for (let author in authorMap) {
    element += `<tr>
      <td>${author}</td>
      <td>${authorMap[author]}</td>
      <td>
        <button class="button-style" onclick="deleteAuthorBooks('${author}')">Delete</button>
      </td>
    </tr>`;
  }
  authorData.innerHTML = element;
}

// Delete author Books Function
function deleteAuthorBooks(author) {
  data = data.filter((rec) => rec.author !== author);
  localStorage.setItem("object", JSON.stringify(data));
  authors();
}
