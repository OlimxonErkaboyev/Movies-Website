// get element from DOM
const elMoviesList = document.querySelector(".js-movies-list");
const elMoviesTemp = document.querySelector(".js-movies-temp").content;
const moviesFragment = new DocumentFragment();
// Search
const elSearchForm = document.querySelector(".js-search-form");
const elSearchInput = document.querySelector(".js-search-input");
// Select
const elMoviesSelect = document.querySelector(".js-movies-select");
const elFromYear = document.querySelector(".js-from-year")
const elToYear = document.querySelector(".js-to-year")
// sort
const elMoviesSortSelect = document.querySelector(".js-movies-sort")

// Modal
const elModal = document.querySelector(".modal");
const elModalTitle = document.querySelector(".js-modal-title");
const elModalIframe = document.querySelector(".js-modal-iframe");
const elModalRating = document.querySelector(".js-modal-rating");
const elModalYear = document.querySelector(".js-modal-year");
const elModalRuntime = document.querySelector(".js-modal-runtime");
const elModalCategory = document.querySelector(".js-modal-category");
const elModalDesc = document.querySelector(".js-modal-desc");
const elModalLink = document.querySelector(".js-modal-link");
const categories = [];

// Normalize Movies
const normalizeMovies = movies.map((movie) => {
    return {
        movie_title: movie.Title,
        movie_full_time: movie.fullTitle,
        movie_year: movie.movie_year,
        movie_category: movie.Categories,
        movie_summery: movie.summary,
        movie_image: movie.ImageURL,
        movie_imdb_id: movie.imdb_id,
        movie_rating: movie.imdb_rating,
        movie_runtime: movie.runtime,
        movie_language: movie.language,
        movie_yt_id: movie.ytid,
    }
})

// Get duration
function getDuration(time) {
    const hour = Math.round(time / 60);
    const min = Math.round(time % 60);
    return `${hour} hours ${min} min`;
}
// Generate categories
const renderOption = (movies) => {
    movies.forEach((movie) => {
        movie.movie_category.split("|").forEach((categ) => {
            if (!categories.includes(categ)) {
                categories.push(categ);
            }

        })
    })
    categories.sort()
}
renderOption(normalizeMovies)

categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category;
    option.value = category;
    elMoviesSelect.appendChild(option);
});

// Render Movies
function renderMovies(movies) {
    elMoviesList.innerHTML = null
    movies.forEach((movie) => {
        const cloneMoviesTemp = elMoviesTemp.cloneNode(true);
        cloneMoviesTemp.querySelector(".js-movies-img").src = `http://i3.ytimg.com/vi/${movie.movie_yt_id}/hqdefault.jpg`;
        cloneMoviesTemp.querySelector(".js-movies-img").alt = movie.movie_title;
        cloneMoviesTemp.querySelector(".js-movies-title").textContent = movie.movie_title;
        cloneMoviesTemp.querySelector(".js-movies-rating").textContent = movie.movie_rating;
        cloneMoviesTemp.querySelector(".js-movies-year").textContent = movie.movie_year;
        cloneMoviesTemp.querySelector(".js-movies-runtime").textContent = getDuration(movie.movie_runtime);
        cloneMoviesTemp.querySelector(".js-movies-category").textContent = movie.movie_category.split("|").join(", ")
        cloneMoviesTemp.querySelector(".js-movies-btn").dataset.id =
            movie.movie_imdb_id;


        moviesFragment.appendChild(cloneMoviesTemp)
    })
    elMoviesList.appendChild(moviesFragment)
}

// Render Modal
function renderModal(findMovie) {
    elModalTitle.textContent = findMovie.movie_title;
    elModalIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.movie_yt_id}`;
    elModalRating.textContent = findMovie.movie_rating;
    elModalYear.textContent = findMovie.movie_year;
    elModalRuntime.textContent = getDuration(findMovie.movie_runtime);
    elModalCategory.textContent = findMovie.movie_category.split("|").join(", ");
    elModalDesc.textContent = findMovie.movie_summery;
    elModalLink.href = `https://www.imdb.com/title/${findMovie.movie_imdb_id}`;
}

// Modal Render by Event Delegation
elMoviesList.addEventListener("click", function (evt) {
    const elementTarget = evt.target;
    const btnId = elementTarget.dataset.id;

    if (elementTarget.matches(".js-movies-btn")) {
        const foundMovie = normalizeMovies.find((movie) => movie.movie_imdb_id === btnId);
        renderModal(foundMovie);
    }
});
// Modal Reset Iframe SRC
elModal.addEventListener("hide.bs.modal", () => {
    elModalIframe.src = null;
})

// Search Movies
function SearchMovies(search) {
    const filterMovies = normalizeMovies.filter((movie) => {
        const moreCriteries = String(movie.movie_title).match(search) && (elMoviesSelect.value == "all" || movie.movie_category.includes(elMoviesSelect.value)) && (elFromYear.value == "" || movie.movie_year >= Number(elFromYear.value) && (elToYear.value == "" || movie.movie_year <= Number(elToYear.value)));
        return moreCriteries
    });
    return filterMovies;
}

// Sorted Movies
function sortdMovies(movies, sortType) {
    movies.sort((a, b) => {
        if (sortType == "A-Z") {
            if (String(a.movie_title).toLowerCase() > String(b.movie_title).toLowerCase())
                return 1;
            else if (String(a.movie_title).toLowerCase() < String(b.movie_title).toLowerCase()) return -1;
            else return 0;
        }
        if (sortType == "Z-A") {
            if (String(a.movie_title).toLowerCase() > String(b.movie_title).toLowerCase())
                return -1;
            else if (String(a.movie_title).toLowerCase() < String(b.movie_title).toLowerCase())
                return 1;
            else return 0;
        }
        if (sortType == "Oldest-Latest") {
            if (a.movie_year > b.movie_year)
                return 1;
            else if (a.movie_year < b.movie_year)
                return -1;
            else return 0;
        }
        if (sortType == "Latest-Oldest") {
            if (a.movie_year > b.movie_year)
                return -1;
            else if (a.movie_year < b.movie_year)
                return 1;
            else return 0;
        }
        if (sortType == "High-Rated") {
            if (a.movie_rating > b.movie_rating)
                return 1;
            else if (a.movie_rating < b.movie_rating)
                return -1;
            else return 0;
        }
        if (sortType == "Low-Rated") {
            if (a.movie_rating > b.movie_rating)
                return -1;
            else if (a.movie_rating < b.movie_rating)
                return 1;
            else return 0;
        }
    })
}


// Search Events
elSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const searchQuery = new RegExp(elSearchInput.value, "gi");
    const findMovies = SearchMovies(searchQuery);

    if (findMovies.length > 0) {
        sortdMovies(findMovies, elMoviesSortSelect.value);
        renderMovies(findMovies);
    } else {
        elMoviesList.innerHTML = `<div class='d-flex flex-column'>
        <p class="text-white display-3">"${elSearchInput.value}" movie  Not found🙄</p>
        <a class="text-white w-25 back-link text-decoration-underline">Back</a>
        </div>`;
    }
});

// Back location Event
elMoviesList.addEventListener("click", (evt) => {
    if (evt.target.matches(".back-link")) {
        window.location.reload();
    }
})

// Render Movies
renderMovies(normalizeMovies.slice(0, 10));
