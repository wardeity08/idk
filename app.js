const books = [
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
  }
];


const booksContainer = document.getElementById("books");
const search = document.getElementById("search");


function displayBooks(list) {

  booksContainer.innerHTML = "";

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

        <h3>${book.title}</h3>

        <p>
          by ${book.author}
          <br><br>
          ${book.description}
        </p>

        <a class="read" href="${book.link}">
          Read book →
        </a>

      </div>
    `;

    booksContainer.appendChild(card);
  });
}


search.addEventListener("input", function () {

  const text = search.value.toLowerCase();

  const results = books.filter(book =>
    book.title.toLowerCase().includes(text) ||
    book.author.toLowerCase().includes(text) ||
    book.genre.toLowerCase().includes(text)
  );

  displayBooks(results);

});


displayBooks(books);
