/* =========================================================
   VOL.17 — ANANYA EDITION — script
   ========================================================= */

const beginBtn = document.getElementById("beginBtn");
const intro = document.getElementById("intro");
const shojiLeft = document.getElementById("shojiLeft");
const shojiRight = document.getElementById("shojiRight");
const app = document.getElementById("app");
const menu = document.getElementById("episodeMenu");
const view = document.getElementById("episodeView");
const card3 = document.getElementById("card3");
const glitchOverlay = document.getElementById("glitchOverlay");

/* ---------------- SAKURA PETALS ---------------- */
function spawnPetals(count){
    const layer = document.getElementById("sakuraLayer");
    for(let i=0;i<count;i++){
        const p = document.createElement("div");
        p.className = "petal";
        const size = 8 + Math.random()*10;
        p.style.left = Math.random()*100 + "vw";
        p.style.width = size + "px";
        p.style.height = size + "px";
        p.style.opacity = (0.5 + Math.random()*0.4).toFixed(2);
        const duration = 9 + Math.random()*9;
        p.style.animationDuration = duration + "s";
        p.style.animationDelay = (-Math.random()*duration) + "s";
        layer.appendChild(p);
    }
}
spawnPetals(26);

function petalBurst(count){
    const layer = document.getElementById("sakuraLayer");
    for(let i=0;i<count;i++){
        const p = document.createElement("div");
        p.className = "petal";
        const size = 8 + Math.random()*10;
        p.style.left = Math.random()*100 + "vw";
        p.style.width = size + "px";
        p.style.height = size + "px";
        const duration = 4 + Math.random()*3;
        p.style.animationDuration = duration + "s";
        layer.appendChild(p);
        setTimeout(() => p.remove(), duration*1000 + 200);
    }
}

/* ---------------- VIEWED STATE ---------------- */
const viewed = { 1:false, 2:false, 3:false };

function updateMenuStatus(){
    document.getElementById("status1").textContent = viewed[1] ? "STATUS: COMPLETE" : "STATUS: PENDING";
    document.getElementById("status2").textContent = viewed[2] ? "STATUS: COMPLETE" : "STATUS: PENDING";
    if(viewed[1] && viewed[2]){
        card3.classList.remove("locked");
        document.getElementById("status3").textContent = "STATUS: FINAL";
    } else {
        card3.classList.add("locked");
        document.getElementById("status3").textContent = "LOCKED — finish episodes 01 & 02";
    }
}
updateMenuStatus();

/* ---------------- INTRO -> SHOJI -> APP ---------------- */
beginBtn.addEventListener("click", () => {
    shojiLeft.classList.add("slide-left");
    shojiRight.classList.add("slide-right");
    petalBurst(18);

    setTimeout(() => {
        intro.classList.remove("active");
        app.classList.add("active");
    }, 450);
});

/* ---------------- BACK TO MENU ---------------- */
function backToMenu(){
    view.classList.add("hidden");
    menu.classList.remove("hidden");
}

function backButtonHTML(){
    return `<button class="back-btn" onclick="backToMenu()">&larr; back to vol.17</button>`;
}

/* ---------------- EPISODE DATA ---------------- */
const episodes = {

1: {
    title: "Episode 1 — The Conversion Arc",
    cards: [
        {
            title: "Demon Slayer",
            type: "REQUEST REPORT",
            content: `TARGET: Prabhav
OBJECTIVE: Watch Demon Slayer
ATTEMPTS: 843
SUCCESS RATE: Previously 4%, current 100%`
        },
        {
            title: "Haikyuu",
            type: "MATCH REPORT",
            content: `HOME: Ananya
AWAY: Prabhav
SCORE: 8 - 0
COMMENT: still refusing to watch`
        },
        {
            title: "Banana Fish",
            type: "CONFIDENTIAL",
            content: `EMOTIONAL DAMAGE: EXTREME
RECOMMENDATION: Bring tissues
STATUS: not recovered`
        }
    ]
},

2: {
    title: "Episode 2 — Certified Chaos",
    cards: [
        {
            title: "Case File 001",
            type: "1:03 AM INCIDENT",
            content: `LOCATION: Horror Game Session
EVENT: sudden disappearance, thougt I got haunted, reality mumma cooked me
TRIGGER: parental detection event

RESULT:
I left mid-scene
fear levels: MAX
Comedy Levels : 100000000`
        },
        {
            title: "Rat Cult Log",
            type: "SUBJECT REPORT",
            content: `SUBJECT: ANANYA
ALIAS: Rat Queen
STATUS: Actively recruiting, Just her at the moment 
OBSERVATION: suspicious confidence`
        }
    ]
},

3: {
    title: "Episode 3 — One Last Thing...",
    cards: [
        {
            title: "Final File",
            type: "ENVELOPE PROTOCOL",
            content: `STATUS: READY
OBJECT: LETTER
WARNING: emotional damage likely`
        }
    ]
}

};

