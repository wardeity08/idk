document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // SUPABASE
  // =========================================================

  const SUPABASE_URL =
    "https://kdycmaicayaesnpkqfgp.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_LC_ZkgE8N9p_t6d7KIhC_w_437ZMCFH";

  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );


  // =========================================================
  // THEME SYSTEM
  // =========================================================

  const themeButton =
    document.getElementById("themeButton");

  const themeMenu =
    document.getElementById("themeMenu");

  const themeOptions =
    document.querySelectorAll(".theme-option");


  function setTheme(theme) {

    document.body.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "openshelf-theme",
      theme
    );

    themeOptions.forEach(option => {

      option.classList.toggle(
        "selected",
        option.dataset.themeChoice === theme
      );

    });

  }


  const savedTheme =
    localStorage.getItem("openshelf-theme") ||
    "light";

  setTheme(savedTheme);


  if (themeButton && themeMenu) {

    themeButton.addEventListener("click", () => {

      const isOpen =
        !themeMenu.hasAttribute("hidden");

      if (isOpen) {

        themeMenu.setAttribute(
          "hidden",
          ""
        );

        themeButton.setAttribute(
          "aria-expanded",
          "false"
        );

      } else {

        themeMenu.removeAttribute(
          "hidden"
        );

        themeButton.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    });


    themeOptions.forEach(option => {

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


    document.addEventListener(
      "click",
      event => {

        if (
          !themeButton.contains(event.target) &&
          !themeMenu.contains(event.target)
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

  }


  // =========================================================
  // ELEMENTS
  // =========================================================

  const bookGrid =
    document.getElementById("bookGrid");

  const emptyState =
    document.getElementById("emptyState");

  const resultCount =
    document.getElementById("resultCount");

  const searchInput =
    document.getElementById("searchInput");

  const genreFilter =
    document.getElementById("genreFilter");

  const bookForm =
    document.getElementById("bookForm");

  const uploadStatus =
    document.getElementById("uploadStatus");

  const submitBookButton =
    document.getElementById("submitBookButton");


  // =========================================================
  // BOOK DATA
  // =========================================================

  let books = [];


  // =========================================================
  // LOAD BOOKS FROM SUPABASE
  // =========================================================

  async function loadBooks() {

    if (resultCount) {
      resultCount.textContent =
        "Loading books...";
    }


    const {
      data,
      error
    } = await supabaseClient
      .from("books")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        "Supabase load error:",
        error
      );

      if (resultCount) {
        resultCount.textContent =
          "Could not load books";
      }

      showMessage(
        "Could not connect to the library. Please refresh the page.",
        "error"
      );

      return;

    }


    books = data || [];


    buildGenreFilter();

    renderBooks();

  }


  // =========================================================
  // BUILD GENRE FILTER
  // =========================================================

  function buildGenreFilter() {

    if (!genreFilter) {
      return;
    }


    const currentValue =
      genreFilter.value;


    const genres =
      [...new Set(
        books
          .map(book => book.genre)
          .filter(Boolean)
      )]
      .sort(
        (a, b) =>
          a.localeCompare(b)
      );


    genreFilter.innerHTML = "";


    const allOption =
      document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "All Genres";

    genreFilter.appendChild(
      allOption
    );


    genres.forEach(genre => {

      const option =
        document.createElement("option");

      option.value = genre;
      option.textContent = genre;

      genreFilter.appendChild(
        option
      );

    });


    if (
      genres.includes(currentValue)
    ) {

      genreFilter.value =
        currentValue;

    } else {

      genreFilter.value =
        "all";

    }

  }


  // =========================================================
  // RENDER BOOKS
  // =========================================================

  function renderBooks() {

    if (!bookGrid) {
      return;
    }


    const search =
      searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    const selectedGenre =
      genreFilter
        ? genreFilter.value
        : "all";


    const filteredBooks =
      books.filter(book => {

        const title =
          (book.title || "")
            .toLowerCase();

        const author =
          (book.author || "")
            .toLowerCase();

        const genre =
          (book.genre || "")
            .toLowerCase();


        const matchesSearch =
          !search ||
          title.includes(search) ||
          author.includes(search) ||
          genre.includes(search);


        const matchesGenre =
          selectedGenre === "all" ||
          book.genre === selectedGenre;


        return (
          matchesSearch &&
          matchesGenre
        );

      });


    bookGrid.innerHTML = "";


    if (resultCount) {

      resultCount.textContent =
        `${filteredBooks.length} book${
          filteredBooks.length === 1
            ? ""
            : "s"
        }`;

    }


    if (
      filteredBooks.length === 0
    ) {

      if (emptyState) {
        emptyState.hidden = false;
      }

      return;

    }


    if (emptyState) {
      emptyState.hidden = true;
    }


    filteredBooks.forEach(book => {

      const card =
        createBookCard(book);

      bookGrid.appendChild(card);

    });

  }


  // =========================================================
  // CREATE BOOK CARD
  // =========================================================

  function createBookCard(book) {

    const card =
      document.createElement("article");

    card.className =
      "book-card";


    card.dataset.title =
      book.title || "";

    card.dataset.author =
      book.author || "";

    card.dataset.genre =
      book.genre || "";


    // Make the WHOLE card clickable

    card.addEventListener(
      "click",
      () => {

        openBook(book);

      }
    );


    // =======================================================
    // COVER
    // =======================================================

    const cover =
      document.createElement("div");

    cover.className =
      "book-cover uploaded-cover";


    if (book.cover_url) {

      const image =
        document.createElement("img");

      image.src =
        book.cover_url;

      image.alt =
        `${book.title || "Book"} cover`;

      image.loading = "lazy";


      image.onerror = () => {

        cover.classList.add(
          "cover-fallback"
        );

        image.remove();

        createCoverFallback(
          cover,
          book
        );

      };


      cover.appendChild(
        image
      );

    } else {

      createCoverFallback(
        cover,
        book
      );

    }


    // =======================================================
    // BOOK INFO
    // =======================================================

    const info =
      document.createElement("div");

    info.className =
      "book-info";


    const genre =
      document.createElement("span");

    genre.className =
      "book-genre";

    genre.textContent =
      book.genre || "Book";


    const title =
      document.createElement("h3");

    title.textContent =
      book.title || "Untitled";


    const author =
      document.createElement("p");

    author.textContent =
      `by ${book.author || "Unknown author"}`;


    info.appendChild(
      genre
    );

    info.appendChild(
      title
    );

    info.appendChild(
      author
    );


    // =======================================================
    // ARROW
    // =======================================================

    const arrow =
      document.createElement("span");

    arrow.className =
      "card-arrow";

    arrow.textContent =
      "↗";

    arrow.setAttribute(
      "aria-hidden",
      "true"
    );


    card.appendChild(
      cover
    );

    card.appendChild(
      info
    );

    card.appendChild(
      arrow
    );


    return card;

  }


  // =========================================================
  // FALLBACK COVER
  // =========================================================

  function createCoverFallback(
    cover,
    book
  ) {

    const label =
      document.createElement("span");

    label.className =
      "cover-label";

    label.textContent =
      (book.genre || "BOOK")
        .toUpperCase();


    const title =
      document.createElement("span");

    title.className =
      "cover-title";

    title.textContent =
      book.title || "Untitled";


    cover.appendChild(
      label
    );

    cover.appendChild(
      title
    );

  }


  // =========================================================
  // OPEN BOOK
  // =========================================================

  function openBook(book) {

    if (
      !book ||
      !book.id
    ) {
      return;
    }


    window.location.href =
      `reader.html?id=${encodeURIComponent(book.id)}`;

  }


  window.openBook =
    openBook;


  // =========================================================
  // SEARCH
  // =========================================================

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderBooks
    );

  }


  if (genreFilter) {

    genreFilter.addEventListener(
      "change",
      renderBooks
    );

  }


  // =========================================================
  // UPLOAD BOOK
  // =========================================================

  if (bookForm) {

    bookForm.addEventListener(
      "submit",
      handleBookUpload
    );

  }


  async function handleBookUpload(event) {

    event.preventDefault();


    const titleInput =
      document.getElementById("bookTitle");

    const authorInput =
      document.getElementById("bookAuthor");

    const genreInput =
      document.getElementById("bookGenre");

    const bookFileInput =
      document.getElementById("bookFile");

    const coverFileInput =
      document.getElementById("coverFile");


    const title =
      titleInput.value.trim();

    const author =
      authorInput.value.trim();

    const genre =
      genreInput.value.trim();

    const bookFile =
      bookFileInput.files[0];

    const coverFile =
      coverFileInput.files[0];


    // =======================================================
    // VALIDATION
    // =======================================================

    if (
      !title ||
      !author ||
      !genre ||
      !bookFile ||
      !coverFile
    ) {

      showMessage(
        "Please fill in every field.",
        "error"
      );

      return;

    }


    const fileName =
      bookFile.name.toLowerCase();


    if (
      !fileName.endsWith(".docx")
    ) {

      showMessage(
        "Please upload a DOCX book file.",
        "error"
      );

      return;

    }


    if (
      !coverFile.type.startsWith("image/")
    ) {

      showMessage(
        "Please upload an image for the cover.",
        "error"
      );

      return;

    }


    // =======================================================
    // START UPLOAD
    // =======================================================

    if (submitBookButton) {

      submitBookButton.disabled =
        true;

      submitBookButton.innerHTML =
        "Uploading...";

    }


    showMessage(
      "Uploading your book...",
      "loading"
    );


    try {

      // -----------------------------------------------------
      // UNIQUE FILE NAMES
      // -----------------------------------------------------

      const uniqueId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}`;


      const safeBookName =
        sanitizeFileName(
          bookFile.name
        );


      const safeCoverName =
        sanitizeFileName(
          coverFile.name
        );


      const bookPath =
        `${uniqueId}-${safeBookName}`;


      const coverPath =
        `${uniqueId}-${safeCoverName}`;


      // -----------------------------------------------------
      // UPLOAD BOOK FILE
      // -----------------------------------------------------

      showMessage(
        "Uploading book file...",
        "loading"
      );


      const {
        error: bookUploadError
      } =
        await supabaseClient
          .storage
          .from("book_file")
          .upload(
            bookPath,
            bookFile,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
          );


      if (bookUploadError) {

        throw new Error(
          `Book upload failed: ${bookUploadError.message}`
        );

      }


      // -----------------------------------------------------
      // UPLOAD COVER
      // -----------------------------------------------------

      showMessage(
        "Uploading cover...",
        "loading"
      );


      const {
        error: coverUploadError
      } =
        await supabaseClient
          .storage
          .from("book-covers")
          .upload(
            coverPath,
            coverFile,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                coverFile.type
            }
          );


      if (coverUploadError) {

        throw new Error(
          `Cover upload failed: ${coverUploadError.message}`
        );

      }


      // -----------------------------------------------------
      // GET PUBLIC URLs
      // -----------------------------------------------------

      const {
        data: bookPublicData
      } =
        supabaseClient
          .storage
          .from("book_file")
          .getPublicUrl(
            bookPath
          );


      const {
        data: coverPublicData
      } =
        supabaseClient
          .storage
          .from("book-covers")
          .getPublicUrl(
            coverPath
          );


      const bookUrl =
        bookPublicData.publicUrl;


      const coverUrl =
        coverPublicData.publicUrl;


      // -----------------------------------------------------
      // SAVE BOOK TO DATABASE
      // -----------------------------------------------------

      showMessage(
        "Saving book to the library...",
        "loading"
      );


      const {
        error: databaseError
      } =
        await supabaseClient
          .from("books")
          .insert([
            {
              title: title,
              author: author,
              genre: genre,
              book_url: bookUrl,
              cover_url: coverUrl
            }
          ]);


      if (databaseError) {

        throw new Error(
          `Database error: ${databaseError.message}`
        );

      }


      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      showMessage(
        "Book added successfully! 🎉",
        "success"
      );


      bookForm.reset();


      await loadBooks();


      setTimeout(
        () => {

          const library =
            document.getElementById(
              "library"
            );

          if (library) {

            library.scrollIntoView({
              behavior: "smooth"
            });

          }

        },
        800
      );


    } catch (error) {

      console.error(
        "Upload error:",
        error
      );


      showMessage(
        error.message ||
        "Something went wrong while uploading the book.",
        "error"
      );


    } finally {

      if (submitBookButton) {

        submitBookButton.disabled =
          false;

        submitBookButton.innerHTML =
          "Add Book <span>→</span>";

      }

    }

  }


  // =========================================================
  // STATUS MESSAGE
  // =========================================================

  function showMessage(
    message,
    type
  ) {

    if (!uploadStatus) {
      return;
    }


    uploadStatus.textContent =
      message;


    uploadStatus.dataset.status =
      type;

  }


  // =========================================================
  // FILE NAME CLEANER
  // =========================================================

  function sanitizeFileName(
    fileName
  ) {

    return fileName
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );

  }


  // =========================================================
  // EXPLORE LIBRARY
  // =========================================================

  const exploreButton =
    document.getElementById(
      "exploreButton"
    );


  if (exploreButton) {

    exploreButton.addEventListener(
      "click",
      () => {

        const library =
          document.getElementById(
            "library"
          );

        if (library) {

          library.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  }


  // =========================================================
  // NAVIGATION
  // =========================================================

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute(
              "href"
            );


          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );


          if (target) {

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth"
            });

          }

        }
      );

    });


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  loadBooks();

});
