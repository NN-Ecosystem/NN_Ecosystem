console.log("Landing page started");


/* =========================
   CANVAS BACKGROUND
========================= */

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

/* SIZE - Cập nhật thông minh */
let W, H;

function setCanvasSize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

// Gọi lần đầu khi load trang
setCanvasSize();

// Tự động chỉnh lại khi anh xoay điện thoại hoặc resize trình duyệt
window.addEventListener("resize", () => {
    setCanvasSize();
    // Nếu anh có hàm init() để tạo lại các hạt, hãy gọi ở đây để các hạt rải đều lại từ đầu
    // init(); 
});


/* PARTICLES */

const particles = [];


/* CREATE PARTICLES */

for(let i = 0; i < 120; i++){

    particles.push({

        x:
        Math.random() * W,

        y:
        Math.random() * H,

        radius:
        Math.random() * 2 + 1.5,

        speedX:
        (Math.random() - 0.5) * 0.25,

        speedY:
        (Math.random() - 0.5) * 0.25,

        alpha:
        Math.random() * 0.5 + 0.2
    });
}


/* DRAW BACKGROUND */

function drawBackground(){


    /* CLEAR */

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /* GRADIENT */

    const gradient =
    ctx.createLinearGradient(
        0,
        0,
        0,
        H
    );


    gradient.addColorStop(
        0,
        "rgb(10, 8, 42)"
    );


    gradient.addColorStop(
        1,
        "rgb(8, 6, 35)"
    );


    ctx.fillStyle =
    gradient;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* PARTICLES */

    particles.forEach((p)=>{


        ctx.beginPath();


        ctx.arc(

            p.x,
            p.y,
            p.radius,

            0,
            Math.PI * 2
        );


        ctx.fillStyle =
        `rgba(255,255,220,${p.alpha})`;


        ctx.fill();


        /* MOVE */
        const speedMultiplier = 2.5; // Anh tăng số này lên để nhanh hơn (ví dụ: 2, 3, 5...)

        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;


        /* LOOP */

        if(p.x < 0){

            p.x = W;
        }

        if(p.x > W){

            p.x = 0;
        }

        if(p.y < 0){

            p.y = H;
        }

        if(p.y > H){

            p.y = 0;
        }

    });


    requestAnimationFrame(
        drawBackground
    );
}


/* START */

drawBackground();


/* RESIZE */

window.addEventListener(

    "resize",

    ()=>{

        W =
        window.innerWidth;

        H =
        window.innerHeight;


        canvas.width = W;
        canvas.height = H;
    }
);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd7ZklDOBGLgZAcZNmy1AMabw_n6YP4DY",
  authDomain: "nn-ecosystem.firebaseapp.com",
  // SỬA DÒNG NÀY: Dán link có chứa 'asia-southeast1' vào đây
  databaseURL: "https://nn-ecosystem-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nn-ecosystem",
  storageBucket: "nn-ecosystem.firebasestorage.app",
  messagingSenderId: "1059267594892",
  appId: "1:1059267594892:web:ac6cb6f4f46fd0195609a9",
  measurementId: "G-3KKN3HK4G1"
};

// =====================================================
// FIREBASE
// =====================================================

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// =====================================================
// TOTAL VIEWS
// =====================================================

const viewRef = db.ref('stats/views');

viewRef.transaction((currentValue) => {

    return (currentValue || 0) + 1;

});

// realtime update views
viewRef.on('value', (snapshot) => {

    const totalViews = snapshot.val() || 0;

    const viewElement =
        document.getElementById('view-count');

    if (viewElement) {

        viewElement.innerText =
            totalViews.toLocaleString();

    }

});

// =====================================================
// ONLINE USERS
// =====================================================

// random user id
const userId =
    'user_' +
    Math.random().toString(36).substring(2, 10);

// current user ref
const userRef = db.ref(
    'stats/online_users/' + userId
);

// firebase connection detect
const connectedRef = db.ref('.info/connected');