/* ---------------- OPEN EPISODE ---------------- */
document.querySelectorAll(".episode-card").forEach(card => {
    card.addEventListener("click", () => {
        const ep = card.dataset.ep;
        if(ep === "3" && card.classList.contains("locked")){
            card.classList.remove("shake");
            void card.offsetWidth;
            card.classList.add("shake");
            return;
        }
        openEpisode(ep);
    });
});

function openEpisode(ep){
    menu.classList.add("hidden");
    view.classList.remove("hidden");

    view.innerHTML = `
        ${backButtonHTML()}
        <div class="title-slam">${episodes[ep].title}</div>
        <div class="cards" id="cards"></div>
    `;

    setTimeout(() => {
        renderCards(ep);
    }, 900);
}

/* ---------------- RENDER DOSSIER CARDS ---------------- */
function renderCards(ep){
    const container = document.getElementById("cards");

    episodes[ep].cards.forEach((c, i) => {
        setTimeout(() => {
            const div = document.createElement("div");
            div.className = "file-card";
            div.tabIndex = 0;
            div.innerHTML = `
                <h2>${c.title}</h2>
                <h4>${c.type}</h4>
                <pre>${c.content}</pre>
            `;
            div.addEventListener("click", () => div.classList.toggle("expanded"));
            div.addEventListener("keydown", (e) => {
                if(e.key === "Enter" || e.key === " "){ e.preventDefault(); div.classList.toggle("expanded"); }
            });
            container.appendChild(div);
            requestAnimationFrame(() => div.classList.add("in"));

            if(i === episodes[ep].cards.length - 1){
                setTimeout(() => appendContinue(ep), 500);
            }
        }, i * 280);
    });
}

function appendContinue(ep){
    const row = document.createElement("div");
    row.className = "action-row";
    row.innerHTML = `<button class="btn-ghost" id="continueChain">Continue &rarr;</button>`;
    document.getElementById("cards").after(row);

    document.getElementById("continueChain").addEventListener("click", () => {
        if(ep === "1"){
            startProgress(() => { viewed[1] = true; updateMenuStatus(); backToMenu(); });
        } else if(ep === "2"){
            horrorScene(() => ratCult(() => { viewed[2] = true; updateMenuStatus(); backToMenu(); }));
        } else if(ep === "3"){
            finalEnvelope();
        }
    });
}

/* ---------------- CONVERSION PROGRESS (Episode 1) ---------------- */
let progress = 0;
function startProgress(callback){
    view.innerHTML = `
        ${backButtonHTML()}
        <div class="progress-wrap">
            <h1>Anime Conversion Progress</h1>
            <div class="bar"><div id="barFill"></div></div>
            <p id="progressText">0%</p>
        </div>
    `;

    const bar = document.getElementById("barFill");
    const text = document.getElementById("progressText");
    progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 12;
        if(progress >= 100) progress = 100;
        bar.style.width = progress + "%";
        text.textContent = Math.floor(progress) + "%";

        if(progress === 100){
            clearInterval(interval);
            setTimeout(callback, 900);
        }
    }, 200);
}

