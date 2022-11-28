let API_KEY = process.env.API_KEY;

const navBar = document.querySelector(".nav-bar");
const nameLogo = document.querySelector(".name-logo");

const hamburgerContainer = document.querySelector(".hamburger-container");
const hamburgerLogo = document.querySelector(".hamburger-logo");
const hamburger = document.querySelector(".hamburger");

const logoContainer = document.querySelector(".logo-container");
const locationLogo = document.querySelector(".location-logo");
const searchLogo = document.querySelector(".search-logo");

const bar = document.querySelectorAll(".bar");
const bar1 = document.querySelector(".bar1");
const bar2 = document.querySelector(".bar2");
const bar3 = document.querySelector(".bar3");

const bodyContainer = document.querySelector(".body-container");

const allContainer = document.querySelector(".all-container");

const countryContainer = document.querySelector(".country-container");

const rowContainer = document.querySelectorAll(".row-container");
const movieContainer = document.querySelector(".movie-container");
const castContainer = document.querySelector(".cast-container");

const searchBox = document.querySelector(".search-box");
const box = document.querySelectorAll("box");

const searchBtn = document.querySelector(".search");
const searchInputContainer = document.querySelector(".search-input-container");
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-form");

const countryInput = document.querySelector(".country-input");
const countryFlag = document.querySelector(".country-flag");
const countryOption = document.querySelector(".country-option");
const countryForm = document.querySelector(".country-form");

const searchDesktop = document.querySelector(".search-desktop");
const countryDesktop = document.querySelector(".country-desktop");

const displayStart = () => {
	let html = `
	<div class="main-container">
		<p class="random-name"></p>
	</div>
	<div class="body-container margin">
		<h1 class="header-name">Now Showing</h1>
		<div class="now-playing-movies-container container"></div>

		<h1 class="header-name">Upcoming Movies</h1>
		<div class="upcoming-movies-container container"></div>

		<h1 class="header-name">Most Popular</h1>
		<div class="popular-movies-container container"></div>

		<h1 class="header-name">Top Rated</h1>
		<div class="top-rated-movies-container container"></div>
	</div>
	`;
	allContainer.insertAdjacentHTML("beforeend", html);
};
displayStart();

const nowPlayingMoviesContainer = document.querySelector(
	".now-playing-movies-container"
);
const upcomingMoviesContainer = document.querySelector(
	".upcoming-movies-container"
);
const topRatedMoviesContainer = document.querySelector(
	".top-rated-movies-container"
);
const popularMoviesContainer = document.querySelector(
	".popular-movies-container"
);
const mainContainer = document.querySelector(".main-container");
const randomName = document.querySelector(".random-name");

let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
	let currentScrollPos = window.pageYOffset;
	if (prevScrollpos > currentScrollPos || window.pageYOffset <= 60) {
		navBar.style.top = "0";
	} else {
		navBar.style.top = "-60px";
	}
	prevScrollpos = currentScrollPos;
};

searchLogo.addEventListener("click", () => {
	toggleSearch();
});

const toggleSearch = () => {
	const searchMobile = document.querySelector(".search-mobile");
	const countryMobile = document.querySelector(".country-mobile");
	searchMobile.classList.toggle("reveal");

	countryMobile.classList.remove("reveal");
	locationLogo.classList.toggle("hidden");
};

locationLogo.addEventListener("click", () => {
	toggleCountry();
});

const toggleCountry = () => {
	const searchMobile = document.querySelector(".search-mobile");
	const countryMobile = document.querySelector(".country-mobile");
	countryMobile.classList.toggle("reveal");
	searchMobile.classList.remove("reveal");
	searchLogo.classList.toggle("hidden");
};