connectedRef.on('value', (snapshot) => {

    if (snapshot.val() === true) {

        // set online
        userRef.set(true);

        // auto remove khi disconnect
        userRef.onDisconnect().remove();

    }

});

// =====================================================
// COUNT ONLINE
// =====================================================

const onlineRef = db.ref(
    'stats/online_users'
);

onlineRef.on('value', (snapshot) => {

    const data = snapshot.val();

    const onlineCount = data
        ? Object.keys(data).length
        : 0;

    const onlineElement =
        document.getElementById('online-count');

    if (onlineElement) {

        onlineElement.innerText =
            onlineCount;

    }

});
// ======================================================
// FIREBASE
// ======================================================

// Firebase already initialized above.


const fs = firebase.database();

// ======================================================
// TRACK CLICK
// ======================================================

function trackClick(linkId, event) {

    // chặn mặc định
    event.preventDefault();

    // lấy link
    const linkElement = event.currentTarget;

    const targetUrl = linkElement.href;

    const isBlank = (
        linkElement.target === "_blank"
    );

    // ==================================================
    // UPDATE CLICK
    // ==================================================

    const clickRef = fs.ref(
        "statistics/clicks/" + linkId
    );

    clickRef.transaction((currentValue) => {

        return (currentValue || 0) + 1;

    });

    // ==================================================
    // UPDATE TOTAL
    // ==================================================

    const totalRef = fs.ref(
        "statistics/clicks/total"
    );

    totalRef.transaction((currentValue) => {

        return (currentValue || 0) + 1;

    });

    // ==================================================
    // REDIRECT
    // ==================================================

    setTimeout(() => {

        if (isBlank) {

            window.open(targetUrl, "_blank");

        } else {

            window.location.href = targetUrl;

        }

    }, 200);
};

/* --- COMMUNITY FEEDBACK ---
   Cloud is the single authority. Landing is read-only; users submit feedback
   from Core Marketplace. Firebase remains only for existing site analytics.
*/

function renderFeedbackItem(data) {
    const list = document.getElementById('comment-list');
    if (!list || !data) return;
    const item = document.createElement('article');
    item.className = 'comment-item';
    const meta = document.createElement('div');
    meta.className = 'comment-meta';
    const name = document.createElement('strong');
    name.className = 'comment-name';
    name.textContent = String(data.display_name || 'Community member');
    if (data.email) name.textContent += ` · ${String(data.email)}`;
    const date = document.createElement('small');
    date.className = 'comment-date';
    const timestamp = Number(data.created_at);
    date.textContent = Number.isFinite(timestamp) ? new Date(timestamp * 1000).toLocaleDateString() : '';
    const message = document.createElement('p');
    message.className = 'comment-message';
    message.textContent = String(data.comment || '');
    meta.append(name, date);
    item.append(meta, message);
    list.append(item);
}

async function loadGlobalCommunityFeedback() {
    const list = document.getElementById('comment-list');
    if (!list) return;
    list.textContent = '';
    try {
        const response = await fetch('https://ecosystem-verify-server.onrender.com/v1/public/store/comments?limit=8', {cache:'no-store'});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const rows = Array.isArray(data.items) ? data.items : [];
        if (!rows.length) {
            const empty = document.createElement('p');
            empty.className = 'community-empty';
            empty.textContent = 'No community feedback yet.';
            list.append(empty);
            return;
        }
        rows.forEach(renderFeedbackItem);
    } catch (error) {
        console.warn('Community feedback unavailable:', error);
        const unavailable = document.createElement('p');
        unavailable.className = 'community-empty';
        unavailable.textContent = 'Community feedback is temporarily unavailable.';
        list.append(unavailable);
    }
}

document.addEventListener('DOMContentLoaded', loadGlobalCommunityFeedback);

/* =====================================================
   MARKETPLACE CATALOG
   Card click -> GitHub Release
   Store button -> commercial/store link
   Download button -> release asset
===================================================== */