/* ---------------- HORROR BEAT (Episode 2) ---------------- */
function horrorScene(callback){
    view.innerHTML = `
        ${backButtonHTML()}
        <div class="horror-block">
            <h1>1:03 AM</h1>
            <p>HORROR GAME SESSION DETECTED</p>
            <p class="warning">connection unstable...</p>
        </div>
    `;

    let flicker = 0;
    const glitch = setInterval(() => {
        glitchOverlay.classList.toggle("on");
        flicker++;
        if(flicker > 10){
            clearInterval(glitch);
            glitchOverlay.classList.remove("on");
            setTimeout(callback, 800);
        }
    }, 150);
}

/* ---------------- RAT CULT DASHBOARD (Episode 2) ---------------- */
function ratCult(callback){
    view.innerHTML = `
        ${backButtonHTML()}
        <div class="dashboard">
            <h1>Rat Cult Live Feed</h1>
            <div class="stat">Members: 17 (confirmed)</div>
            <div class="stat">Recruitment Status: ACTIVE</div>
            <div class="stat">Leader: Ananya 👑</div>
            <div class="stat warning">Risk Level: QUESTIONABLE</div>
            <div class="action-row">
                <button class="btn-ghost" id="continueBtn">Continue &rarr;</button>
            </div>
        </div>
    `;
    document.getElementById("continueBtn").addEventListener("click", callback);
}

/* ---------------- FINAL ENVELOPE (Episode 3) ---------------- */
function finalEnvelope(){
    view.innerHTML = `
        ${backButtonHTML()}
        <div class="envelope-screen">
            <div class="envelope" onclick="openLetter()">💌</div>
            <p>click to open</p>
        </div>
    `;
}

function openLetter(){
    view.innerHTML = `
        <div class="letter">
            <pre id="typedText"></pre>
        </div>
    `;

    const text = `Hii ananya, firstly Happy Birthday, ik this is gonna sound cringe or whatever, ik youre not gonna think it is and i dont either but like idk uhh anyway, firstly, i just want to say right now youre one of the best parts of my life, it just feels really nice to always have someone to talk to and just know you can be yourself around (online but like still), and i am so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so so grateful for you, i love all our talks late at night usually the best part of my day comes at night somehow, uhh that was me tryna be funny and failing, erm anyway, i still don't understand till this day why you thought i was cool, and why you're "scared" of me irl, i also find it so like destined to be friends like what are the chances of those events happening, you not knowing how to remove people of your story, close friends, and then being in india at the same time, its actually crazy. I'm also super proud of you for everything you've been through in life and how well you've done after it, and I'm so proud that you've grown so much and just seeing your progress in real time honestly makes me so happy. Ugh there i go again lecturing on some nonsense, erm, but yeah iv ran out of stuff to say but i just can't say how grateful I am for you and how much you've healed me over these couple of months, i know i can be difficult sometimes but im glad you can deal with me. I'll never get over your yapping and how much i love it. ik u always say I should talk more but listening to you is MUCH more enjoyable, Anyway i think iv yapped again.

Happy birthday to you againnnnn, there's going to be many more amazing ones to come"

From Prabhav (Da Real GOAT)

thank you again, please don't cry reading this :)"`;

    let i = 0;
    const el = document.getElementById("typedText");

    const type = setInterval(() => {
        el.textContent += text[i];
        i++;
        if(i >= text.length){
            clearInterval(type);
            const btn = document.createElement('button');
            btn.className = 'btn-ghost';
            btn.style.marginTop = '30px';
            btn.textContent = 'continue →';
            btn.onclick = celebration;
            document.querySelector('.letter').appendChild(btn);
        }
    }, 15);
}

/* ---------------- CELEBRATION ---------------- */
function celebration(){
    petalBurst(30);
    view.innerHTML = `
        <div class="ending">
            <h1>ACHIEVEMENT UNLOCKED</h1>
            <h2>Best Friend</h2>
            <div class="confetti">🌸 ✨ 🌸 ✨ 🌸</div>
            <p class="vol-end">VOL.17 — END</p>
            <div class="action-row">
                <button class="btn-ghost" onclick="vol18()">VOL.18</button>
            </div>
        </div>
    `;
}

function vol18(){
    viewed[3] = true;
    view.innerHTML = `
        <div class="vol18">
            <h1>VOL.18</h1>
            <p>COMING SOON...</p>
        </div>
    `;
}
