// Mobiel menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
});

// Vachtkiezer
const coats = {
  krul: {
    title: 'Krullende vacht',
    text: 'Poedels, doodles en andere krullers klitten snel, zeker achter de oren en onder de poten.',
    doIt: 'Wassen, grondig uitkammen, daarna knippen of scheren in de lengte die jij kiest.',
    freq: 'Om de 4 tot 8 weken, afhankelijk van de lengte.'
  },
  lang: {
    title: 'Langhaar',
    text: 'Aussies en Border Collies hebben een dubbele vacht met veel ondervacht, vooral in de rui.',
    doIt: 'Wassen, föhnen, ondervacht verwijderen en netjes bijwerken zonder de vacht kort te scheren.',
    freq: 'Om de 6 tot 10 weken, vaker in de rui.'
  },
  ruw: {
    title: 'Ruwhaar',
    text: 'Terriërs en schnauzers hebben een harde vacht die een eigen techniek vraagt.',
    doIt: 'Trimmen volgens het rasstandaard, of knippen als je liefst een zachtere vacht wilt.',
    freq: 'Om de 8 tot 12 weken.'
  },
  kort: {
    title: 'Korthaar',
    text: 'Weinig onderhoud, maar ook korthaar verhaart en heeft baat bij regelmatig wassen en borstelen.',
    doIt: 'Wassen, losse haren verwijderen, nagels en oren.',
    freq: 'Om de 8 tot 12 weken, of in de rui.'
  }
};

const panel = document.getElementById('coat-panel');
const tabs = document.querySelectorAll('.coat-tabs button');

function showCoat(key) {
  const c = coats[key];
  document.getElementById('coat-title').textContent = c.title;
  document.getElementById('coat-text').textContent = c.text;
  document.getElementById('coat-do').textContent = c.doIt;
  document.getElementById('coat-freq').textContent = c.freq;
  panel.setAttribute('aria-labelledby', 'tab-' + key);
  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.key === key));
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
}
tabs.forEach(t => t.addEventListener('click', () => showCoat(t.dataset.key)));
showCoat('krul');

// Afspraakformulier: opent het e-mailprogramma van de bezoeker.
// TODO: vervang EMAIL_ADRES door het echte e-mailadres van de salon,
// of koppel het formulier aan een dienst zoals Formspree of Netlify Forms.
const EMAIL_ADRES = 'tindemanscedric@gmail.com';
const form = document.getElementById('form');

// Datumkiezer: geen data in het verleden
const datum = document.getElementById('datum');
const vandaag = new Date();
datum.min = vandaag.getFullYear() + '-' + String(vandaag.getMonth() + 1).padStart(2, '0') + '-' + String(vandaag.getDate()).padStart(2, '0');
// TODO: pas aan als je op zondag (of een andere dag) wel open bent. 0 = zondag.
const GESLOTEN_DAGEN = [0];
const msg = document.getElementById('form-msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  ['naam', 'contact', 'hond', 'datum'].forEach(name => {
    const field = form.elements[name];
    const empty = !field.value.trim();
    field.classList.toggle('invalid', empty);
    if (empty) ok = false;
  });
  const choice = form.querySelector('.choice');
  const kind = form.elements['diersoort'].value;
  choice.classList.toggle('invalid', !kind);
  if (!kind) ok = false;
  if (!ok) { msg.textContent = 'Vul je naam, contactgegevens, diersoort, naam van je dier en een gewenste datum in.'; return; }

  const gekozen = new Date(data.datum + 'T12:00:00');
  if (GESLOTEN_DAGEN.includes(gekozen.getDay())) {
    datum.classList.add('invalid');
    msg.textContent = 'Op die dag is de salon gesloten. Kies een andere datum.';
    return;
  }
  const datumTekst = gekozen.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const body = `Naam baasje: ${data.naam}\nContact: ${data.contact}\nDiersoort: ${data.diersoort}\nNaam dier: ${data.hond}\nRas: ${data.ras || '-'}\nGewenste datum: ${datumTekst}\n\n${data.bericht || ''}`;
  location.href = `mailto:${EMAIL_ADRES}?subject=${encodeURIComponent('Afspraak voor ' + data.hond + ' (' + data.diersoort.toLowerCase() + ')')}&body=${encodeURIComponent(body)}`;
  msg.textContent = 'Je e-mailprogramma opent nu. Verstuur het bericht om je aanvraag te bevestigen.';
});

document.getElementById('year').textContent = new Date().getFullYear();