const homeLink = () => {
	displayStart();
	searchForm.reset();
	countryForm.reset();
	countryFlag.innerHTML = "";
	const nowPlayingMoviesContainer = document.querySelector(
		".now-playing-movies-container"
	);
	const upcomingMoviesContainer = document.querySelector(
		".upcoming-movies-container"
	);
	const topRatedMoviesContainer = document.querySelector(
		".top-rated-movies-container"
	);
	const popularMoviesContainer = document.querySelector(
		".popular-movies-container"
	);
	getMovies(
		`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
		nowPlayingMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
		upcomingMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&vote_count.gte=7000`,
		popularMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=3000`,
		topRatedMoviesContainer
	);
	const mainContainer = document.querySelector(".main-container");
	const randomName = document.querySelector(".random-name");
	const randomImage = (data) => {
		const randomChoice = Math.floor(Math.random() * 20);
		mainContainer.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.results[randomChoice].backdrop_path}")`;
		randomName.textContent = `${data.results[randomChoice].title}`;
		mainContainer.addEventListener("click", () => {
			movieClick(data.results[randomChoice].id);
		});
	};
	const getRandom = async (link, container) => {
		try {
			const res = await fetch(link);
			if (!res.ok) throw new Error("Problem getting movie");
			const data = await res.json();
			randomImage(data, container);
		} catch (err) {
			console.error(err);
		}
	};
	getRandom(
		`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
		mainContainer
	);
};

const restart = () => {
	allContainer.innerHTML = "";
	scroll(0, 0);
	let link = window.location.href;
	if (link.includes("home")) {
		homeLink();
	} else {
		history.pushState({ id: "home" }, null, `/home`);
		homeLink();
	}
};
nameLogo.addEventListener("click", () => {
	restart();
});

const empty = (container) => {
	const searchContainer = document.querySelector(".search-container");
	if (container == searchContainer) {
		let html = `
        <h3 class="unavailable">No search results found</h3>
        `;
		container.insertAdjacentHTML("beforeend", html);
	} else {
		let html = `
        <h3 class="unavailable">Movie schedule is unavailable for this country</h3>
        `;
		container.insertAdjacentHTML("beforeend", html);
	}
};

const displayMovies = (data, container) => {
	container.innerHTML = "";
	if (data.results.length == 0) {
		empty(container);
	}
	for (let i = 0; i < data.results.length; i++) {
		if (data.results[i].poster_path) {
			const html = `
            <div class="box-movie" id="${data.results[i].id}">
                <img class="box-img-movie" src="https://image.tmdb.org/t/p/original${data.results[i].poster_path}" id="${data.results[i].id}">
                <p class="movie-title" id="${data.results[i].id}">${data.results[i].title}</p>
            </div>
            `;
			container.insertAdjacentHTML("beforeend", html);
		} else {
			const html = `
			<div class="box-movie" id="${data.results[i].id}">
                <img class="box-img-movie" src="unavailable.png" id="${data.results[i].id}">
                <p class="movie-title" id="${data.results[i].id}">${data.results[i].title}</p>
            </div>
            `;
			container.insertAdjacentHTML("beforeend", html);
		}
	}
};

const getMovies = async (link, container) => {
	try {
		const res = await fetch(link);
		if (!res.ok) throw new Error("Problem getting movie");
		const data = await res.json();
		displayMovies(data, container);
		return data;
	} catch (err) {
		console.error(err);
	}
};

const randomImage = (data) => {
	const randomChoice = Math.floor(Math.random() * 20);
	mainContainer.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.results[randomChoice].backdrop_path}")`;
	randomName.textContent = `${data.results[randomChoice].title}`;
	mainContainer.addEventListener("click", () => {
		movieClick(data.results[randomChoice].id);
	});
	mainContainer.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.results[randomChoice].backdrop_path}")`;
};

const getRandom = async (link, container) => {
	try {
		const res = await fetch(link);
		if (!res.ok) throw new Error("Problem getting movie");
		const data = await res.json();
		randomImage(data, container);
	} catch (err) {
		console.error(err);
	}
};

const genres = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Science Fiction",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	37: "Western",
};

