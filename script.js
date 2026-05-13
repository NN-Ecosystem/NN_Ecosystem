console.log("Landing page started");


/* =========================
   CANVAS BACKGROUND
========================= */

const canvas =
document.getElementById("bg-canvas");

const ctx =
canvas.getContext("2d");


/* SIZE */

let W =
window.innerWidth;

let H =
window.innerHeight;


canvas.width = W;
canvas.height = H;


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

// 2. Khởi tạo theo kiểu "Compat" (tương thích với thẻ script ở index.html)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// 1. Tăng số View khi User mở web
const viewRef = db.ref('stats/views');
viewRef.transaction((currentValue) => {
    return (currentValue || 0) + 1;
});

// 2. Lắng nghe và cập nhật lên giao diện HTML
viewRef.on('value', (snapshot) => {
    const totalViews = snapshot.val();
    const viewElement = document.getElementById('view-count');
    if (viewElement) {
        viewElement.innerText = totalViews.toLocaleString(); 
    }
});

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
