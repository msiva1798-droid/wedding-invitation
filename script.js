const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const CONFIG_URL='wedding-config.json', LOCAL_CONFIG='weddingInviteConfigV1', VISITS_KEY='weddingInviteVisitCountV1', RSVP_KEY='weddingInviteLocalRsvpsV1';
let cfg, audioOn=false, taps=[], unlocked=false;
const defaults={bride:"Ananya",groom:"Rohan",date:"2026-12-11",venue:"The Grand Palace, Chennai",introLine:"Together with our families",brideParents:"Mr. & Mrs. Sharma",groomParents:"Mr. & Mrs. Rao",familyMessage:"With the love and blessings of our families, we invite you to join us as we celebrate a new chapter filled with love, laughter, and a lifetime of togetherness.",hashtag:"#AnanyaWedsRohan",whatsapp:"919876543210",musicUrl:"",accent:"#a77c43",closing:"We can't wait to celebrate with you.",teamEnabled:true,countdownEnabled:true,petalsEnabled:true,rsvpEnabled:true,envelopeEnabled:true,scratchEnabled:true,heartEnabled:true,dholEnabled:true,dholSoundUrl:"",events:[]};
const embeddedConfig={"bride":"Ananya","groom":"Rohan","date":"2026-12-11","venue":"The Grand Palace, Chennai","introLine":"Together with our families","brideParents":"Mr. & Mrs. Sharma","groomParents":"Mr. & Mrs. Rao","familyMessage":"With the love and blessings of our families, we invite you to join us as we celebrate a new chapter filled with love, laughter, and a lifetime of togetherness.","hashtag":"#AnanyaWedsRohan","whatsapp":"919876543210","musicUrl":"","accent":"#a77c43","closing":"We can't wait to celebrate with you.","teamEnabled":true,"countdownEnabled":true,"petalsEnabled":true,"events":[{"name":"Haldi","enabled":true,"date":"2026-12-08","start":"10:00","end":"12:00","venue":"The Garden Courtyard, Chennai","description":"A morning of sunshine, turmeric and happy beginnings.","dressCode":"Yellow & ivory","revealMethod":"scratch","dressCodeEnabled":true},{"name":"Mehndi","enabled":true,"date":"2026-12-09","start":"16:00","end":"19:00","venue":"The Garden Courtyard, Chennai","description":"Henna, music and memories with our favourite people.","dressCode":"Festive colours","revealMethod":"heart","dressCodeEnabled":true},{"name":"Sangeet","enabled":false,"date":"2026-12-10","start":"18:00","end":"22:00","venue":"The Grand Palace, Chennai","description":"An evening of music, dancing and celebration.","dressCode":"Festive formal","revealMethod":"dhol","dressCodeEnabled":true},{"name":"Wedding Ceremony","enabled":true,"date":"2026-12-11","start":"09:00","end":"11:30","venue":"The Grand Palace, Chennai","description":"Join us as we begin our forever.","dressCode":"Traditional attire","revealMethod":"dhol","dressCodeEnabled":true},{"name":"Reception","enabled":true,"date":"2026-12-11","start":"18:30","end":"21:30","venue":"The Grand Palace, Chennai","description":"Dinner, laughter and a celebration of love.","dressCode":"Formal","revealMethod":"heart","dressCodeEnabled":true}],"rsvpEnabled":true};
async function init(){try{const r=await fetch(CONFIG_URL,{cache:'no-store'});cfg={...defaults,...await r.json()}}catch(e){cfg={...defaults,...embeddedConfig}}try{const local=JSON.parse(localStorage.getItem(LOCAL_CONFIG)||'null');if(local){const publishedEvents=Array.isArray(cfg.events)?cfg.events:[];cfg={...cfg,...local};if(!Array.isArray(cfg.events)||cfg.events.length===0){cfg.events=publishedEvents;}}}catch(e){}if(!Array.isArray(cfg.events))cfg.events=[];applyConfig();trackVisit();setupUI();if(cfg.petalsEnabled)startPetals()}
function fmtDate(d,opts={day:'numeric',month:'long',year:'numeric'}){if(!d)return 'Date to be announced';const dt=new Date(d+'T12:00:00');return isNaN(dt)?d:dt.toLocaleDateString('en-IN',opts)}
function timeFmt(t){if(!t)return '';let [h,m]=t.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
function applyConfig(){document.documentElement.style.setProperty('--gold',cfg.accent||'#a77c43');const names=`${cfg.bride} & ${cfg.groom}`;$('#monogram').textContent=`${(cfg.bride||'A')[0]} & ${(cfg.groom||'G')[0]}`;$('#envelopeMonogram').textContent=`${(cfg.bride||'A')[0]} & ${(cfg.groom||'G')[0]}`;$('#envelopeNames').innerHTML=`${esc(cfg.bride)} <i>&</i> ${esc(cfg.groom)}`;$('#envelopeDate').textContent=fmtDate(cfg.date,{day:'numeric',month:'long',year:'numeric'}).toUpperCase();$('#brideHero').textContent=cfg.bride;$('#groomHero').textContent=cfg.groom;$('#introLine').textContent=cfg.introLine;$('#heroDate').textContent=fmtDate(cfg.date,{day:'numeric',month:'long',year:'numeric'}).toUpperCase().replaceAll(' ',' · ');$('#heroVenue').textContent=cfg.venue;$('#brideParents').textContent=cfg.brideParents;$('#groomParents').textContent=cfg.groomParents;$('#familyMessage').textContent=cfg.familyMessage;$('#closingNames').textContent=names;$('#footerNames').textContent=names;$('#hashtag').textContent=cfg.hashtag;$('.closing-copy').textContent=cfg.closing;$('#countdown').parentElement.classList.toggle('hidden',!cfg.countdownEnabled);$('.team-section').classList.toggle('hidden',!cfg.teamEnabled);$('#rsvp').classList.toggle('hidden',!cfg.rsvpEnabled);renderEvents();setupCountdown();$('#bgMusic').src=cfg.musicUrl||'';$('#musicBtn').classList.toggle('hidden',!cfg.musicUrl);
$('#envelopeIntro').classList.toggle('hidden',cfg.envelopeEnabled===false);
document.body.classList.toggle('envelope-locked',cfg.envelopeEnabled!==false&&!sessionStorage.getItem('weddingEnvelopeOpened'));
}
function renderEvents(){
const events=(cfg.events||[]).filter(e=>e.enabled);
$('#eventGrid').innerHTML=events.map((e,i)=>{
 const method=e.revealMethod||'scratch';
 const cardArt=method==='heart'?'♥':method==='dhol'?'🥁':'✧';
 const methodLabel=method==='heart'?'TRACE THE HEART':method==='dhol'?'TAP THE DHOL 5 TIMES':'RUB TO REVEAL';
 const dressVisible=(e.dressCodeEnabled===undefined?!!e.dressCode:e.dressCodeEnabled)&&!!e.dressCode;
 return `<article class="event-card event-row" data-event-index="${i}">
 <div class="event-info"><span class="event-date">${esc(fmtDate(e.date,{day:'numeric',month:'short',year:'numeric'}))} · ${esc(timeFmt(e.start))}${e.end?' – '+esc(timeFmt(e.end)):''}</span><h3>${esc(e.name)}</h3><p>${esc(e.description||'Join us for this special celebration.')}</p><p class="event-venue">${esc(e.venue||cfg.venue)}</p>${dressVisible?`<p class="event-dress-code">Dress code: ${esc(e.dressCode)}</p>`:''}<p><a target="_blank" rel="noopener" href="${mapUrl(e.venue||cfg.venue)}">GET DIRECTIONS ↗</a> <a href="${calendarUrl(e)}" target="_blank" rel="noopener">ADD TO CALENDAR ↗</a></p></div>
 <button type="button" class="event-scratch-trigger ${method==='heart'?'method-heart':''} ${method==='dhol'?'method-dhol':''}" data-scratch="${i}" aria-label="Open ${esc(e.name)} reveal"><span class="mini-card-art">${cardArt}</span><small>${methodLabel}</small></button>
 <div class="event-reveal-overlay hidden" data-reveal-overlay="${i}" role="dialog" aria-modal="true" aria-label="${esc(e.name)} reveal"><button type="button" class="reveal-close" data-close-reveal="${i}" aria-label="Close">×</button><div class="reveal-card ${method==='heart'?'heart-scratch':method==='dhol'?'dhol-scratch':'full-scratch'}" data-method="${method}"><div class="reveal-content"><span class="eyebrow">${esc(cfg.bride)} & ${esc(cfg.groom)}</span><h3>${esc(e.name)}</h3><p>${esc(fmtDate(e.date,{day:'numeric',month:'long',year:'numeric'}))} · ${esc(timeFmt(e.start))}${e.end?' – '+esc(timeFmt(e.end)):''}</p><p>${esc(e.description||'Join us for this special celebration.')}</p><p>${esc(e.venue||cfg.venue)}</p>${dressVisible?`<p>Dress code: ${esc(e.dressCode)}</p>`:''}<p><a target="_blank" rel="noopener" href="${mapUrl(e.venue||cfg.venue)}">GET DIRECTIONS ↗</a> <a href="${calendarUrl(e)}" target="_blank" rel="noopener">ADD TO CALENDAR ↗</a></p></div><button type="button" class="reveal-action ${method==='dhol'?'dhol-tap-target':''}" data-reveal-action="${i}">${method==='heart'?'TRACE THE HEART':method==='dhol'?'<span class="dhol-illustration" aria-hidden="true"><span class="dhol-stick dhol-stick-left"></span><span class="dhol-stick dhol-stick-right"></span><span class="dhol-shell"><span class="dhol-rim dhol-rim-left"></span><span class="dhol-rim dhol-rim-right"></span><span class="dhol-band"></span></span></span><span class="dhol-tap-label">TAP THE DHOL 5 TIMES</span>':'RUB OR SWIPE TO REVEAL'}</button><span class="reveal-progress" data-reveal-progress="${i}">${method==='dhol'?'0 / 5 taps':'Rub or swipe over the card'}</span></div></div>
 </article>`;
}).join('');
$('#rsvpEvents').innerHTML=events.map(e=>`<label><input type="checkbox" name="events" value="${esc(e.name)}"> ${esc(e.name)}</label>`).join('')||'<p class="form-note">No events are currently enabled.</p>';
$$('[data-scratch]').forEach(btn=>{
 const idx=Number(btn.dataset.scratch), overlay=$(`[data-reveal-overlay="${idx}"]`), panel=overlay.querySelector('.reveal-card'), action=overlay.querySelector('[data-reveal-action]'), progress=overlay.querySelector('[data-reveal-progress]');
 const event=events[idx], method=event.revealMethod||'scratch'; let taps=0, revealed=false, startX=0,startY=0,moved=0;
 const content=panel.querySelector('.reveal-content');
 const resetReveal=()=>{
   taps=0;revealed=false;scratching=false;moved=0;
   panel.classList.remove('is-revealed','heart-tracing','drum-hit');
   panel.style.removeProperty('--scratch-progress');
   panel.querySelectorAll('.reveal-content').forEach(node=>{
     node.classList.remove('is-revealed');
     node.style.removeProperty('filter');
     node.style.removeProperty('opacity');
     node.style.removeProperty('clip-path');
     node.style.removeProperty('-webkit-clip-path');
     node.style.removeProperty('visibility');
   });
   action.disabled=false;
   if(method==='dhol'){action.innerHTML='<span class="dhol-illustration" aria-hidden="true"><span class="dhol-stick dhol-stick-left"></span><span class="dhol-stick dhol-stick-right"></span><span class="dhol-shell"><span class="dhol-rim dhol-rim-left"></span><span class="dhol-rim dhol-rim-right"></span><span class="dhol-band"></span></span></span><span class="dhol-tap-label">TAP THE DHOL 5 TIMES</span>';}else{action.textContent=method==='heart'?'TRACE THE HEART':'RUB OR SWIPE TO REVEAL';}
   progress.textContent=method==='dhol'?'0 / 5 taps':'Rub or swipe over the card';
 };
 const open=()=>{resetReveal();overlay.classList.remove('hidden');document.body.classList.add('reveal-open');};
 const close=()=>{overlay.classList.add('hidden');document.body.classList.remove('reveal-open');resetReveal();};
 const reveal=()=>{
   revealed=true;
   panel.classList.add('is-revealed');
   if(content){
     content.classList.add('is-revealed');
     // Explicitly clear visual concealment, independent of CSS class/cache state.
     content.style.filter='none';
     content.style.opacity='1';
     content.style.clipPath='none';
     content.style.webkitClipPath='none';
     content.style.visibility='visible';
   }
   panel.style.setProperty('--scratch-progress','100%');
   progress.textContent='Revealed ✨';
   action.textContent='INVITATION REVEALED';
   action.disabled=true;
 };
 btn.addEventListener('click',open);
 overlay.querySelector('[data-close-reveal]').addEventListener('click',close);
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 if(method==='dhol'){
   action.addEventListener('click',()=>{
     if(revealed)return;
     taps=Math.min(5,taps+1);
     progress.textContent=`${taps} / 5 taps`;
     const tapLabel=action.querySelector('.dhol-tap-label');if(tapLabel)tapLabel.textContent=taps<5?`TAP THE DHOL (${taps}/5)`:'REVEALING…';
     panel.classList.add('drum-hit');
     setTimeout(()=>panel.classList.remove('drum-hit'),130);
     if(taps===5){
       // Reveal first so sound playback can never block the invitation.
       reveal();
       if(cfg.dholSoundUrl){
         try { const a=new Audio(cfg.dholSoundUrl); const result=a.play(); if(result&&result.catch)result.catch(()=>{}); } catch(_) {}
       } else {
         try {
           const AudioContextClass=window.AudioContext||window.webkitAudioContext;
           if(AudioContextClass){
             const context=new AudioContextClass();
             [0,130,260,390,520].forEach((delay,n)=>{
               const oscillator=context.createOscillator(),gain=context.createGain(),when=context.currentTime+delay/1000;
               oscillator.type='sine'; oscillator.frequency.setValueAtTime(n%2?95:70,when);
               gain.gain.setValueAtTime(0.0001,when); gain.gain.exponentialRampToValueAtTime(0.25,when+0.01); gain.gain.exponentialRampToValueAtTime(0.0001,when+0.13);
               oscillator.connect(gain); gain.connect(context.destination); oscillator.start(when); oscillator.stop(when+0.14);
             });
             setTimeout(()=>{try{context.close()}catch(_){}},1100);
           }
         } catch(_) {}
       }
     }
   });
 }else{
   let scratching=false;
   const scratchStart=e=>{if(revealed)return;scratching=true;startX=e.clientX;startY=e.clientY;moved=0;try{panel.setPointerCapture(e.pointerId)}catch(_){}};
   const scratchMove=e=>{if(!scratching||revealed)return;moved+=Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY);startX=e.clientX;startY=e.clientY;panel.style.setProperty('--scratch-progress',Math.min(100,Math.round(moved/4))+'%');if(moved>(method==='heart'?120:160))reveal();};
   const scratchEnd=()=>{scratching=false};
   panel.addEventListener('pointerdown',scratchStart);panel.addEventListener('pointermove',scratchMove);panel.addEventListener('pointerup',scratchEnd);panel.addEventListener('pointercancel',scratchEnd);
   action.addEventListener('click',()=>{if(method==='heart'){panel.classList.add('heart-tracing');setTimeout(reveal,450)}else reveal()});
 }
});
}