const displayMoviesClick = (data) => {
	allContainer.innerHTML = "";

	let genre = data.genres;
	let arr = [];
	for (let i = 0; i < genre.length; i++) {
		let genreName = genre[i].name;
		arr.push(genreName);
	}
	const genres = [...arr];
	const stringGenres = genres.join(", ");

	const releaseYear = data.release_date.slice(0, 4);

	const hours = Math.floor(data.runtime / 60);
	const minutes = data.runtime % 60;
	const runtime = `${hours}h ${minutes}m`;

	let posterSrc = `https://image.tmdb.org/t/p/original${data.poster_path}`;
	if (!data.poster_path) {
		posterSrc = "unavailable.png";
	} else {
		posterSrc = `https://image.tmdb.org/t/p/original${data.poster_path}`;
	}

	let html = `
    <div class="top-section">
        <img class="top-section-img poster" src=${posterSrc}>
        <div class="top-section-text">
            <div class="top-section-title">
                <h2 class="top-section-title-name">${data.title}</h2>
                <p>(${releaseYear})</p>
            </div>
            <div class="top-section-info">
                <p>${stringGenres} - ${runtime}</p>
            </div>
            <div class="top-section-rating">
                <h1 class="star">★</h1>
                <div class="top-section-rating-number">
                    <h3>${data.vote_average}/10</h3>
                    <p>(${data.vote_count})</p>
                </div>
            </div>
            <div class="top-section-overview">
                <h3>Overview</h3>
                <p>${data.overview}</p>
            </div>
        </div>
    </div>
    <h1 class="header-name margin">Cast</h1>
    <div class="cast-section container margin"></div>
    <div class="margin">
        <h1 class="header-name">Trailers</h1>
        <div class="video-section"></div>
        <h1 class="header-name">Reviews</h1>
        <div class="review-section"></div>
    </div>
    `;
	allContainer.insertAdjacentHTML("beforeend", html);
	const topSection = document.querySelector(".top-section");
	if (data.backdrop_path) {
		topSection.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.backdrop_path}")`;
	} else {
		topSection.style.backgroundColor = "black";
	}

	const castSection = document.querySelector(".cast-section");
	if (data.credits.cast.length == 0) {
		html = `
        <h3 class="unavailable">Cast is unavailable for this movie</h3>
        `;
		castSection.insertAdjacentHTML("beforeend", html);
	}
	for (let i = 0; i < data.credits.cast.length; i++) {
		if (data.credits.cast[i].profile_path) {
			html = `
            <div class="box-cast" id="${data.credits.cast[i].id}">
                <img class="box-img-cast" src="https://image.tmdb.org/t/p/original${data.credits.cast[i].profile_path}" id="${data.credits.cast[i].id}">
                <p class="cast-title" id="${data.credits.cast[i].id}">${data.credits.cast[i].name}</p>
            </div>
            `;
			castSection.insertAdjacentHTML("beforeend", html);
		} else {
			html = `
			<div class="box-cast" id="${data.credits.cast[i].id}">
                <img class="box-img-cast" src="unavailable.png" id="${data.credits.cast[i].id}">
                <p class="cast-title" id="${data.credits.cast[i].id}">${data.credits.cast[i].name}</p>
            </div>
            `;
			castSection.insertAdjacentHTML("beforeend", html);
		}
	}

	const videoSection = document.querySelector(".video-section");
	if (data.videos.results.length == 0) {
		html = `
        <h3 class="unavailable">Trailer is unavailable for this movie</h3>
        `;
		videoSection.insertAdjacentHTML("beforeend", html);
	} else if (data.videos.results.length < 3) {
		for (let i = 0; i < 1; i++) {
			html = `
            <iframe class="video" src="https://www.youtube.com/embed/${data.videos.results[i].key}" allowfullscreen>
            </iframe>
            `;
			videoSection.insertAdjacentHTML("beforeend", html);
		}
	} else {
		for (let i = 0; i < 3; i++) {
			html = `
            <iframe class="video" src="https://www.youtube.com/embed/${data.videos.results[i].key}" allowfullscreen>
            </iframe>
            `;
			videoSection.insertAdjacentHTML("beforeend", html);
		}
	}

	const reviewSection = document.querySelector(".review-section");
	if (data.reviews.results.length != 0) {
		for (let i = 0; i < data.reviews.results.length; i++) {
			html = `
            <div class="review">
                <h2>${data.reviews.results[i].author}</h2>
                <p>${data.reviews.results[i].content}</p>
            </div>
            `;
			reviewSection.insertAdjacentHTML("beforeend", html);
		}
	} else {
		html = `
        <div class="review">
            <h3 class="unavailable">Review is unavailable for this movie</h3>
        </div>
        `;
		reviewSection.insertAdjacentHTML("beforeend", html);
	}
};

