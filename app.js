/* =========================================================
   OPENSHELF — THEME SYSTEM
   ========================================================= */

const THEMES = [
  "light",
  "cozy",
  "cafe",
  "editorial"
];

const THEME_KEY = "openshelf-theme";

const body =
  document.body;

const themeButton =
  document.getElementById("themeButton");

const themeMenu =
  document.getElementById("themeMenu");

const options =
  document.querySelectorAll(".theme-option");

const dot =
  document.querySelector(".theme-dot");


/* =========================================================
   SET THEME
   ========================================================= */

function setTheme(theme, save = true) {

  if (!THEMES.includes(theme)) {
    theme = "light";
  }

  body.dataset.theme = theme;

  if (save) {

    try {

      localStorage.setItem(
        THEME_KEY,
        theme
      );

    } catch (error) {}

  }

  options.forEach(option => {

    option.classList.toggle(
      "selected",
      option.dataset.themeChoice === theme
    );

  });

  const swatch =
    document.querySelector(
      `[data-theme-choice="${theme}"] .theme-swatch`
    );

  if (swatch) {

    dot.style.background =
      getComputedStyle(swatch).background;

  }

}


/* =========================================================
   LOAD SAVED THEME
   ========================================================= */

function loadTheme() {

  let saved =
    "light";

  try {

    saved =
      localStorage.getItem(
        THEME_KEY
      ) || "light";

  } catch (error) {}

  setTheme(
    saved,
    false
  );

}


/* =========================================================
   OPEN/CLOSE THEME MENU
   ========================================================= */

themeButton.addEventListener(
  "click",
  () => {

    const open =
      !themeMenu.hasAttribute(
        "hidden"
      );

    if (open) {

      themeMenu.setAttribute(
        "hidden",
        ""
      );

    } else {

      themeMenu.removeAttribute(
        "hidden"
      );

    }

    themeButton.setAttribute(
      "aria-expanded",
      String(!open)
    );

  }
);


/* =========================================================
   SELECT THEME
   ========================================================= */

options.forEach(option => {

  option.addEventListener(
    "click",
    () => {

      setTheme(
        option.dataset.themeChoice
      );

      themeMenu.setAttribute(
        "hidden",
        ""
      );

      themeButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }
  );

});


/* =========================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".theme-picker"
      )
    ) {

      themeMenu.setAttribute(
        "hidden",
        ""
      );

      themeButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }
);


/* =========================================================
   SEARCH
   ========================================================= */

const search =
  document.getElementById(
    "searchInput"
  );

const genre =
  document.getElementById(
    "genreFilter"
  );

const cards =
  [
    ...document.querySelectorAll(
      ".book-card"
    )
  ];

const empty =
  document.getElementById(
    "emptyState"
  );

const count =
  document.getElementById(
    "resultCount"
  );


function filterBooks() {

  const query =
    search.value
      .trim()
      .toLowerCase();

  const selectedGenre =
    genre.value;

  let visible = 0;


  cards.forEach(card => {

    const title =
      card.dataset.title
        .toLowerCase();

    const author =
      card.dataset.author
        .toLowerCase();

    const cardGenre =
      card.dataset.genre;


    const matchesText =

      !query ||

      title.includes(query) ||

      author.includes(query) ||

      cardGenre
        .toLowerCase()
        .includes(query);


    const matchesGenre =

      selectedGenre === "all" ||

      cardGenre ===
        selectedGenre;


    const show =
      matchesText &&
      matchesGenre;


    card.hidden =
      !show;


    if (show) {
      visible++;
    }

  });


  empty.hidden =
    visible !== 0;


  count.textContent =
    `${visible} ${
      visible === 1
        ? "book"
        : "books"
    }`;

}


search.addEventListener(
  "input",
  filterBooks
);

genre.addEventListener(
  "change",
  filterBooks
);


/* =========================================================
   OPEN BOOK
   ========================================================= */

function openBook(title) {

  if (
    title ===
    "The Order Within"
  ) {

    window.location.href =
      "reader.html";

    return;
  }


  alert(
    `${title}'s reader is coming soon.`
  );

}


/* =========================================================
   START
   ========================================================= */

loadTheme();

filterBooks();
