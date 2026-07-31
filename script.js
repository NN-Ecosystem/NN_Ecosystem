console.log("NN Ecosystem landing page started");

const canvas = document.getElementById("bg-canvas");
const ctx = canvas?.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];

function resizeCanvas() {
    if (!canvas || !ctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 700 ? 45 : 90 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.7 + 0.6,
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.45 + 0.12
    }));
}

function drawBackground() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#07091c");
    gradient.addColorStop(0.55, "#0b1230");
    gradient.addColorStop(1, "#071224");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 225, 255, ${particle.alpha})`;
        ctx.fill();
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < -4) particle.x = width + 4;
        if (particle.x > width + 4) particle.x = -4;
        if (particle.y < -4) particle.y = height + 4;
        if (particle.y > height + 4) particle.y = -4;
    });
    requestAnimationFrame(drawBackground);
}
resizeCanvas();
drawBackground();
window.addEventListener("resize", resizeCanvas);

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('[data-download-placeholder="true"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        if (link.getAttribute("href") === "#") event.preventDefault();
    });
});

const firebaseConfig = {
    apiKey: "AIzaSyAd7ZklDOBGLgZAcZNmy1AMabw_n6YP4DY",
    authDomain: "nn-ecosystem.firebaseapp.com",
    databaseURL: "https://nn-ecosystem-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nn-ecosystem",
    storageBucket: "nn-ecosystem.firebasestorage.app",
    messagingSenderId: "1059267594892",
    appId: "1:1059267594892:web:ac6cb6f4f46fd0195609a9",
    measurementId: "G-3KKN3HK4G1"
};

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const viewRef = db.ref("stats/views");
    viewRef.transaction((value) => (value || 0) + 1);
    viewRef.on("value", (snapshot) => {
        const element = document.getElementById("view-count");
        if (element) element.textContent = (snapshot.val() || 0).toLocaleString();
    });

    const userId = `user_${Math.random().toString(36).slice(2, 10)}`;
    const userRef = db.ref(`stats/online_users/${userId}`);
    db.ref(".info/connected").on("value", (snapshot) => {
        if (snapshot.val() === true) {
            userRef.set(true);
            userRef.onDisconnect().remove();
        }
    });
    db.ref("stats/online_users").on("value", (snapshot) => {
        const element = document.getElementById("online-count");
        if (element) element.textContent = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
    });

    const form = document.getElementById("feedback-form");
    const status = document.getElementById("form-status");
    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = form.querySelector("button");
        const name = document.getElementById("fb-name").value.trim();
        const email = document.getElementById("fb-email").value.trim();
        const message = document.getElementById("fb-message").value.trim();
        if (!name || !email || !message) return;
        button.disabled = true;
        status.textContent = "Sending...";
        try {
            await db.ref("feedbacks").push({ name, email, message, createdAt: firebase.database.ServerValue.TIMESTAMP });
            form.reset();
            status.textContent = "Thank you. Your comment was sent.";
        } catch (error) {
            console.error(error);
            status.textContent = "Unable to send right now. Please try again.";
        } finally {
            button.disabled = false;
        }
    });

    const comments = [];
    db.ref("feedbacks").limitToLast(8).on("value", (snapshot) => {
        comments.length = 0;
        snapshot.forEach((child) => comments.push(child.val()));
        comments.reverse();
        const list = document.getElementById("comment-list");
        if (!list) return;
        if (!comments.length) {
            list.innerHTML = '<p class="empty-state">No comments yet.</p>';
            return;
        }
        list.innerHTML = comments.map((item) => {
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "";
            return `<article class="comment-item"><strong>${escapeHtml(item.name || "Guest")}</strong><p>${escapeHtml(item.message || "")}</p>${date ? `<time>${date}</time>` : ""}</article>`;
        }).join("");
    });
} else {
    console.warn("Firebase SDK was not loaded. View counters and comments are unavailable.");
}