const CATALOG_URL = "catalog/index.json";
const PRESENTATION_URL = "catalog/presentation.json";
const COMMUNITY_API_URL = "https://ecosystem-verify-server.onrender.com/v1/public/store/comments";

const CATALOG_TYPE_ALIASES = {
    engine: "engine",
    plugin: "plugin",
    pipeline_recipe: "pipeline_recipe",
    "pipeline-recipe": "pipeline_recipe",
    pipeline: "pipeline_recipe",
    core: "core",
    node_service: "node_service",
    "node-service": "node_service",
    nodeservice: "node_service",
    node: "node_service"
};

function normalizeCatalogType(value) {
    const raw = String(value || "")
        .trim()
        .toLowerCase()
        .replaceAll(" ", "_");
    return CATALOG_TYPE_ALIASES[raw] || raw;
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function safeExternalUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
        const url = new URL(raw, window.location.href);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
        return "";
    }
}

function catalogSummary(item) {
    const raw = String(item.summary || item.description || "").trim();
    if (!raw) return "";
    const plain = raw
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#*_>`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return plain.length > 260 ? `${plain.slice(0, 257)}...` : plain;
}

function actionLink(url, label, className) {
    const safe = safeExternalUrl(url);
    if (!safe) return "";
    return `
        <a class="catalog-action ${className}"
           href="${escapeHtml(safe)}"
           target="_blank"
           rel="noopener noreferrer"
           onclick="event.stopPropagation()">
            ${escapeHtml(label)}
        </a>`;
}

