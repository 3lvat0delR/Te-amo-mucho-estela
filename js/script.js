(function(){
  const stack = document.getElementById('stack');
  const cards = Array.from(stack.querySelectorAll('.card'));
  const prevBtn = document.querySelector('.nav.prev');
  const nextBtn = document.querySelector('.nav.next');
  const dots = Array.from(document.querySelectorAll('.dot'));

  let current = 0;

  function updateClasses(){
    cards.forEach((card,i)=>{
      card.classList.remove('is-current','is-next','is-prev','is-hidden');
      const diff = i - current;

      if (diff === 0){
        card.classList.add('is-current');
      } else if (diff === 1 || (current === cards.length-1 && i === 0)){
        // siguiente (con wrap)
        card.classList.add('is-next');
      } else if (diff === -1 || (current === 0 && i === cards.length-1)){
        // anterior (con wrap)
        card.classList.add('is-prev');
      } else {
        card.classList.add('is-hidden');
      }
    });

    dots.forEach((d,i)=>{
      d.classList.toggle('active', i === current);
    });
  }

  function goNext(){
    current = (current + 1) % cards.length;
    updateClasses();
  }
  function goPrev(){
    current = (current - 1 + cards.length) % cards.length;
    updateClasses();
  }
  function goTo(index){
    current = Math.max(0, Math.min(cards.length-1, index));
    updateClasses();
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  dots.forEach(d=>{
    d.addEventListener('click', ()=> goTo(parseInt(d.dataset.goto,10)));
  });

  // Play buttons: cargar audio bajo demanda y revelar contenido
  cards.forEach(card=>{
    const playBtn = card.querySelector('.play');
    const audioEl = card.querySelector('audio');
    const reveal = card.querySelector('.reveal');
    let loaded = false;

    playBtn.addEventListener('click', ()=>{
      const src = playBtn.getAttribute('data-audio');
      if (!loaded){
        audioEl.src = src;
        loaded = true;
      }
      // Toggle: play/pause
      if (audioEl.paused){
        audioEl.play().catch(()=>{ /* silencioso */ });
        playBtn.textContent = 'Pause';
        reveal.classList.add('active');
      } else {
        audioEl.pause();
        playBtn.textContent = 'Play';
        // opcional: mantener texto visible, si quieres ocultarlo:
        // reveal.classList.remove('active');
      }
    });

    // detener cuando la pista termina
    audioEl.addEventListener('ended', ()=>{
      playBtn.textContent = 'Play';
      // reveal.classList.remove('active'); // si prefieres ocultar al terminar
    });
  });

  // Swipe en móviles
  let startX = 0, startY = 0, isSwiping = false;
  stack.addEventListener('pointerdown', (e)=>{
    isSwiping = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  stack.addEventListener('pointerup', (e)=>{
    if (!isSwiping) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)){
      if (dx < 0) goNext(); else goPrev();
    }
    isSwiping = false;
  });

  // Inicial
  updateClasses();
})();
