const defaultBooks = [
  {
    title: "The Last Train",
    author: "Mara Ellis",
    genre: "Mystery",
    cover: "mystery",
    description: "A missing passenger, an empty station, and one final train.",
    link: "reader.html?book=last-train"
  },
  {
    title: "The House With No Clock",
    author: "Eli Mercer",
    genre: "Fantasy",
    cover: "fantasy",
    description: "A mysterious house appears at midnight.",
    link: "reader.html?book=house"
  },
  {
    title: "Letters From Tomorrow",
    author: "Noah Vale",
    genre: "Sci-Fi",
    cover: "scifi",
    description: "A student receives letters written by his future self.",
    link: "reader.html?book=letters"
  },
  {
    title: "The Order Within",
    author: "Nikender Singh",
    genre: "Psychological Thriller",
    cover: "mystery",
    description: "A psychological thriller about trust, hidden motives, and a cold case that refuses to stay buried.",
    link: "reader.html?book=order-within"
  }
];

const booksContainer = document.getElementById("books");
const search = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");

const bookForm = document.getElementById("bookForm");
const submitMessage = document.getElementById("submitMessage");

let userBooks =
  JSON.parse(localStorage.getItem("openshelfBooks")) || [];


function getAllBooks() {
  return [...defaultBooks, ...userBooks];
}


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}


function displayBooks(list) {

  booksContainer.innerHTML = "";

  if (!list.length) {

    booksContainer.innerHTML =
      '<p style="color:#929096;grid-column:1/-1;padding:30px 0">No books found.</p>';

    return;
  }

  list.forEach(book => {

    const card = document.createElement("article");

    card.className = "card";

    card.innerHTML = `
      <div class="cover ${escapeHTML(book.cover)}">

        <div class="cover-top">
          <span>OPENSHELF</span>
          <span>
            NO. ${String(getAllBooks().indexOf(book) + 1).padStart(2, "0")}
          </span>
        </div>

        <div class="cover-bottom">

          <div class="cover-title">
            ${escapeHTML(book.title)}
          </div>

          <div class="cover-author">
            By ${escapeHTML(book.author)}
          </div>

        </div>

      </div>

      <div class="card-info">

        <div class="genre">
          ${escapeHTML(book.genre)}
        </div>

        <h3>
          ${escapeHTML(book.title)}
        </h3>

        <p>
          ${escapeHTML(book.description)}
        </p>

        <a
          class="read"
          href="${escapeHTML(book.link)}"
        >
          Read book →
        </a>

      </div>
    `;

    booksContainer.appendChild(card);

  });

}


function filterBooks() {

  const text =
    search.value.toLowerCase().trim();

  const selectedGenre =
    genreFilter.value;

  const results =
    getAllBooks().filter(book => {

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


search.addEventListener(
  "input",
  filterBooks
);

genreFilter.addEventListener(
  "change",
  filterBooks
);


bookForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const title =
      document.getElementById("bookTitle").value.trim();

    const author =
      document.getElementById("bookAuthor").value.trim();

    const genre =
      document.getElementById("bookGenre").value;

    const description =
      document.getElementById("bookDescription").value.trim();


    userBooks.push({

      title,
      author,
      genre,

      cover:
        getCoverClass(genre),

      description,

      link:
        "reader.html?book=community-" +
        Date.now()

    });


    localStorage.setItem(
      "openshelfBooks",
      JSON.stringify(userBooks)
    );


    bookForm.reset();

    submitMessage.textContent =
      "✓ Book added to your library.";

    displayBooks(
      getAllBooks()
    );


    setTimeout(
      () => submitMessage.textContent = "",
      4000
    );

  }
);


function getCoverClass(genre) {

  if (genre === "Fantasy") {
    return "fantasy";
  }

  if (genre === "Sci-Fi") {
    return "scifi";
  }

  return "mystery";

}


displayBooks(
  getAllBooks()
);