const getMoviesClick = async (link) => {
	try {
		const res = await fetch(link);
		if (!res.ok) throw new Error("Problem getting movie");
		const data = await res.json();
		displayMoviesClick(data);
	} catch (err) {
		console.error(err);
	}
};

const movieClick = (id) => {
	history.pushState({ id }, null, `/movie/${id}`);
	scroll(0, 0);
	getMoviesClick(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,reviews,credits`
	);
};

const displayCastClick = (data) => {
	allContainer.innerHTML = "";

	let castSrc = `https://image.tmdb.org/t/p/original${data.profile_path}`;
	if (!data.profile_path) {
		castSrc = "unavailable.png";
	} else {
		castSrc = `https://image.tmdb.org/t/p/original${data.profile_path}`;
	}

	let html = `
    <div class="cast-top-section">
        <img class="cast-top-section-img poster" src=${castSrc}>
        <div class="cast-top-section-text">
            <div class="cast-name">
                <h1>${data.name}</h1>
            </div>
            <div class="known-for">
                <p>Known for: ${data.known_for_department}</p>
            </div>
            <div class="cast-birth-day">
                <p>Birthday: ${data.birthday}</p>
            </div>
            <div class="cast-birth-place">
                <p>Place of Birth: ${data.place_of_birth}</p>
            </div>
        </div>
    </div>
    <div class="margin">
        <h1 class="header-name">Known for</h1>
        <div class="cast-movie-section container"></div>
        <h1 class="header-name">Biography</h1>
        <div class="cast-bio">
        </div>
    </div>
    `;
	allContainer.insertAdjacentHTML("beforeend", html);
	const castBio = document.querySelector(".cast-bio");
	if (data.biography) {
		html = `
		<p>${data.biography}</p>
		`;

		castBio.insertAdjacentHTML("beforeend", html);
	} else {
		html = `
		<h3 class="unavailable">Biography is unavailable</h3>
		`;
		castBio.insertAdjacentHTML("beforeend", html);
	}

	const castTopSection = document.querySelector(".cast-top-section");
	if (data.movie_credits.cast[0].backdrop_path) {
		castTopSection.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.movie_credits.cast[0].backdrop_path}")`;
	} else if (data.movie_credits.cast[1].backdrop_path) {
		castTopSection.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.movie_credits.cast[1].backdrop_path}")`;
	} else if (data.movie_credits.cast[2].backdrop_path) {
		castTopSection.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${data.movie_credits.cast[2].backdrop_path}")`;
	} else {
		castTopSection.style.backgroundColor = "black";
	}

	const castMovieSection = document.querySelector(".cast-movie-section");
	if (data.movie_credits.cast.length == 0) {
		html = `
        <h3 class="unavailable">Cast has no known movie</h3>
        `;
		castMovieSection.insertAdjacentHTML("beforeend", html);
	}

	for (let i = 0; i < data.movie_credits.cast.length; i++) {
		if (data.movie_credits.cast[i].poster_path) {
			html = `
            <div class="box-movie" id="${data.movie_credits.cast[i].id}">
                <img class="box-img-movie" src="https://image.tmdb.org/t/p/original${data.movie_credits.cast[i].poster_path}" id="${data.movie_credits.cast[i].id}">
                <p class="movie-title" id="${data.movie_credits.cast[i].id}">${data.movie_credits.cast[i].title}</p>
            </div>
            `;
			castMovieSection.insertAdjacentHTML("beforeend", html);
		} else {
			html = `
			<div class="box-movie" id="${data.movie_credits.cast[i].id}">
                <img class="box-img-movie" src="unavailable.png" id="${data.movie_credits.cast[i].id}">
                <p class="movie-title" id="${data.movie_credits.cast[i].id}">${data.movie_credits.cast[i].title}</p>
            </div>
            `;
			castMovieSection.insertAdjacentHTML("beforeend", html);
		}
	}
};

