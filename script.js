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
        const rows = Array.isArray(data.items) ? [...data.items] : [];

        // Landing owns a defensive presentation invariant: newest feedback first.
        // Cloud currently returns DESC as well, but sorting here prevents a future
        // backend/query-order change from silently reversing the public feed.
        rows.sort((a, b) => {
            const toEpoch = (value) => {
                if (typeof value === 'number' && Number.isFinite(value)) return value;
                const numeric = Number(value);
                if (Number.isFinite(numeric)) return numeric;
                const parsed = Date.parse(String(value || ''));
                return Number.isFinite(parsed) ? parsed / 1000 : 0;
            };
            return toEpoch(b?.created_at) - toEpoch(a?.created_at);
        });

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

async function submitLandingFeedback(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = document.getElementById('feedback-submit');
    const status = document.getElementById('feedback-status');
    const name = String(document.getElementById('fb-name')?.value || '').trim();
    const email = String(document.getElementById('fb-email')?.value || '').trim();
    const comment = String(document.getElementById('fb-message')?.value || '').trim();

    if (!name || !email || !comment) {
        if (status) status.textContent = 'Please complete all fields.';
        return;
    }

    if (submit) submit.disabled = true;
    if (status) status.textContent = 'Sending...';
    try {
        const response = await fetch('https://ecosystem-verify-server.onrender.com/v1/public/store/comments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, comment})
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const detail = data?.detail;
            throw new Error(typeof detail === 'string' ? detail : `HTTP ${response.status}`);
        }
        form.reset();
        if (status) status.textContent = 'Thank you! Your feedback has been submitted.';
        await loadGlobalCommunityFeedback();
    } catch (error) {
        console.warn('Feedback submit failed:', error);
        if (status) status.textContent = 'Could not send feedback. Please try again.';
    } finally {
        if (submit) submit.disabled = false;
    }
}

function initLandingFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (form) form.addEventListener('submit', submitLandingFeedback);
}

document.addEventListener('DOMContentLoaded', initLandingFeedbackForm);

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

function normalizeLegacyStoreAssetUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const legacyPrefix = "https://nn-ecosystem.github.io/NN_Ecosystem/";
    if (raw.startsWith(legacyPrefix)) {
        return `https://nn-ecosystem.github.io/${raw.slice(legacyPrefix.length)}`;
    }
    return raw;
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


function catalogPlatformBadges(item) {
    const platforms = item && typeof item.platforms === "object" && item.platforms ? item.platforms : null;
    if (!platforms) return '<span class="catalog-badge">Windows</span>';
    const labels = {windows:"Windows", android:"Android", ios:"iOS", macos:"macOS", linux:"Linux"};
    return Object.entries(platforms)
        .filter(([_, entry]) => entry === true || (entry && typeof entry === "object" && entry.available !== false))
        .map(([id]) => `<span class="catalog-badge">${escapeHtml(labels[id] || id)}</span>`)
        .join("");
}

