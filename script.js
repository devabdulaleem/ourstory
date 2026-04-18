/* =========================================
   SANNO — ROMANTIC WEBSITE SCRIPT
   GSAP + Three.js + Typed.js + Confetti
   ========================================= */

gsap.registerPlugin(ScrollTrigger);

// ==================== THREE.JS 3D FLOATING HEARTS ====================
const bgCanvas = document.getElementById('bg-canvas');
let scene, camera, renderer, heartParticles = [];

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5);
    heartShape.bezierCurveTo(-4, -1.5, -4, 1, -4, 1);
    heartShape.bezierCurveTo(-4, 3, -2, 4.5, 0, 6);
    heartShape.bezierCurveTo(2, 4.5, 4, 3, 4, 1);
    heartShape.bezierCurveTo(4, 1, 4, -1.5, 2, -1.5);
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0);

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1 };

    const colors = [0xe84393, 0xfd79a8, 0xfab1a0, 0xff6b6b, 0xf9ca24];

    for (let i = 0; i < 35; i++) {
        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: Math.random() * 0.15 + 0.05,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 30
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        const scale = Math.random() * 0.3 + 0.1;
        mesh.scale.set(scale, scale, scale);

        mesh.userData = {
            speedY: Math.random() * 0.01 + 0.003,
            speedRot: (Math.random() - 0.5) * 0.008,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.005 + 0.002,
        };

        scene.add(mesh);
        heartParticles.push(mesh);
    }

    animateThree();
}

function animateThree() {
    requestAnimationFrame(animateThree);

    heartParticles.forEach(h => {
        h.position.y += h.userData.speedY;
        h.rotation.z += h.userData.speedRot;
        h.rotation.x += h.userData.speedRot * 0.5;
        h.userData.wobble += h.userData.wobbleSpeed;
        h.position.x += Math.sin(h.userData.wobble) * 0.02;

        if (h.position.y > 35) {
            h.position.y = -35;
            h.position.x = (Math.random() - 0.5) * 60;
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThreeJS();

// ==================== INTRO STARS ====================
(function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            width:${size}px;height:${size}px;
            left:${Math.random()*100}%;top:${Math.random()*100}%;
            --dur:${Math.random()*3+1}s;
            animation-delay:${Math.random()*3}s;
        `;
        container.appendChild(star);
    }
})();

// ==================== ENVELOPE ====================
const envelope = document.getElementById('envelope');
const introSection = document.getElementById('intro');
const heroSection = document.getElementById('hero');

envelope.addEventListener('click', () => {
    envelope.classList.add('opened');

    setTimeout(() => {
        gsap.to(introSection, {
            opacity: 0,
            scale: 1.15,
            duration: 1.2,
            ease: 'power2.in',
            onComplete: () => {
                introSection.classList.add('hidden');
                heroSection.classList.remove('hidden');
                document.querySelectorAll('.section:not(#intro):not(#hero)').forEach(s => s.classList.remove('hidden'));
                startHeroAnimations();
                startPetals();
                initGSAPScrollAnimations();
                startNicknameCycle();
                startCountdown();
                startReunionCountdown();
                startNikahCounter();
            }
        });
    }, 1000);
});

// ==================== HERO ANIMATIONS ====================
function startHeroAnimations() {
    // Typed pre-text
    new Typed('#hero-pre', {
        strings: ['Har kahani khoobsurat hoti hai, magar...'],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            // Then type the big title
            setTimeout(() => {
                new Typed('#typed-hero', {
                    strings: ['Hamari Favourite Hai'],
                    typeSpeed: 60,
                    showCursor: true,
                    cursorChar: '|',
                });
            }, 500);
        }
    });

    // Animate hero name row
    gsap.from('.hero-name-row', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        delay: 4,
        ease: 'power3.out'
    });
}

// ==================== NICKNAME CYCLING ====================
const nicknames = ['Sanno', 'Lallu', 'Kaleji', 'Bacchu', 'Chulbuli', 'Sana'];
let nickIdx = 0;

function startNicknameCycle() {
    const el = document.getElementById('cyclingName');
    setInterval(() => {
        el.classList.add('fade-out');
        setTimeout(() => {
            nickIdx = (nickIdx + 1) % nicknames.length;
            el.textContent = nicknames[nickIdx];
            el.classList.remove('fade-out');
            el.classList.add('fade-in');
            setTimeout(() => el.classList.remove('fade-in'), 400);
        }, 300);
    }, 2200);
}

// ==================== ROSE PETALS ====================
function startPetals() {
    setInterval(() => {
        if (document.hidden) return;
        const petal = document.createElement('div');
        petal.className = 'petal';
        const w = Math.random() * 12 + 8;
        const h = Math.random() * 10 + 6;
        const hue = 340 + Math.random() * 20;
        petal.style.cssText = `
            left:${Math.random()*100}vw;
            width:${w}px;height:${h}px;
            background:radial-gradient(ellipse,hsl(${hue},80%,65%),rgba(232,67,147,.5));
            animation-duration:${Math.random()*5+7}s;
        `;
        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 13000);
    }, 900);
}

// ==================== SPARKLE CURSOR ====================
let lastSparkle = 0;
const sparkleChars = ['✦', '♥', '✧', '♡', '⋆', '·'];
document.addEventListener('mousemove', e => {
    if (Date.now() - lastSparkle < 70) return;
    lastSparkle = Date.now();
    const sp = document.createElement('div');
    sp.className = 'sparkle';
    sp.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    sp.style.cssText = `
        left:${e.clientX + (Math.random()-.5)*18}px;
        top:${e.clientY + (Math.random()-.5)*18}px;
        color:${['#fd79a8','#ffeaa7','#fab1a0','#e84393'][Math.floor(Math.random()*4)]};
        font-size:${Math.random()*10+8}px;
    `;
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 700);
});

// ==================== CLICK HEART BURST ====================
document.addEventListener('click', e => {
    if (e.target.closest('button') || e.target.closest('.envelope')) return;
    for (let i = 0; i < 8; i++) {
        const h = document.createElement('div');
        h.innerHTML = '♥';
        const angle = (Math.PI * 2 * i) / 8;
        const dist = Math.random() * 70 + 35;
        h.style.cssText = `
            position:fixed;left:${e.clientX}px;top:${e.clientY}px;
            font-size:${Math.random()*14+10}px;
            color:${['#fd79a8','#e84393','#fab1a0','#ff6b6b','#ffeaa7'][Math.floor(Math.random()*5)]};
            pointer-events:none;z-index:9999;
            transition:all .8s cubic-bezier(.25,.46,.45,.94);opacity:1;
        `;
        document.body.appendChild(h);
        requestAnimationFrame(() => {
            h.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist-25}px) scale(0)`;
            h.style.opacity = '0';
        });
        setTimeout(() => h.remove(), 800);
    }
});

