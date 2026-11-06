import yaml from 'js-yaml'
import raw from '../content.yaml?raw'
import './style.css'

const c = yaml.load(raw)
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m])

const lookbook = c.lookbook.items
  .map((i, n) => `<figure class="look look-${n + 1}" role="img" aria-label="Placeholder visuel : ${esc(i.caption)}"><figcaption class="label">${esc(i.caption)}</figcaption><span class="placeholder-tag label">Placeholder visuel</span></figure>`)
  .join('')

const products = c.products.items
  .map(
    (p, n) => `<article class="product">
      <div class="product-visual" aria-hidden="true"><span class="label">0${n + 1}</span></div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      <span class="label muted">${esc(p.status)}</span>
    </article>`
  )
  .join('')

const construction = c.construction.items
  .map((i) => `<li><span class="label">${esc(i.label)}</span><p>${esc(i.text)}</p></li>`)
  .join('')

const footerLinks = c.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('')
const legal = c.footer.legal.map((l) => `<span>${esc(l)}</span>`).join('')

document.querySelector('#app').innerHTML = `
  <div class="announcement label">${esc(c.announcement)}</div>
  <header class="header">
    <a class="logo" href="#top">${esc(c.brand.name)}</a>
    <nav class="label"><a href="#collection">Collection</a><a href="#manifesto">Manifeste</a><a href="#access">Accès</a></nav>
  </header>
  <main id="top">
    <section class="hero">
      <div class="hero-visual" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="label">${esc(c.drop.eyebrow)} · ${esc(c.drop.launch_date)}</p>
        <h1>${esc(c.drop.eyebrow)}<br /><span>${esc(c.drop.title)}</span></h1>
        <p class="hero-tag">${esc(c.brand.tagline)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${esc(c.drop.primary_cta.href)}">${esc(c.drop.primary_cta.label)}</a>
          <a class="btn btn-ghost" href="${esc(c.drop.secondary_cta.href)}">${esc(c.drop.secondary_cta.label)}</a>
        </div>
        <p class="label muted">${esc(c.drop.availability)}</p>
      </div>
    </section>

    <section class="manifesto" id="manifesto">
      <h2>${esc(c.manifesto.title)}</h2>
      <p>${esc(c.manifesto.text)}</p>
      <ul class="territory label">${c.brand.territory.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>

    <section class="lookbook">
      <h2 class="label">${esc(c.lookbook.title)}</h2>
      <div class="look-grid">${lookbook}</div>
    </section>

    <section class="products" id="collection">
      <h2 class="label">${esc(c.products.title)}</h2>
      <div class="product-grid">${products}</div>
    </section>

    <section class="construction">
      <h2 class="label">${esc(c.construction.title)}</h2>
      <ul>${construction}</ul>
      <p class="label muted">${esc(c.construction.note)}</p>
    </section>

    <section class="access" id="access">
      <h2>${esc(c.access.title)}</h2>
      <p>${esc(c.access.text)}</p>
      <form id="access-form" novalidate>
        <label class="label" for="email">${esc(c.access.input_label)}</label>
        <div class="form-row">
          <input id="email" type="email" autocomplete="email" placeholder="nom@exemple.com" required />
          <button class="btn btn-primary" type="submit">${esc(c.access.button_label)}</button>
        </div>
        <p id="confirmation" class="label" role="status" hidden>${esc(c.access.confirmation_message)}</p>
      </form>
    </section>
  </main>
  <footer class="footer">
    <div class="footer-links label">${footerLinks}</div>
    <div class="footer-legal label muted">${legal}</div>
    <p class="label muted">${esc(c.footer.note)}</p>
  </footer>
`

// Formulaire visuel uniquement : aucun envoi, aucun backend.
document.querySelector('#access-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = document.querySelector('#email')
  if (!input.checkValidity() || !input.value) {
    input.focus()
    return
  }
  document.querySelector('#confirmation').hidden = false
  input.value = ''
})