const getCastClick = async (link) => {
	try {
		const res = await fetch(link);
		if (!res.ok) throw new Error("Problem getting cast");
		const data = await res.json();
		displayCastClick(data);
	} catch (err) {
		console.error(err);
	}
};

const castClick = (id) => {
	history.pushState({ id }, null, `/cast/${id}`);
	scroll(0, 0);
	getCastClick(
		`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,movie`
	);
};

let page;
const search = (value, page) => {
	allContainer.innerHTML = "";
	let html = `
	<div class="search-container margin"></div>
	<div class="search-back-next-container">
		<button class="search-back">BACK</button>
		<button class="search-next">NEXT</button>
	</div>
	`;
	allContainer.insertAdjacentHTML("beforeend", html);
	const searchContainer = document.querySelector(".search-container");
	const searchBack = document.querySelector(".search-back");
	const searchNext = document.querySelector(".search-next");
	searchInput.value = value;
	getMovies(
		`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${value}&page=${page}&include_adult=false`,
		searchContainer
	)
		.then((res) => {
			const totalPages = res.total_pages;
			if (totalPages == 1) {
				searchNext.disabled = true;
				searchBack.disabled = true;
			} else {
				searchNext.disabled = false;
				searchBack.disabled = true;
			}
		})
		.catch((err) => console.error(err));

	searchBack.addEventListener("click", (e) => {
		e.preventDefault();
		scroll(0, 0);
		const searchContainer = document.querySelector(".search-container");
		page -= 1;
		history.pushState(
			{ id: value, number: page },
			null,
			`/search/${value}/page/${page}`
		);
		if (page == 1) {
			searchBack.disabled = true;
			searchNext.disabled = false;
		} else if (page != 1) {
			searchBack.disabled = false;
			searchNext.disabled = false;
		}
		getMovies(
			`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${value}&page=${page}&include_adult=false`,
			searchContainer
		);
	});

	searchNext.addEventListener("click", (e) => {
		e.preventDefault();
		scroll(0, 0);
		const searchContainer = document.querySelector(".search-container");
		page += 1;
		history.pushState(
			{ id: value, number: page },
			null,
			`/search/${value}/page/${page}`
		);
		getMovies(
			`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${value}&page=${page}&include_adult=false`,
			searchContainer
		)
			.then((res) => {
				const totalPages = res.total_pages;
				if (totalPages == page) {
					searchBack.disabled = false;
					searchNext.disabled = true;
				} else {
					searchBack.disabled = false;
					searchNext.disabled = false;
				}
			})
			.catch((err) => console.error(err));
	});
};

const searchClick = (value) => {
	page = 1;
	history.pushState(
		{ id: value, number: page },
		null,
		`/search/${value}/page/1`
	);
	scroll(0, 0);
	search(value, page);
};

searchBtn.addEventListener("click", (e) => {
	const value = searchInput.value;
	e.preventDefault();
	searchClick(value);
});

const countryNum = 247;
const displayCountry = (data) => {
	for (let i = 0; i < countryNum; i++) {
		const html = `
        <option class="country-option" value="${data[i].iso_3166_1}">${data[i].english_name}</option>
        `;
		countryInput.insertAdjacentHTML("beforeend", html);
	}
};

const getCountry = async (link) => {
	try {
		const res = await fetch(link);
		if (!res.ok) throw new Error("Problem getting country");
		const data = await res.json();
		displayCountry(data);
	} catch (err) {
		console.error(err);
	}
};

