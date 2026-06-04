(function () {
  const MEME_API_URL = "https://meme-api.com/gimme/memes/50";
  const REDDIT_URLS = [
    "https://www.reddit.com/r/memes/.json?limit=75&raw_json=1",
    "https://www.reddit.com/r/memes/top/.json?t=week&limit=75&raw_json=1",
    "https://www.reddit.com/r/memes/hot/.json?limit=75&raw_json=1"
  ];
  const PROXY_URLS = REDDIT_URLS.map((url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  const targetTime = new Date("2026-06-04T21:00:00+03:00");
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  const els = {
    elapsedTime: document.getElementById("elapsedTime"),
    memeCredit: document.getElementById("memeCredit")
  };

  loadRandomMemeBackground();
  registerServiceWorker();
  updateCounter();
  window.setInterval(updateCounter, 1000);

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  }

  async function loadRandomMemeBackground() {
    const loaders = [fetchFromMemeApi, fetchFromReddit];

    for (const loader of loaders) {
      try {
        const memes = await loader();
        const meme = chooseRandom(memes);
        if (!meme) continue;

        document.documentElement.style.setProperty("--meme-background", `url("${cssUrl(meme.image)}")`);
        els.memeCredit.textContent = `Open meme: ${cleanTitle(meme.title)}`;
        els.memeCredit.href = meme.permalink;
        return;
      } catch (error) {
        console.warn("Meme source failed.", error);
      }
    }

    els.memeCredit.textContent = "Open r/memes";
  }

  async function fetchFromMemeApi() {
    const response = await fetch(MEME_API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Meme API unavailable");

    const json = await response.json();
    const posts = Array.isArray(json.memes) ? json.memes : [json];
    return posts
      .filter((post) => post && !post.nsfw && post.url)
      .map((post) => ({
        title: post.title || "r/memes",
        image: post.url,
        permalink: post.postLink || "https://www.reddit.com/r/memes/"
      }))
      .filter((post) => imageLooksUsable(post.image));
  }

  async function fetchFromReddit() {
    for (const url of [...REDDIT_URLS, ...PROXY_URLS]) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) continue;

        const memes = extractRedditImages(await response.json());
        if (memes.length) return memes;
      } catch {
        // Try the next route.
      }
    }

    throw new Error("Reddit unavailable");
  }

  function extractRedditImages(listing) {
    return (listing?.data?.children || [])
      .map((child) => child.data)
      .filter((post) => post && !post.over_18 && !post.is_video)
      .map((post) => ({
        title: post.title || "r/memes",
        image: imageFromRedditPost(post),
        permalink: `https://www.reddit.com${post.permalink || "/r/memes/"}`
      }))
      .filter((post) => imageLooksUsable(post.image));
  }

  function imageFromRedditPost(post) {
    const direct = post.url_overridden_by_dest || post.url || "";
    if (imageLooksUsable(direct)) return direct;

    return post.preview?.images?.[0]?.source?.url || "";
  }

  function updateCounter() {
    const now = new Date();
    const elapsed = Math.max(0, now.getTime() - targetTime.getTime());
    const parts = splitDuration(elapsed);

    els.elapsedTime.textContent = `${parts.days}:${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
  }

  function splitDuration(milliseconds) {
    return {
      days: Math.floor(milliseconds / day),
      hours: Math.floor((milliseconds % day) / hour),
      minutes: Math.floor((milliseconds % hour) / minute),
      seconds: Math.floor((milliseconds % minute) / second)
    };
  }

  function chooseRandom(items) {
    if (!items.length) return null;
    const random = window.crypto?.getRandomValues
      ? window.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
      : Math.random();

    return items[Math.floor(random * items.length)];
  }

  function imageLooksUsable(value) {
    return /\.(png|jpe?g|webp)(\?.*)?$/i.test(String(value || ""));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function cssUrl(value) {
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function cleanTitle(value) {
    const title = String(value || "r/memes").replace(/\s+/g, " ").trim();
    return title.length > 32 ? `${title.slice(0, 29)}...` : title;
  }
})();
