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


/* =========================
   CATALOG CLIENT
========================= */

const CATALOG_URL = "catalog/index.json";
const CATALOG_TYPES = {
    engine: { gridId: "engine-grid", countId: "engine-count", emptyId: "engine-empty" },
    plugin: { gridId: "plugin-grid", countId: "plugin-count", emptyId: "plugin-empty" },
    core: { gridId: "core-grid", countId: "core-count", emptyId: "core-empty" }
};

let catalogItems = [];

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function buildCatalogCard(item) {
    const itemId = escapeHtml(item.item_id || item.slug || "catalog_item");
    const title = escapeHtml(item.title || item.name || itemId);
    const summary = escapeHtml(item.summary || item.description_short || "");
    const image = escapeHtml(item.image || "");
    const version = escapeHtml(item.version || "");
    const channel = escapeHtml(item.channel || "stable");
    const minCore = escapeHtml(item.minimum_core_version || "");
    const targetUrl = escapeHtml(item.link_store || item.release_url || item.download_url || "#");

    return `
        <a href="${targetUrl}" target="_blank" rel="noopener noreferrer"
           class="card-link catalog-card-link" data-item-id="${itemId}"
           onclick="trackClick('${itemId}', event)">
            <article class="card catalog-card reveal">
                ${image ? `<div class="card-image"><img src="${image}" alt="${title}" loading="lazy"></div>` : ""}
                <div class="card-content">
                    <div class="catalog-badges">
                        ${version ? `<span class="catalog-badge">v${version}</span>` : ""}
                        <span class="catalog-badge catalog-badge-channel">${channel}</span>
                        ${minCore ? `<span class="catalog-badge">Core ${minCore}+</span>` : ""}
                    </div>
                    <h2>${title}</h2>
                    <p>${summary}</p>
                </div>
            </article>
        </a>`;
}

function renderCatalogType(type, query = "") {
    const config = CATALOG_TYPES[type];
    if (!config) return;

    const grid = document.getElementById(config.gridId);
    const count = document.getElementById(config.countId);
    const empty = document.getElementById(config.emptyId);
    if (!grid) return;

    const normalizedQuery = query.trim().toLowerCase();
    const items = catalogItems.filter((item) => {
        if (item.type !== type || item.status !== "released") return false;
        if (!normalizedQuery) return true;
        return [item.name, item.title, item.summary, item.item_id]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    grid.innerHTML = items.map(buildCatalogCard).join("");
    if (count) count.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;
    if (empty) empty.hidden = items.length !== 0;
}

function bindCatalogSearch() {
    document.querySelectorAll("[data-catalog-search]").forEach((input) => {
        input.addEventListener("input", () => {
            renderCatalogType(input.dataset.catalogSearch, input.value);
        });
    });
}

async function loadCatalog() {
    try {
        const response = await fetch(CATALOG_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const catalog = await response.json();
        if (catalog.schema !== "core_factory_catalog_v1" || !Array.isArray(catalog.items)) {
            throw new Error("Unsupported catalog schema");
        }
        catalogItems = catalog.items;
        Object.keys(CATALOG_TYPES).forEach((type) => renderCatalogType(type));
    } catch (error) {
        console.error("Catalog load failed:", error);
        Object.values(CATALOG_TYPES).forEach((config) => {
            const grid = document.getElementById(config.gridId);
            if (grid) grid.innerHTML = `<div class="catalog-error">Catalog is temporarily unavailable.</div>`;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    bindCatalogSearch();
    loadCatalog();
});

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
// CLICK TRACKING DATABASE
// ======================================================

const fs = db;

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

/* --- PHẦN XỬ LÝ FEEDBACK & COMMENT --- */

const fbForm = document.getElementById('feedback-form');

if (fbForm) {
    fbForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Lấy dữ liệu từ Form Feedback của anh
        const name = document.getElementById('fb-name').value;
        const email = document.getElementById('fb-email').value;
        const message = document.getElementById('fb-message').value;

        // Đẩy lên nhánh 'feedbacks' (anh nên dùng tên này cho chuyên nghiệp)
        const feedbackRef = db.ref('feedbacks').push();
        feedbackRef.set({
            name: name,
            email: email,
            message: message,
            timestamp: Date.now()
        }).then(() => {
            alert("Thank you! Feedback has been submitted successfully.");
            // THÊM DÒNG NÀY VÀO ĐÂY:
            notifyPlatforms(name, message);
            fbForm.reset();
        }).catch((error) => {
            console.error("Firebase error:", error);
        });
    });
}

/* --- HIỂN THỊ FEEDBACK MỚI NHẤT LÊN WEB (NẾU MUỐN) --- */
// Nếu anh muốn show các lời nhắn của mọi người lên một chỗ nào đó
db.ref('feedbacks').limitToLast(5).on('child_added', (snapshot) => {
    const data = snapshot.val();
    const list = document.getElementById('comment-list'); // Đảm bảo anh có id này ở đâu đó trong HTML
    if (list) {
        const item = `
            <div class="feedback-item">
                <strong>${data.name}:</strong> <span>${data.message}</span>
            </div>
        `;
        list.insertAdjacentHTML('afterbegin', item);
    }
});
// Lắng nghe dữ liệu từ nhánh 'feedbacks'
db.ref('feedbacks').limitToLast(5).on('child_added', (snapshot) => {
    const data = snapshot.val();
    const list = document.getElementById('comment-list');
    
    if (list) {
        const itemHTML = `
            <div class="comment-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #0a84ff; font-size: 0.95rem;">${data.name}</strong>
                    <small style="color: #555; font-size: 0.75rem;">${new Date(data.timestamp).toLocaleDateString()}</small>
                </div>
                <p style="margin: 8px 0 0 0; color: #b9d8ff; line-height: 1.5; font-size: 0.9rem;">
                    ${data.message}
                </p>
            </div>
        `;
        list.insertAdjacentHTML('afterbegin', itemHTML);
    }
});
const TELEGRAM_TOKEN = '7872350160:AAH29T8dCugatB0RWwuVmzYT5LQQj0OvQXY';
const TELEGRAM_CHAT_ID = '7786664850';
const DISCORD_WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1376358852504584202/-Da1hdXDxSKxaWOYraU3WqnO-5_qui5e1MQJSZvkmeim455_I1yVdeH0xm-sfnxdGe-J';

function notifyPlatforms(name, message) {
    const text = `🚀 **Hệ sinh thái Nho Nguyen**\n💬 Có comment mới từ: ${name}\n📝 Nội dung: ${message}`;

    // 1. Gửi đến Telegram
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        })
    });

    // 2. Gửi đến Discord
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: text
        })
    });
}