function renderCatalogCard(item) {
    const releaseUrl = safeExternalUrl(item.release_url);
    const storeUrl = safeExternalUrl(item.link_store);
    const downloadUrl = safeExternalUrl(item.download_url);
    const primaryUrl = releaseUrl || storeUrl;
    const image = escapeHtml(item.image || "");
    const title = escapeHtml(item.title || item.name || item.item_id || "Untitled");
    const summary = escapeHtml(catalogSummary(item));
    const version = escapeHtml(item.version || "—");
    const channel = escapeHtml(item.channel || "stable");
    const core = escapeHtml(item.minimum_core_version || "2.0.0");

    return `
        <article class="card reveal catalog-card"
                 data-primary-url="${escapeHtml(primaryUrl)}"
                 tabindex="${primaryUrl ? "0" : "-1"}"
                 role="${primaryUrl ? "link" : "article"}"
                 aria-label="${title}">
            ${image ? `
                <div class="card-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                </div>` : ""}
            <div class="card-content">
                <div class="catalog-badges">
                    <span class="catalog-badge">v${version}</span>
                    <span class="catalog-badge catalog-badge-channel">${channel}</span>
                    <span class="catalog-badge">Core ${core}+</span>
                </div>
                <h2>${title}</h2>
                ${summary ? `<p>${summary}</p>` : ""}
                <div class="catalog-actions">
                    ${actionLink(releaseUrl, "View Release", "catalog-action-release")}
                    ${actionLink(downloadUrl, "Download", "catalog-action-download")}
                    ${actionLink(storeUrl, "Link Store", "catalog-action-store")}
                </div>
            </div>
        </article>`;
}

const CATALOG_PAGE_SIZE = 6;

const catalogPageState = {
    engine: 1,
    plugin: 1,
    pipeline_recipe: 1,
    node_service: 1,
    core: 1
};

function isMobileCatalog() {
    return window.matchMedia("(max-width: 900px)").matches;
}

function ensureCatalogPagination(type, grid) {
    let pagination = document.getElementById(`${type}-pagination`);

    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = `${type}-pagination`;
        pagination.className = "catalog-pagination";

        grid.insertAdjacentElement("afterend", pagination);
    }

    return pagination;
}

function buildPageList(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
        end = 4;
    }

    if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
    }

    if (start > 2) {
        pages.push("...");
    }

    for (let page = start; page <= end; page++) {
        pages.push(page);
    }

    if (end < totalPages - 1) {
        pages.push("...");
    }

    pages.push(totalPages);

    return pages;
}

function renderCatalogPagination(
    type,
    pagination,
    currentPage,
    totalPages,
    rerender
) {
    if (isMobileCatalog() || totalPages <= 1) {
        pagination.innerHTML = "";
        pagination.hidden = true;
        return;
    }

    pagination.hidden = false;

    const pages = buildPageList(currentPage, totalPages);

    const pageButtons = pages.map((page) => {
        if (page === "...") {
            return `<span class="catalog-page-ellipsis">…</span>`;
        }

        const active =
            page === currentPage
                ? " catalog-page-active"
                : "";

        return `
            <button
                type="button"
                class="catalog-page-btn${active}"
                data-page="${page}">
                ${page}
            </button>
        `;
    }).join("");

    pagination.innerHTML = `
        <button
            type="button"
            class="catalog-page-btn catalog-page-nav"
            data-page="${currentPage - 1}"
            ${currentPage <= 1 ? "disabled" : ""}>
            ←
        </button>

        ${pageButtons}

        <button
            type="button"
            class="catalog-page-btn catalog-page-nav"
            data-page="${currentPage + 1}"
            ${currentPage >= totalPages ? "disabled" : ""}>
            →
        </button>
    `;

    pagination.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", () => {
            const page = Number(button.dataset.page);

            if (
                !Number.isFinite(page) ||
                page < 1 ||
                page > totalPages ||
                page === currentPage
            ) {
                return;
            }

            catalogPageState[type] = page;
            rerender();

            // Khi đổi trang, đưa nhẹ về đầu grid,
            // không cuộn cả website về đầu.
            const section = document.getElementById(type);

            if (section) {
                const y =
                    section.getBoundingClientRect().top +
                    window.scrollY -
                    100;

                window.scrollTo({
                    top: y,
                    behavior: "smooth"
                });
            }
        });
    });
}

function renderCatalogType(items, type, query = "") {
    const grid = document.getElementById(`${type}-grid`);
    const count = document.getElementById(`${type}-count`);
    const empty = document.getElementById(`${type}-empty`);

    if (!grid) return;

    const normalized = query.trim().toLowerCase();

    const filtered = items.filter((item) => {
        if (normalizeCatalogType(item.type) !== type) {
            return false;
        }

        if (
            String(item.status || "released").toLowerCase() !==
            "released"
        ) {
            return false;
        }

        if (!normalized) {
            return true;
        }

        return [
            item.name,
            item.title,
            item.item_id,
            item.summary,
            item.description,
            item.version,
            item.channel
        ].some((value) =>
            String(value || "")
                .toLowerCase()
                .includes(normalized)
        );
    });

    const pagination = ensureCatalogPagination(type, grid);

    // MOBILE:
    // giữ nguyên toàn bộ item để lướt ngang như hiện tại.
    if (isMobileCatalog()) {
        grid.innerHTML =
            filtered.map(renderCatalogCard).join("");

        pagination.innerHTML = "";
        pagination.hidden = true;

        if (count) {
            count.textContent =
                `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;
        }

        if (empty) {
            empty.hidden = filtered.length !== 0;
        }

        return;
    }

    // DESKTOP:
    // 6 card / page.
    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / CATALOG_PAGE_SIZE)
    );

    let currentPage =
        Number(catalogPageState[type]) || 1;

    currentPage = Math.min(
        Math.max(currentPage, 1),
        totalPages
    );

    catalogPageState[type] = currentPage;

    const start =
        (currentPage - 1) * CATALOG_PAGE_SIZE;

    const visibleItems =
        filtered.slice(
            start,
            start + CATALOG_PAGE_SIZE
        );

    grid.innerHTML =
        visibleItems.map(renderCatalogCard).join("");

    if (count) {
        if (filtered.length > CATALOG_PAGE_SIZE) {
            count.textContent =
                `${filtered.length} items · Page ${currentPage}/${totalPages}`;
        } else {
            count.textContent =
                `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;
        }
    }

    if (empty) {
        empty.hidden = filtered.length !== 0;
    }

    renderCatalogPagination(
        type,
        pagination,
        currentPage,
        totalPages,
        () => renderCatalogType(items, type, query)
    );
}

async function loadMarketplaceCatalog() {
    const types = ["engine", "plugin", "pipeline_recipe", "node_service", "core"];

    try {
        const cacheBust = Date.now();
        const [catalogResponse, presentationResponse] = await Promise.all([
            fetch(`${CATALOG_URL}?v=${cacheBust}`, { cache: "no-store" }),
            fetch(`${PRESENTATION_URL}?v=${cacheBust}`, { cache: "no-store" })
                .catch(() => null)
        ]);

        if (!catalogResponse.ok) {
            throw new Error(`Catalog HTTP ${catalogResponse.status}`);
        }

        const catalog = await catalogResponse.json();
        const distributionItems = Array.isArray(catalog.items)
            ? catalog.items
            : [];

        let presentationItems = [];
        if (presentationResponse && presentationResponse.ok) {
            try {
                const presentation = await presentationResponse.json();
                if (
                    presentation &&
                    presentation.schema === "core_factory_catalog_presentation_v1" &&
                    Array.isArray(presentation.items)
                ) {
                    presentationItems = presentation.items;
                }
            } catch (_) {
                presentationItems = [];
            }
        }

        const presentationById = new Map(
            presentationItems
                .filter((item) => item && item.item_id)
                .map((item) => [String(item.item_id), item])
        );

        // Distribution remains authoritative for version/hash/download/release.
        // Presentation only overlays UI/marketing fields. Missing presentation
        // falls back to the signed legacy catalog, keeping old deployments safe.
        const items = distributionItems.map((item) => {
            const presentation = presentationById.get(String(item.item_id || "")) || {};
            return {
                ...item,
                name: presentation.name || item.name,
                title: presentation.title || item.title,
                summary: presentation.summary || presentation.description || item.summary || item.description,
                description: presentation.description || presentation.summary || item.description || item.summary,
                image: presentation.image || item.image,
                link_store: presentation.link_store || item.link_store,
                // Distribution authority: presentation must never make an item released/installable.
                status: item.status
            };
        });

        // Render lần đầu + Search
        types.forEach((type) => {
            renderCatalogType(items, type);

            const input = document.querySelector(
                `[data-catalog-search="${type}"]`
            );

            if (input) {
                input.addEventListener("input", () => {
                    // Search luôn trở về trang 1
                    catalogPageState[type] = 1;

                    renderCatalogType(
                        items,
                        type,
                        input.value
                    );
                });
            }
        });

        // Desktop <-> Mobile
        // Đặt trong TRY, sau khi đã có items.
        const catalogMedia =
            window.matchMedia("(max-width: 900px)");

        catalogMedia.addEventListener("change", () => {
            types.forEach((type) => {
                const input = document.querySelector(
                    `[data-catalog-search="${type}"]`
                );

                renderCatalogType(
                    items,
                    type,
                    input ? input.value : ""
                );
            });
        });

    } catch (error) {
        console.error(
            "Catalog load failed:",
            error
        );

        types.forEach((type) => {
            const grid =
                document.getElementById(`${type}-grid`);

            if (grid) {
                grid.innerHTML = `
                    <div class="catalog-error">
                        Cannot load marketplace catalog.
                    </div>
                `;
            }
        });
    }
}

document.addEventListener("click", (event) => {
    if (event.target.closest(".catalog-action")) return;
    const card = event.target.closest(".catalog-card");
    if (!card) return;
    const url = safeExternalUrl(card.dataset.primaryUrl);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
});

document.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    if (event.target.closest(".catalog-action")) return;
    const card = event.target.closest(".catalog-card");
    if (!card) return;
    event.preventDefault();
    const url = safeExternalUrl(card.dataset.primaryUrl);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
});

document.addEventListener("DOMContentLoaded", loadMarketplaceCatalog);