// ==================== GSAP SCROLL ANIMATIONS ====================
function initGSAPScrollAnimations() {

    // Nicknames
    gsap.utils.toArray('.nick-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 50,
            scale: 0.5,
            rotation: (i % 2 === 0 ? -15 : 15),
            duration: 0.8,
            delay: i * 0.12,
            ease: 'back.out(1.7)'
        });
    });

    // Reason cards
    gsap.utils.toArray('.reason-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 60,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Story items
    gsap.utils.toArray('.story-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 80%' },
            opacity: 0,
            x: -60,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });

    // Baby section
    gsap.from('.baby-title', {
        scrollTrigger: { trigger: '#baby', start: 'top 70%' },
        opacity: 0,
        y: 40,
        scale: 0.8,
        duration: 1,
        ease: 'elastic.out(1,.5)',
        onComplete: () => {
            // Confetti burst when baby section appears
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#f8b4d9', '#ffeaa7', '#fd79a8', '#fab1a0', '#ff6b6b']
                });
            }
        }
    });

    gsap.from('.countdown', {
        scrollTrigger: { trigger: '.countdown', start: 'top 80%' },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.baby-letter', {
        scrollTrigger: { trigger: '.baby-letter', start: 'top 80%' },
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });

    // Reunion section
    gsap.from('.reunion-content', {
        scrollTrigger: { trigger: '#reunion', start: 'top 75%' },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Photo section
    gsap.from('.photo-frame-wrap', {
        scrollTrigger: { trigger: '#our-photo', start: 'top 75%' },
        opacity: 0,
        scale: 0.8,
        rotation: -3,
        duration: 1.2,
        ease: 'elastic.out(1,.6)'
    });

    // Quran cards
    gsap.utils.toArray('.quran-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 80%' },
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.9,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Nikah counter
    gsap.from('.nikah-wrap', {
        scrollTrigger: { trigger: '#nikah-counter', start: 'top 75%' },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
    });

    // Fun facts
    gsap.utils.toArray('.fact-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0,
            y: 40,
            scale: 0.9,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'back.out(1.5)'
        });
    });

    // Promise rows
    gsap.utils.toArray('.promise-row').forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: { trigger: row, start: 'top 85%' },
            opacity: 0,
            x: -50,
            duration: 0.6,
            delay: i * 0.12,
            ease: 'power3.out'
        });
    });

    // Shayari lines
    gsap.utils.toArray('.shayari-lines p').forEach((line, i) => {
        gsap.from(line, {
            scrollTrigger: { trigger: line, start: 'top 85%' },
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power2.out'
        });
    });

    // Finale
    ScrollTrigger.create({
        trigger: '#finale',
        start: 'top 60%',
        onEnter: () => {
            // Draw infinity
            gsap.to('.infinity-path', {
                strokeDashoffset: 0,
                duration: 2.5,
                ease: 'power2.inOut'
            });

            // Title words
            gsap.from('.finale-title', {
                opacity: 0, y: 30, duration: 1, delay: 0.5, ease: 'power3.out'
            });

            gsap.from('.finale-sub', {
                opacity: 0, y: 20, duration: 0.8, delay: 1.2, ease: 'power3.out'
            });

            gsap.from('.finale-family', {
                opacity: 0, y: 20, duration: 0.8, delay: 1.5, ease: 'power3.out'
            });

            gsap.from('.finale-beat', {
                opacity: 0, scale: 0, duration: 0.6, delay: 2, ease: 'back.out(2)'
            });

            gsap.from('.replay-btn', {
                opacity: 0, y: 20, duration: 0.6, delay: 2.5, ease: 'power3.out'
            });

            // Grand confetti
            setTimeout(() => {
                if (typeof confetti !== 'function') return;
                const end = Date.now() + 3000;
                const colors = ['#fd79a8', '#ffeaa7', '#fab1a0', '#e84393', '#f9ca24', '#ff6b6b'];
                (function frame() {
                    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
                    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
                    if (Date.now() < end) requestAnimationFrame(frame);
                })();
            }, 2000);
        },
        once: true
    });

    // Parallax on hero
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 150,
        opacity: 0
    });
}