const getFlag = async (code) => {
	try {
		countryFlag.innerHTML = "";
		const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${code}`);
		if (!res.ok) throw new Error("Problem getting flag");
		const data = await res.json();
		const html = `
        <img src="${data.flag}">
        `;
		countryFlag.insertAdjacentHTML("beforeend", html);
	} catch (err) {
		console.error(err);
	}
};

window.addEventListener("resize", () => {
	if (window.innerWidth <= 768) {
		searchInputContainer.classList.remove("search-desktop");
		searchInputContainer.classList.add("search-mobile");
		countryContainer.classList.remove("country-desktop");
		countryContainer.classList.add("country-mobile");
		searchLogo.classList.remove("hidden");
		locationLogo.classList.remove("hidden");
	} else if (window.innerWidth > 768) {
		searchInputContainer.classList.add("search-desktop");
		searchInputContainer.classList.remove("search-mobile");
		countryContainer.classList.add("country-desktop");
		countryContainer.classList.remove("country-mobile");
		searchLogo.classList.add("hidden");
		locationLogo.classList.add("hidden");
	}
});

const checkNav = () => {
	if (window.innerWidth <= 768) {
		searchInputContainer.classList.remove("search-desktop");
		searchInputContainer.classList.add("search-mobile");
		countryContainer.classList.remove("country-desktop");
		countryContainer.classList.add("country-mobile");
		searchLogo.classList.remove("hidden");
		locationLogo.classList.remove("hidden");
	} else if (window.innerWidth > 768) {
		searchInputContainer.classList.add("search-desktop");
		searchInputContainer.classList.remove("search-mobile");
		countryContainer.classList.add("country-desktop");
		countryContainer.classList.remove("country-mobile");
		searchLogo.classList.add("hidden");
		locationLogo.classList.add("hidden");
	}
};

countryInput.addEventListener("change", () => {
	const value = countryInput.value;
	getFlag(value);
	const nowPlayingMoviesContainer = document.querySelector(
		".now-playing-movies-container"
	);
	const upcomingMoviesContainer = document.querySelector(
		".upcoming-movies-container"
	);
	const topRatedMoviesContainer = document.querySelector(
		".top-rated-movies-container"
	);
	const popularMoviesContainer = document.querySelector(
		".popular-movies-container"
	);
	if (nowPlayingMoviesContainer) {
		getMovies(
			`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=${value}&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1`,
			nowPlayingMoviesContainer
		);
		getMovies(
			`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=${value}&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1`,
			upcomingMoviesContainer
		);
		getMovies(
			`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&vote_count.gte=7000`,
			popularMoviesContainer
		);
		getMovies(
			`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=3000`,
			topRatedMoviesContainer
		);
	}
});

const main = () => {
	history.pushState({ id: "home" }, null, `/home`);
	checkNav();
	getMovies(
		`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
		nowPlayingMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
		upcomingMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&vote_count.gte=7000`,
		popularMoviesContainer
	);
	getMovies(
		`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=3000`,
		topRatedMoviesContainer
	);
	getCountry(
		`https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`
	);
	getRandom(
		`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
		mainContainer
	);
};
main();

document.addEventListener("click", (e) => {
	if (
		e.target &&
		(e.target.classList == "box-img-movie" ||
			e.target.classList == "box-movie" ||
			e.target.classList == "movie-title")
	) {
		movieClick(e.target.id);
	}
});

document.addEventListener("click", (e) => {
	if (
		e.target &&
		(e.target.classList == "box-img-cast" ||
			e.target.classList == "box-cast" ||
			e.target.classList == "cast-title")
	) {
		castClick(e.target.id);
	}
});

window.addEventListener("popstate", (e) => {
	let link = window.location.href;
	if (link.includes("movie")) {
		getMoviesClick(
			`https://api.themoviedb.org/3/movie/${e.state.id}?api_key=${API_KEY}&append_to_response=videos,images,reviews,credits`
		);
	} else if (link.includes("cast")) {
		getCastClick(
			`https://api.themoviedb.org/3/person/${e.state.id}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,movie`
		);
	} else if (link.includes("home")) {
		restart();
	} else if (link.includes("search")) {
		search(e.state.id, e.state.number);
	}
});
