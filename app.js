document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // THEME SYSTEM
  // =========================

  const themeSelect = document.getElementById("themeSelect");

  function setTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("openshelf-theme", theme);

    if (themeSelect) {
      themeSelect.value = theme;
    }
  }

  const savedTheme = localStorage.getItem("openshelf-theme") || "light";
  setTheme(savedTheme);

  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      setTheme(themeSelect.value);
    });
  }


  // =========================
  // BOOK DATA
  // =========================

  const books = [
    {
      title: "The Last Train",
      author: "Mara Ellis",
      genre: "Mystery"
    },
    {
      title: "The House With No Clock",
      author: "Eli Mercer",
      genre: "Fantasy"
    },
    {
      title: "Letters From Tomorrow",
      author: "Noah Vale",
      genre: "Sci-Fi"
    },
    {
      title: "The Order Within",
      author: "Nikender Singh",
      genre: "Psychological Thriller"
    }
  ];


  // =========================
  // SEARCH
  // =========================

  const searchInput = document.getElementById("searchInput");
  const genreSelect = document.getElementById("genreSelect");
  const bookCards = document.querySelectorAll(".book-card");
  const resultCount = document.getElementById("resultCount");

  function filterBooks() {

    const search =
      searchInput ? searchInput.value.toLowerCase().trim() : "";

    const genre =
      genreSelect ? genreSelect.value.toLowerCase() : "all";

    let visible = 0;

    bookCards.forEach(card => {

      const title =
        (card.dataset.title || card.querySelector("h3")?.textContent || "")
        .toLowerCase();

      const author =
        (card.dataset.author || card.querySelector(".book-author")?.textContent || "")
        .toLowerCase();

      const cardGenre =
        (card.dataset.genre || card.querySelector(".book-genre")?.textContent || "")
        .toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        author.includes(search) ||
        cardGenre.includes(search);

      const matchesGenre =
        genre === "all" ||
        cardGenre === genre;

      if (matchesSearch && matchesGenre) {
        card.style.display = "";
        visible++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultCount) {
      resultCount.textContent =
        `${visible} book${visible === 1 ? "" : "s"} found`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterBooks);
  }

  if (genreSelect) {
    genreSelect.addEventListener("change", filterBooks);
  }


  // =========================
  // OPEN BOOK
  // =========================

  function openBook(title) {

    if (title === "The Order Within") {
      window.location.href = "reader.html";
      return;
    }

    alert(`${title} is coming soon.`);
  }

  window.openBook = openBook;


  // =========================
  // EXPLORE LIBRARY
  // =========================

  const exploreButton = document.getElementById("exploreButton");

  if (exploreButton) {
    exploreButton.addEventListener("click", () => {

      const library =
        document.getElementById("library");

      if (library) {
        library.scrollIntoView({
          behavior: "smooth"
        });
      }

    });
  }


  // =========================
  // SUBMIT BUTTON
  // =========================

  const submitButtons =
    document.querySelectorAll("[data-submit]");

  submitButtons.forEach(button => {

    button.addEventListener("click", () => {

      const submitSection =
        document.getElementById("submit");

      if (submitSection) {
        submitSection.scrollIntoView({
          behavior: "smooth"
        });
      }

    });

  });


  // =========================
  // ADD A BOOK
  // =========================

  const addBookButton =
    document.getElementById("addBookButton");

  if (addBookButton) {

    addBookButton.addEventListener("click", () => {

      const submitSection =
        document.getElementById("submit");

      if (submitSection) {

        submitSection.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  }


  // =========================
  // NAVIGATION
  // =========================

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target =
        document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  });


  // =========================
  // INITIAL FILTER
  // =========================

  filterBooks();

});
