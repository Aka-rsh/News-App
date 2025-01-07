const API_KEY = "1b00e18e72f7407ca2075a2d745bbd93";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        if (data.status !== "ok") {
            throw new Error(`API Error: ${data.message}`);
        }

        if (data.totalResults === 0) {
            throw new Error("No articles found for your search query.");
        }

        bindData(data.articles);

    } catch (error) {
        console.error("Error fetching news:", error);
        displayError(error.message || "Something went wrong.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = '';

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function displayError(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <p>Please try again later or refine your query.</p>
        </div>
    `;
}

window.addEventListener("scroll", () => {
    const footer = document.querySelector("footer");
    const scrollPosition = window.scrollY;
    const threshold = document.body.scrollHeight - window.innerHeight - 200; // Adjust threshold

    if (scrollPosition > threshold) {
        footer.classList.add("fixed"); // Show footer
    } else {
        footer.classList.remove("fixed"); // Hide footer
    }
});