// ==================== COUNTDOWN TIMER ====================
function startCountdown() {
    const target = new Date('2026-08-15T00:00:00').getTime();

    function update() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '🎉';
            document.getElementById('cd-hours').textContent = '';
            document.getElementById('cd-mins').textContent = '';
            document.getElementById('cd-secs').textContent = '';
            document.querySelector('.baby-sub').textContent = 'Aanya Sidrah aa gayi! 🎉💕';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-mins');
        const sEl = document.getElementById('cd-secs');

        // Animate number change
        if (dEl.textContent !== String(days)) animateNum(dEl, days);
        if (hEl.textContent !== String(hours).padStart(2,'0')) animateNum(hEl, String(hours).padStart(2,'0'));
        if (mEl.textContent !== String(mins).padStart(2,'0')) animateNum(mEl, String(mins).padStart(2,'0'));
        if (sEl.textContent !== String(secs).padStart(2,'0')) animateNum(sEl, String(secs).padStart(2,'0'));
    }

    function animateNum(el, val) {
        gsap.to(el, {
            scale: 1.15,
            duration: 0.15,
            ease: 'power2.out',
            onComplete: () => {
                el.textContent = val;
                gsap.to(el, { scale: 1, duration: 0.15, ease: 'power2.in' });
            }
        });
    }

    update();
    setInterval(update, 1000);
}

// ==================== REUNION COUNTDOWN (20 May 2026) ====================
function startReunionCountdown() {
    const target = new Date('2026-05-20T00:00:00').getTime();

    function update() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('re-days').textContent = '🎉';
            document.getElementById('re-hours').textContent = '';
            document.getElementById('re-mins').textContent = '';
            document.getElementById('re-secs').textContent = '';
            const sub = document.querySelector('.reunion-sub');
            if (sub) sub.textContent = 'Aa gaya tumhare paas! 🎉💕';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const dEl = document.getElementById('re-days');
        const hEl = document.getElementById('re-hours');
        const mEl = document.getElementById('re-mins');
        const sEl = document.getElementById('re-secs');

        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = String(hours).padStart(2,'0');
        if (mEl) mEl.textContent = String(mins).padStart(2,'0');
        if (sEl) sEl.textContent = String(secs).padStart(2,'0');
    }

    update();
    setInterval(update, 1000);
}

// ==================== MUSIC (Muhammad Al Muqit Nasheed) ====================
const musicBtn = document.getElementById('music-btn');
const nasheedAudio = document.getElementById('nasheed-audio');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        nasheedAudio.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.textContent = '🎶';
        }).catch(() => {
            // Audio file not found — show hint
            musicBtn.textContent = '❌';
            setTimeout(() => { musicBtn.textContent = '🎵'; }, 2000);
        });
    } else {
        nasheedAudio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
    }
});

// ==================== NIKAH ANNIVERSARY COUNTER ====================
function startNikahCounter() {
    const nikahDate = new Date('2025-05-21');

    function update() {
        const now = new Date();
        let months = (now.getFullYear() - nikahDate.getFullYear()) * 12 + (now.getMonth() - nikahDate.getMonth());
        if (now.getDate() < nikahDate.getDate()) months--;

        const diffMs = now - nikahDate;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        const dEl = document.getElementById('nikah-days');
        const mEl = document.getElementById('nikah-months');
        if (dEl) dEl.textContent = days;
        if (mEl) mEl.textContent = months;
    }

    update();
    setInterval(update, 60000); // update every minute
}

// ==================== SMOOTH LOAD ====================
(function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .8s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
})();

// ==================== NO RIGHT CLICK ====================
document.addEventListener('contextmenu', e => e.preventDefault());

