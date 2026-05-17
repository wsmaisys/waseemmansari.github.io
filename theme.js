(function () {
  const banner = document.getElementById("cookie-banner");
  const acceptButton = document.querySelector("[data-cookie-accept]");

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function showCookieBanner() {
    if (!banner) {
      return;
    }
    if (!document.cookie.includes("cookie_consent=accepted")) {
      banner.style.display = "flex";
    }
  }

  function acceptCookies() {
    setCookie("cookie_consent", "accepted", 365);
    if (banner) {
      banner.style.display = "none";
    }
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", acceptCookies);
  }

  window.addEventListener("load", showCookieBanner);

  const yearElement = document.getElementById("footer-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const trackedLinks = document.querySelectorAll("[data-analytics-type]");
  trackedLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (typeof gtag !== "function") {
        return;
      }
      gtag("event", "project_interaction", {
        event_category: "engagement",
        event_label: link.getAttribute("data-analytics-type"),
        project_name:
          link.getAttribute("data-project-name") || "Unknown Project",
        link_url: link.href,
      });
    });
  });
})();
