const fs = require("fs")
const path = require("path")

const BASE_URL = "https://kamilpinas.dev"
const LANGUAGES = ["en", "pl"]

const routes = [
  "", // Home page
  "/about",
  "/projects",
  "/skills",
  "/writing",
  "/contact",
  "/resume",
]

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

LANGUAGES.forEach((lang) => {
  routes.forEach((route) => {
    const url = `${BASE_URL}/${lang}${route}`
    sitemap += `
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  })
})

sitemap += `
</urlset>`

const outputPath = path.resolve(
  __dirname,
  "../../personal-page/public/sitemap.xml"
)

fs.writeFileSync(outputPath, sitemap, "utf8")

console.log("sitemap.xml generated successfully!")
