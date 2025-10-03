
/* ========================
   Comic Space Theme JS
   ======================== */
(function(){
  const EMAIL = "michaelcebralclase@gmail.com";
  const THEME_KEY = "comic-theme";
  const DEFAULT_THEME = "dark";

  // Current year
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const root = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY);
  root.setAttribute("data-theme", saved || DEFAULT_THEME);
  const toggle = document.getElementById("themeToggle");
  if(toggle){
    toggle.addEventListener("click", ()=>{
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      toggle.classList.add("active");
      setTimeout(()=>toggle.classList.remove("active"), 250);
    });
  }

  // Canvas starfield
  const canvas = document.getElementById("stars");
  if(canvas){
    const ctx = canvas.getContext("2d");
    let w, h, stars;
    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(280, Math.floor(w*h/7000));
      stars = Array.from({length:n}, ()=>({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.2+0.2, s:Math.random()*0.8+0.2}));
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const st of stars){
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.5+Math.sin(Date.now()/500*st.s)/2})`;
        ctx.fill();
        st.x += 0.02; if(st.x > w) st.x = 0;
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    resize(); draw();
  }

  // AOS
  if(window.AOS) AOS.init({ once:true, duration:700, easing:"ease-out-back" });

  // Skill bars
  const bars = document.querySelectorAll(".skills .bar");
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const level = e.target.getAttribute("data-level") || "60";
          e.target.style.setProperty("width", level + "%");
          e.target.classList.add("active");
          io.unobserve(e.target);
        }
      });
    }, { threshold: .4 });
    bars.forEach(b=> io.observe(b));
  }

  // Project cards expand
  document.querySelectorAll(".project-card").forEach(card=>{
    card.addEventListener("click", ()=> card.classList.toggle("expanded"));
    card.addEventListener("keypress", (e)=>{ if(e.key==="Enter") card.classList.toggle("expanded"); });
  });

  // Contact helpers
  const emailSpan = document.getElementById("email");
  if(emailSpan) emailSpan.textContent = EMAIL;
  const mailLink = document.getElementById("mailLink");
  if(mailLink) mailLink.href = "mailto:" + EMAIL;
  const copyBtn = document.getElementById("copyEmailBtn");
  if(copyBtn){
    copyBtn.addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText(EMAIL);
        const prev = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied';
        copyBtn.disabled = true;
        setTimeout(()=>{ copyBtn.innerHTML = prev; copyBtn.disabled = false; }, 1200);
      }catch(e){}
    });
  }
  const form = document.getElementById("contactForm");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const subj = document.getElementById("subject").value.trim();
      const msg = document.getElementById("message").value.trim();
      const subject = encodeURIComponent("[Site] " + subj);
      const body = encodeURIComponent("From: " + name + "\n\n" + msg);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // CV check
  (async function checkCV(){
    const btn = document.getElementById("cvBtn");
    const note = document.getElementById("cvNote");
    if(!btn || !note) return;
    try{
      const res = await fetch("cv.pdf", { method: "HEAD", cache: "no-store" });
      if(res.ok){ btn.classList.remove("d-none"); note.classList.add("d-none"); }
    }catch(e){}
  })();

  // Page transitions: intercept same-origin links
  function enablePageTransitions(){
    document.querySelectorAll('a[href$=".html"]').forEach(a=>{
      const href = a.getAttribute("href");
      a.addEventListener("click", (e)=>{
        if(href && !href.startsWith("http")){
          e.preventDefault();
          document.body.classList.add("page-exit");
          setTimeout(()=> window.location.href = href, 180);
        }
      });
    });
    // Enter animation
    document.body.classList.add("page-enter");
    setTimeout(()=> document.body.classList.add("page-enter-active"), 20);
  }
  enablePageTransitions();

  // Easter egg: shooting star occasionally
  function shootingStar(){
    const star = document.createElement("div");
    star.className = "shooting-star";
    document.body.appendChild(star);
    const startX = -50, startY = 20 + Math.random()*40;
    const endX = window.innerWidth + 100, endY = startY + 200;
    const dur = 1200 + Math.random()*600;
    star.animate([
      { transform:`translate(${startX}px, ${startY}px)`, opacity:1 },
      { transform:`translate(${endX}px, ${endY}px)`, opacity:0 }
    ], { duration: dur, easing: "ease-out" });
    setTimeout(()=> star.remove(), dur);
  }
  setInterval(()=>{ if(Math.random() < 0.07) shootingStar(); }, 4000);
})();
