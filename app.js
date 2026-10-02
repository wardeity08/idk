const defaultBooks = [

  {
    title: "The Last Train",
    author: "Mara Ellis",
    genre: "Mystery",
    cover: "mystery",
    description:
      "A missing passenger, an empty station, and one final train.",
    link: "reader.html?book=last-train"
  },

  {
    title: "The House With No Clock",
    author: "Eli Mercer",
    genre: "Fantasy",
    cover: "fantasy",
    description:
      "A mysterious house appears at midnight.",
    link: "reader.html?book=house"
  },

  {
    title: "Letters From Tomorrow",
    author: "Noah Vale",
    genre: "Sci-Fi",
    cover: "scifi",
    description:
      "A student receives letters written by his future self.",
    link: "reader.html?book=letters"
  },

  {
    title: "The Order Within",
    author: "Nikender Singh",
    genre: "Psychological Thriller",
    cover: "mystery",
    description:
      "A psychological murder mystery about trust, hidden motives, and a cold case that refuses to stay buried.",
    link: "reader.html?book=order-within"
  }

];


const booksContainer = document.getElementById("books");
const search = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");

const bookForm = document.getElementById("bookForm");
const submitMessage = document.getElementById("submitMessage");


/* LOAD USER BOOKS */

let userBooks =
  JSON.parse(localStorage.getItem("openshelfBooks")) || [];


function getAllBooks() {

  return [...defaultBooks, ...userBooks];

}


/* DISPLAY BOOKS */

function displayBooks(list) {

  booksContainer.innerHTML = "";

  if (list.length === 0) {

    booksContainer.innerHTML = `
      <p style="
        color:#929096;
        grid-column:1/-1;
        padding:30px 0;
      ">
        No books found.
      </p>
    `;

    return;
  }


  list.forEach(book => {

    const card = document.createElement("div");

    card.className = "card";


    card.innerHTML = `

      <div class="cover ${book.cover}">
        ${book.title}
      </div>

      <div class="card-info">

        <div class="genre">
          ${book.genre}
        </div>

        <h3>
          ${book.title}
        </h3>

        <p>
          by ${book.author}
          <br><br>
          ${book.description}
        </p>

        <a
          class="read"
          href="${book.link}"
        >
          Read book →
        </a>

      </div>

    `;


    booksContainer.appendChild(card);

  });

}


/* FILTER BOOKS */

function filterBooks() {

  const text =
    search.value.toLowerCase().trim();

  const selectedGenre =
    genreFilter.value;


  const results = getAllBooks().filter(book => {

    const matchesSearch =
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text) ||
      book.genre.toLowerCase().includes(text);


    const matchesGenre =
      selectedGenre === "all" ||
      book.genre === selectedGenre;


    return matchesSearch && matchesGenre;

  });


  displayBooks(results);

}


/* SEARCH */

search.addEventListener(
  "input",
  filterBooks
);


/* GENRE FILTER */

genreFilter.addEventListener(
  "change",
  filterBooks
);


/* SUBMIT BOOK */

bookForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const title =
      document.getElementById("bookTitle").value.trim();

    const author =
      document.getElementById("bookAuthor").value.trim();

    const genre =
      document.getElementById("bookGenre").value;

    const description =
      document.getElementById("bookDescription").value.trim();


    const newBook = {

      title: title,

      author: author,

      genre: genre,

      cover: getCoverClass(genre),

      description: description,

      link:
        "reader.html?book=community-" +
        Date.now()

    };


    userBooks.push(newBook);


    localStorage.setItem(
      "openshelfBooks",
      JSON.stringify(userBooks)
    );


    bookForm.reset();


    submitMessage.textContent =
      "✓ Book added to your library.";


    displayBooks(getAllBooks());


    setTimeout(() => {

      submitMessage.textContent = "";

    }, 4000);

  }
);


/* CHOOSE COVER STYLE */

function getCoverClass(genre) {

  if (genre === "Fantasy") {
    return "fantasy";
  }

  if (genre === "Sci-Fi") {
    return "scifi";
  }

  return "mystery";

}


/* INITIAL DISPLAY */

displayBooks(getAllBooks());