function renderCatalogCard(item) {
    const releaseUrl = safeExternalUrl(item.release_url);
    const storeUrl = safeExternalUrl(item.link_store);
    const downloadUrl = safeExternalUrl(item.download_url);
    const primaryUrl = releaseUrl || storeUrl;
    const image = escapeHtml(normalizeLegacyStoreAssetUrl(item.image));
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
                    ${catalogPlatformBadges(item)}
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

const DOMAIN_ORDER = ["productivity", "knowledge_research", "communication", "creator_media", "personal_life", "finance_trading", "entertainment", "developer_system"];
const DOMAIN_LABELS = {
    productivity:"Productivity", knowledge_research:"Knowledge & Research", communication:"Communication",
    creator_media:"Creator & Media", personal_life:"Personal Life", finance_trading:"Finance & Trading",
    entertainment:"Entertainment", developer_system:"Developer & System"
};
const DISCOVERY_ITEM_LIMIT = 6;
const labelId = (value) => String(value || "").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
const itemFamilies = (item) => Array.isArray(item.family_ids) ? item.family_ids.filter(Boolean) : [];

function renderApplicationDiscovery(items) {
    const domainSelect = document.getElementById("catalog-domain-filter");
    const familySelect = document.getElementById("catalog-family-filter");
    const search = document.getElementById("catalog-discovery-search");
    const grid = document.getElementById("catalog-discovery-grid");
    const empty = document.getElementById("catalog-discovery-empty");
    const status = document.getElementById("catalog-discovery-status");
    if (!domainSelect || !familySelect || !grid) return;

    const taxonomyItems = items.filter((item) => item.domain_id && itemFamilies(item).length);
    const domains = [...new Set(taxonomyItems.map((item) => item.domain_id))];
    domains.sort((a, b) => {
        const ai = DOMAIN_ORDER.indexOf(a), bi = DOMAIN_ORDER.indexOf(b);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
    });
    domainSelect.innerHTML = '<option value="all">All needs</option>' + domains.map((id) =>
        `<option value="${escapeHtml(id)}">${escapeHtml(DOMAIN_LABELS[id] || labelId(id))}</option>`
    ).join("");

    const rerender = () => {
        const domain = domainSelect.value;
        const families = [...new Set(taxonomyItems
            .filter((item) => domain === "all" || item.domain_id === domain)
            .flatMap(itemFamilies))].sort();
        const priorFamily = familySelect.value;
        familySelect.innerHTML = '<option value="all">All applications</option>' + families.map((id) =>
            `<option value="${escapeHtml(id)}">${escapeHtml(labelId(id))}</option>`
        ).join("");
        familySelect.value = families.includes(priorFamily) ? priorFamily : "all";
        const family = familySelect.value;
        const query = String(search?.value || "").trim().toLowerCase();
        const scoped = taxonomyItems.filter((item) =>
            (domain === "all" || item.domain_id === domain) &&
            (family === "all" || itemFamilies(item).includes(family))
        );
        const byFamily = new Map();
        scoped.forEach((item) => itemFamilies(item).forEach((familyId) => {
            if (family !== "all" && familyId !== family) return;
            if (!byFamily.has(familyId)) byFamily.set(familyId, []);
            byFamily.get(familyId).push(item);
        }));
        const applications = [...byFamily.entries()].map(([familyId, members]) => {
            const ordered = [...members].sort((a, b) => {
                const rank = (x) => normalizeCatalogType(x.type) === "plugin" ? 0 : normalizeCatalogType(x.type) === "node_service" ? 1 : 2;
                return rank(a) - rank(b) || String(a.title || a.name).localeCompare(String(b.title || b.name));
            });
            return {...ordered[0], _familyId: familyId, _memberCount: members.length};
        }).filter((item) => !query || [item.title, item.name, item._familyId, item.domain_id, ...(item.capabilities || [])]
            .some((value) => String(value || "").toLowerCase().includes(query)));
        const visibleApplications = applications.slice(0, DISCOVERY_ITEM_LIMIT);
        grid.innerHTML = visibleApplications.map((item) => renderCatalogCard({...item,
            summary: `${DOMAIN_LABELS[item.domain_id] || labelId(item.domain_id)} · ${labelId(item._familyId)} · ${item._memberCount} ecosystem item(s). ${catalogSummary(item)}`
        })).join("");
        empty.hidden = applications.length !== 0;
        if (!taxonomyItems.length) {
            status.textContent = "Taxonomy metadata is not published yet. Sync the Canonical Catalog from Product Catalog.";
        } else {
            status.textContent = applications.length > DISCOVERY_ITEM_LIMIT
                ? `Showing ${DISCOVERY_ITEM_LIMIT} of ${applications.length} application families · Use Domain, Family or Search to refine`
                : `${applications.length} application families · ${taxonomyItems.length} taxonomy-ready items`;
        }
    };
    domainSelect.addEventListener("change", rerender);
    familySelect.addEventListener("change", rerender);
    search?.addEventListener("input", rerender);
    rerender();
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

        renderApplicationDiscovery(items);

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
