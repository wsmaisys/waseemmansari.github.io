const defaultStyles = `
  :host {
    display: block;
  }

  nav {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    color: var(--breadcrumb-current, #6b7fa3);
    font-size: 0.82rem;
    line-height: 1.4;
  }

  ol {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  a {
    color: var(--breadcrumb-link, #00e0ff);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover,
  a:focus-visible {
    color: #fff;
  }

  .separator {
    color: var(--breadcrumb-separator, rgba(0, 224, 255, 0.45));
    user-select: none;
  }

  [aria-current="page"] {
    color: var(--breadcrumb-current, #6b7fa3);
    font-weight: 600;
  }
`;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const breadcrumbMockData = [
  { label: "Home", href: "https://waseemmansari.github.io/" },
  {
    label: "Portfolio",
    href: "https://waseemmansari.github.io/",
  },
];

export class SeoBreadcrumb extends HTMLElement {
  #items = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  set items(value) {
    this.#items = Array.isArray(value) ? value.filter(Boolean) : [];
    this.render();
  }

  get items() {
    return this.#items;
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    const items = this.#items.length ? this.#items : breadcrumbMockData;
    const lastIndex = items.length - 1;

    this.shadowRoot.innerHTML = `
      <style>${defaultStyles}</style>
      <nav aria-label="Breadcrumb">
        <ol>
          ${items
            .map((item, index) => {
              const isCurrent = index === lastIndex;
              const label = escapeHtml(item?.label ?? "");
              const href = item?.href;
              const separator =
                index < lastIndex
                  ? '<span class="separator" aria-hidden="true">/</span>'
                  : "";

              if (!href || isCurrent) {
                return `
                  <li>
                    <span aria-current="page">${label}</span>
                    ${separator}
                  </li>
                `;
              }

              return `
                <li>
                  <a href="${escapeHtml(href)}">${label}</a>
                  ${separator}
                </li>
              `;
            })
            .join("")}
        </ol>
      </nav>
    `;

    this.#syncStructuredData(items);
  }

  #syncStructuredData(items) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item?.label ?? "",
        item: item?.href ?? undefined,
      })),
    };

    const existing = this.querySelector('script[type="application/ld+json"]');
    const script = existing || document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd, null, 2);

    if (!existing) {
      this.appendChild(script);
    }
  }
}

if (!customElements.get("seo-breadcrumb")) {
  customElements.define("seo-breadcrumb", SeoBreadcrumb);
}