function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mapUrl(v){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v||cfg.venue||'Wedding venue')}
function calendarUrl(e){let start=(e.date||cfg.date||'2026-01-01').replaceAll('-','')+'T'+(e.start||'10:00').replace(':','')+'00';let end=(e.date||cfg.date||'2026-01-01').replaceAll('-','')+'T'+(e.end||e.start||'11:00').replace(':','')+'00';let title=encodeURIComponent(e.name+' — '+cfg.bride+' & '+cfg.groom),details=encodeURIComponent(e.description||'Wedding celebration');return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent(e.venue||cfg.venue)}`}
function setupCountdown(){clearInterval(window.countdownTimer);const tick=()=>{let diff=new Date((cfg.date||'2026-12-11')+'T09:00:00').getTime()-Date.now();if(diff<0)diff=0;let vals=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];$('#countdown').innerHTML=vals.map((v,i)=>`<div><b>${String(v).padStart(2,'0')}</b><span>${['Days','Hours','Minutes','Seconds'][i]}</span></div>`).join('')};tick();window.countdownTimer=setInterval(tick,1000)}
function trackVisit(){// Approximate browser count only; not a cross-device or server-wide count.
 if(!localStorage.getItem('weddingInviteVisitedV1')){localStorage.setItem('weddingInviteVisitedV1','1');localStorage.setItem(VISITS_KEY,String(Number(localStorage.getItem(VISITS_KEY)||0)+1))}
}
function setupUI(){
$('#openEnvelope').addEventListener('click',()=>{const intro=$('#envelopeIntro');sessionStorage.setItem('weddingEnvelopeOpened','1');document.body.classList.remove('envelope-locked');intro.classList.add('dismissed');setTimeout(()=>intro.classList.add('hidden'),850);});
$('#musicBtn').addEventListener('click',async()=>{const a=$('#bgMusic');if(!a.src)return;if(audioOn){a.pause();audioOn=false;$('#musicBtn').innerHTML='♫ <span>Play music</span>'}else{try{await a.play();audioOn=true;$('#musicBtn').innerHTML='♫ <span>Pause music</span>'}catch(e){$('#rsvpStatus').textContent='Music could not play. Check the music URL.'}}});
$$('.team-card').forEach(b=>b.addEventListener('click',()=>{$$('.team-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#teamMessage').textContent=`You're on Team ${b.dataset.team}! Let the friendly rivalry begin.`}));
const attendanceSelect=$('#rsvpForm select[name="attendance"]');
const guestCount=$('#rsvpForm input[name="guests"]');
function updateGuestCount(){
  const declining=attendanceSelect.value==='Regretfully declines';
  guestCount.min=declining?'0':'1';
  if(declining){guestCount.value='0';guestCount.setCustomValidity('');}
  else if(attendanceSelect.value==='Joyfully accepts'){
    if(guestCount.value===''||Number(guestCount.value)<1)guestCount.value='1';
    guestCount.setCustomValidity('');
  } else {
    guestCount.value='1';
    guestCount.setCustomValidity('');
  }
}
attendanceSelect.addEventListener('change',updateGuestCount);
guestCount.addEventListener('input',()=>{
  const count=Number(guestCount.value);
  const declining=attendanceSelect.value==='Regretfully declines';
  if(guestCount.value===''||!Number.isFinite(count)||count<0||count>20||!Number.isInteger(count)||(!declining&&attendanceSelect.value==='Joyfully accepts'&&count<1)||(declining&&count!==0)){
    guestCount.setCustomValidity(declining?'If you decline, the number of guests must be 0.':'If you accept, enter a whole number from 1 to 20.');
  } else guestCount.setCustomValidity('');
});
$('#rsvpForm').addEventListener('submit',e=>{e.preventDefault();
const attendance=attendanceSelect.value, count=Number(guestCount.value);
if(!attendance){attendanceSelect.reportValidity();return;}
if((attendance==='Regretfully declines'&&count!==0)||(attendance==='Joyfully accepts'&&(!Number.isInteger(count)||count<1||count>20))){guestCount.setCustomValidity(attendance==='Regretfully declines'?'If you decline, the number of guests must be 0.':'If you accept, enter a whole number from 1 to 20.');guestCount.reportValidity();return;}
guestCount.setCustomValidity('');const f=new FormData(e.target);const record={name:f.get('name'),attendance:f.get('attendance'),guests:f.get('guests'),events:f.getAll('events'),note:f.get('note'),submittedAt:new Date().toISOString()};let list=JSON.parse(localStorage.getItem(RSVP_KEY)||'[]');list.push(record);localStorage.setItem(RSVP_KEY,JSON.stringify(list));const msg=`Wedding RSVP — ${cfg.bride} & ${cfg.groom}%0AName: ${encodeURIComponent(record.name)}%0AResponse: ${encodeURIComponent(record.attendance)}%0ANumber of guests: ${encodeURIComponent(record.guests)}%0AEvents: ${encodeURIComponent(record.events.join(', ')||'Not selected')}%0ANote: ${encodeURIComponent(record.note||'—')}`;$('#rsvpStatus').textContent='Your RSVP has been prepared. WhatsApp will open; please press Send to deliver it.';if(cfg.whatsapp&&cfg.whatsapp.replace(/\D/g,'').length>=8)window.open(`https://wa.me/${cfg.whatsapp.replace(/\D/g,'')}?text=${msg}`,'_blank','noopener');else $('#rsvpStatus').textContent='Creator has not configured a WhatsApp number. Your response is saved only in this browser; use the creator export to download it.';});
$('#creatorTrigger').addEventListener('click',()=>{const now=Date.now();taps=taps.filter(t=>now-t<2500);taps.push(now);if(taps.length>=5){$('#creatorModal').classList.remove('hidden');taps=[];if(unlocked)showEditor();}});$('#closeCreator').addEventListener('click',()=>$('#creatorModal').classList.add('hidden'));$('#creatorModal').addEventListener('click',e=>{if(e.target.id==='creatorModal')$('#creatorModal').classList.add('hidden')});
$('#unlockCreator').addEventListener('click',()=>{if($('#creatorPin').value==='2468'){unlocked=true;$('#pinArea').classList.add('hidden');showEditor()}else $('#pinError').textContent='Incorrect demo PIN.'});
$$('.tab').forEach(b=>b.addEventListener('click',()=>{ $$('.tab').forEach(x=>x.classList.toggle('active',x===b));$$('.editor-page').forEach(p=>p.classList.toggle('hidden',p.dataset.page!==b.dataset.tab));if(b.dataset.tab==='records')renderStats()}));
$('#saveConfig').addEventListener('click',saveFromEditor);$('#exportConfig').addEventListener('click',()=>download('wedding-config.json',JSON.stringify(cfg,null,2),'application/json'));$('#exportRsvps').addEventListener('click',exportRsvps);$('#resetLocal').addEventListener('click',()=>{if(confirm('Reset local visitor count and locally stored RSVP records for this browser? This cannot delete WhatsApp messages or server records.')){localStorage.removeItem(VISITS_KEY);localStorage.removeItem(RSVP_KEY);localStorage.removeItem('weddingInviteVisitedV1');renderStats()}});$('#addEvent').addEventListener('click',()=>{cfg.events.push({name:'New event',enabled:true,date:cfg.date,start:'10:00',end:'12:00',venue:cfg.venue,description:'',dressCode:'',dressCodeEnabled:false,revealMethod:'scratch'});renderEventEditor()});$('#importConfig').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{cfg={...defaults,...JSON.parse(await f.text())};saveLocal();applyConfig();fillEditor();alert('Config loaded in this browser. Save and export it to publish via GitHub.')}catch(err){alert('Could not read that JSON config.')}})
}
function showEditor(){$('#editorArea').classList.remove('hidden');fillEditor();renderEventEditor();renderStats()}
function fillEditor(){const map={cfgBride:'bride',cfgGroom:'groom',cfgDate:'date',cfgVenue:'venue',cfgBrideParents:'brideParents',cfgGroomParents:'groomParents',cfgMessage:'familyMessage',cfgHashtag:'hashtag',cfgWhatsapp:'whatsapp',cfgMusic:'musicUrl',cfgAccent:'accent',cfgIntro:'introLine',cfgClosing:'closing'};Object.entries(map).forEach(([id,key])=>$('#'+id).value=cfg[key]||'');$('#cfgTeamEnabled').checked=!!cfg.teamEnabled;$('#cfgCountdownEnabled').checked=!!cfg.countdownEnabled;$('#cfgPetalsEnabled').checked=!!cfg.petalsEnabled;$('#cfgRsvpEnabled').checked=cfg.rsvpEnabled!==false;$('#cfgEnvelopeEnabled').checked=cfg.envelopeEnabled!==false;$('#cfgScratchEnabled').checked=cfg.scratchEnabled!==false;$('#cfgHeartEnabled').checked=cfg.heartEnabled!==false;$('#cfgDholEnabled').checked=cfg.dholEnabled!==false;$('#cfgDholSound').value=cfg.dholSoundUrl||''}
function renderEventEditor(){$('#eventEditor').innerHTML=(cfg.events||[]).map((e,i)=>`<div class="event-edit" data-i="${i}"><label class="toggle-row"><input type="checkbox" data-k="enabled" ${e.enabled?'checked':''}> Show ${esc(e.name)} on invitation</label><label>Event name<input data-k="name" value="${esc(e.name)}"></label><label>Date<input type="date" data-k="date" value="${esc(e.date||'')}"></label><label>Start time<input type="time" data-k="start" value="${esc(e.start||'')}"></label><label>End time<input type="time" data-k="end" value="${esc(e.end||'')}"></label><label>Venue<input data-k="venue" value="${esc(e.venue||'')}"></label><label>Description<textarea data-k="description" rows="2">${esc(e.description||'')}</textarea></label><label>Reveal method<select data-k="revealMethod"><option value="scratch" ${(e.revealMethod||'scratch')==='scratch'?'selected':''}>Full scratch / rub</option><option value="heart" ${e.revealMethod==='heart'?'selected':''}>Heart-shaped scratch</option><option value="dhol" ${e.revealMethod==='dhol'?'selected':''}>Dhol — 5 taps</option></select></label><label class="toggle-row"><input type="checkbox" data-k="dressCodeEnabled" ${(e.dressCodeEnabled===undefined?!!e.dressCode:e.dressCodeEnabled)?'checked':''}> Show dress code for this event</label><label>Dress code text<input data-k="dressCode" value="${esc(e.dressCode||'')}" placeholder="e.g. Pastel & floral"></label><button class="button button-outline danger" data-remove="${i}">Remove event</button></div>`).join('');$$('#eventEditor [data-k]').forEach(el=>el.addEventListener('change',()=>{let card=el.closest('.event-edit'),i=Number(card.dataset.i),key=el.dataset.k;cfg.events[i][key]=el.type==='checkbox'?el.checked:el.value;}));$$('#eventEditor [data-remove]').forEach(b=>b.addEventListener('click',()=>{cfg.events.splice(Number(b.dataset.remove),1);renderEventEditor()}))}
function saveFromEditor(){const map={cfgBride:'bride',cfgGroom:'groom',cfgDate:'date',cfgVenue:'venue',cfgBrideParents:'brideParents',cfgGroomParents:'groomParents',cfgMessage:'familyMessage',cfgHashtag:'hashtag',cfgWhatsapp:'whatsapp',cfgMusic:'musicUrl',cfgAccent:'accent',cfgIntro:'introLine',cfgClosing:'closing'};Object.entries(map).forEach(([id,key])=>cfg[key]=$('#'+id).value);cfg.teamEnabled=$('#cfgTeamEnabled').checked;cfg.countdownEnabled=$('#cfgCountdownEnabled').checked;cfg.petalsEnabled=$('#cfgPetalsEnabled').checked;cfg.rsvpEnabled=$('#cfgRsvpEnabled').checked;cfg.envelopeEnabled=$('#cfgEnvelopeEnabled').checked;cfg.scratchEnabled=$('#cfgScratchEnabled').checked;cfg.heartEnabled=$('#cfgHeartEnabled').checked;cfg.dholEnabled=$('#cfgDholEnabled').checked;cfg.dholSoundUrl=$('#cfgDholSound').value.trim();saveLocal();applyConfig();renderEventEditor();alert('Saved in this browser. To publish for all guests, download wedding-config.json from Records and upload/commit it to your GitHub repository.')}
function saveLocal(){localStorage.setItem(LOCAL_CONFIG,JSON.stringify(cfg))}
function renderStats(){let visits=Number(localStorage.getItem(VISITS_KEY)||0),rs=JSON.parse(localStorage.getItem(RSVP_KEY)||'[]');$('#localStats').innerHTML=`<p><strong>Unique browser visits on this device:</strong> ${visits}</p><p><strong>RSVPs stored locally on this device:</strong> ${rs.length}</p><p class="form-note">This is not a shared dashboard. WhatsApp submissions are not automatically imported. To collect data centrally, connect a backend or a hosted form service.</p>`}
function exportRsvps(){let rows=[['Name','Attendance','Guests','Events','Note','Submitted at'],...JSON.parse(localStorage.getItem(RSVP_KEY)||'[]').map(r=>[r.name,r.attendance,r.guests,(r.events||[]).join('; '),r.note,r.submittedAt])];download('rsvp-records.csv',rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n'),'text/csv')}
function download(name,content,type){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function startPetals(){setInterval(()=>{if(document.hidden)return;let p=document.createElement('span');p.className='petal';p.textContent=['✿','❀','✦'][Math.floor(Math.random()*3)];p.style.left=Math.random()*100+'vw';p.style.animationDuration=(7+Math.random()*7)+'s';p.style.fontSize=(10+Math.random()*13)+'px';document.body.append(p);setTimeout(()=>p.remove(),15000)},1100)}
init();