(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const q = (selector, context = document) => context.querySelector(selector);
  const qa = (selector, context = document) => [...context.querySelectorAll(selector)];

  addEventListener('load', () => setTimeout(() => q('.loader')?.classList.add('is-hidden'), 450));

  const menu = q('.menu-panel');
  const menuButton = q('.menu-toggle');
  const setMenu = open => {
    menu?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-hidden', String(!open));
    menuButton?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  qa('.menu-panel a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  if (fine) {
    const cursor = q('.cursor');
    addEventListener('pointermove', event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    qa('a,button,[data-cursor]').forEach(element => {
      element.addEventListener('pointerenter', () => {
        cursor.classList.add('is-active');
        q('span', cursor).textContent = element.dataset.cursor || 'OPEN';
      });
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
    qa('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        gsap.to(element, { x:(event.clientX-rect.left-rect.width/2)*.14, y:(event.clientY-rect.top-rect.height/2)*.14, duration:.35 });
      });
      element.addEventListener('pointerleave', () => gsap.to(element, { x:0, y:0, duration:.55, ease:'power3.out' }));
    });
    const visual = q('.hero-visual');
    visual?.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to('.body-core', { rotateY:x*9, rotateX:-y*7, x:x*15, y:y*10, duration:.75, ease:'power3.out' });
      gsap.to('.care-card--one', { x:x*-22, y:y*-16, duration:.8 });
      gsap.to('.care-card--two', { x:x*20, y:y*18, duration:.8 });
      gsap.to('.care-card--three', { x:x*-16, y:y*14, duration:.8 });
    });
    visual?.addEventListener('pointerleave', () => gsap.to('.body-core,.care-card', { rotateX:0, rotateY:0, x:0, y:0, duration:.9, ease:'power3.out' }));
  }

  const routes = [
    {kicker:'ROUTE 01',title:'Primary care video consultation',copy:'A clinician reviews onset, severity and associated symptoms, then decides whether you need testing or a specialist.',first:'20 min video visit',next:'Neurology or diagnostics',prep:'Symptoms timeline'},
    {kicker:'ROUTE 02',title:'Urgent clinical assessment',copy:'A focused review checks severity, red flags and whether immediate in-person evaluation is the safest next step.',first:'Priority video triage',next:'Cardiology or urgent care',prep:'Current symptoms and medication'},
    {kicker:'ROUTE 03',title:'Digestive health consultation',copy:'A clinician organizes timing, triggers and associated symptoms before selecting useful testing or specialist review.',first:'30 min clinical intake',next:'Testing or gastroenterology',prep:'Food and symptom notes'},
    {kicker:'ROUTE 04',title:'Sleep and recovery review',copy:'The consultation looks at sleep pattern, energy, stress and physical contributors before building a practical plan.',first:'Wellbeing consultation',next:'Labs or sleep specialist',prep:'Seven-day sleep pattern'}
  ];

  qa('.symptom-button').forEach((button, index) => {
    const activate = () => {
      qa('.symptom-button').forEach((item, itemIndex) => {
        item.classList.toggle('is-active', itemIndex === index);
        item.setAttribute('aria-selected', String(itemIndex === index));
      });
      const route = routes[index];
      q('.route-kicker').textContent = route.kicker;
      q('.route-title').textContent = route.title;
      q('.route-copy').textContent = route.copy;
      q('.route-first').textContent = route.first;
      q('.route-next').textContent = route.next;
      q('.route-prep').textContent = route.prep;
      if (window.gsap) {
        gsap.fromTo('.route-title,.route-copy,.route-panel dl,.route-cta',{y:16,opacity:0},{y:0,opacity:1,duration:.5,stagger:.06,ease:'power3.out'});
        gsap.fromTo('.route-path span',{scaleX:0},{scaleX:1,duration:.75,ease:'power2.out'});
      }
    };
    button.addEventListener('click', activate);
    button.addEventListener('mouseenter', () => fine && activate());
  });

  const doctors = [
    {number:'01 / 04',name:'Dr. Mira Chen',role:'Internal medicine · Care coordination',bio:'Mira turns complex symptom histories into clear first decisions and coordinated diagnostic plans.',focus:'Complex symptoms',languages:'English · Mandarin',hue:'160deg,#beddd5,#9dc7bd',skin:'#96766c',hair:'#243b38'},
    {number:'02 / 04',name:'Dr. Jonas Reed',role:'Cardiology · Preventive care',bio:'Jonas connects symptoms, monitoring and long-term risk into a focused cardiovascular plan.',focus:'Heart rhythm · Prevention',languages:'English · German',hue:'160deg,#c7d7e8,#96b7d6',skin:'#b6866e',hair:'#5a453d'},
    {number:'03 / 04',name:'Dr. Leila Noor',role:'Neurology · Headache medicine',bio:'Leila focuses on headaches, dizziness and neurological symptoms with careful pattern recognition.',focus:'Headache · Dizziness',languages:'English · Arabic',hue:'160deg,#d8d0ea,#b8a9d7',skin:'#9b725f',hair:'#241f25'},
    {number:'04 / 04',name:'Dr. Emil Novak',role:'Gastroenterology · Digestive health',bio:'Emil builds precise diagnostic routes for digestive symptoms without unnecessary fragmentation.',focus:'Digestive disorders',languages:'English · Polish',hue:'160deg,#e7d6c8,#cfb59f',skin:'#c49276',hair:'#4c3c34'}
  ];

  qa('.doctor-button').forEach((button, index) => {
    button.addEventListener('click', () => {
      qa('.doctor-button').forEach((item, itemIndex) => {
        item.classList.toggle('is-active', itemIndex === index);
        item.setAttribute('aria-selected', String(itemIndex === index));
      });
      const doctor = doctors[index];
      q('.doctor-number').textContent = doctor.number;
      q('.doctor-name').textContent = doctor.name;
      q('.doctor-role').textContent = doctor.role;
      q('.doctor-bio').textContent = doctor.bio;
      q('.doctor-focus').textContent = doctor.focus;
      q('.doctor-languages').textContent = doctor.languages;
      q('.doctor-portrait').style.background = `linear-gradient(${doctor.hue})`;
      q('.portrait-head').style.background = doctor.skin;
      q('.portrait-head').style.setProperty('--hair', doctor.hair);
      if (window.gsap) {
        gsap.fromTo('.doctor-info>*',{y:14,opacity:0},{y:0,opacity:1,duration:.45,stagger:.045});
        gsap.fromTo('.portrait-person',{x:22,opacity:.45},{x:0,opacity:1,duration:.65,ease:'power3.out'});
      }
    });
  });

  q('.contact-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `ORBITA consultation request\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nFormat: ${data.get('format')}\nConcern: ${data.get('message') || '—'}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    const button = q('.submit-button', event.currentTarget);
    button.innerHTML = '<span>Request copied</span><b>✓</b>';
    q('.form-status').textContent = 'The request summary has been copied for secure handoff.';
  });

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({duration:1.15,smoothWheel:true});
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    gsap.to('.page-progress span',{scaleY:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
    gsap.from('.hero-copy--top,.hero-title__line,.hero-visual,.hero-bottom',{y:55,opacity:0,duration:1.15,stagger:.12,delay:.2,ease:'power4.out'});
    gsap.to('.hero-visual',{yPercent:12,scale:1.06,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-title',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.from('.manifest h2,.manifest-copy',{y:70,opacity:0,stagger:.15,scrollTrigger:{trigger:'.manifest',start:'top 68%'}});
    gsap.to('.manifest-rule span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.manifest-rule',start:'top 85%',end:'top 35%',scrub:true}});
    gsap.from('.navigator-head>*',{y:50,opacity:0,stagger:.1,scrollTrigger:{trigger:'.navigator-head',start:'top 75%'}});
    gsap.from('.route-panel',{clipPath:'inset(8% 8% 8% 8%)',scrollTrigger:{trigger:'.route-panel',start:'top 80%',end:'top 25%',scrub:true}});
    gsap.from('.symptom-button',{xPercent:-8,opacity:0,stagger:.1,scrollTrigger:{trigger:'.symptom-list',start:'top 75%'}});
    gsap.to('.journey-orbit',{rotate:90,ease:'none',scrollTrigger:{trigger:'.journey',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.from('.journey-steps article',{xPercent:10,opacity:0,stagger:.1,scrollTrigger:{trigger:'.journey-steps',start:'top 75%'}});
    gsap.from('.service-card',{y:80,opacity:0,stagger:.12,scrollTrigger:{trigger:'.service-grid',start:'top 75%'}});
    gsap.from('.specialist-stage',{y:70,opacity:0,scrollTrigger:{trigger:'.specialist-stage',start:'top 75%'}});
    qa('[data-count]').forEach(element => {
      const target = Number(element.dataset.count);
      const state = {value:0};
      gsap.to(state,{value:target,duration:1.7,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 85%',once:true},onUpdate:()=>{element.textContent=Math.round(state.value)}});
    });
    gsap.from('.contact-form label,.submit-button',{y:32,opacity:0,stagger:.08,scrollTrigger:{trigger:'.contact-form',start:'top 75%'}});
  }
})();
