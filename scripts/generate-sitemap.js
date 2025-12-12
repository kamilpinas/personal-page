import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Config
const BASE_URL = "https://kamilpinas.dev"
const LANGUAGES = ["en", "pl"]
const ROUTES = [
  "",
  "/about",
  "/projects",
  "/skills",
  "/writing",
  "/contact",
  "/resume",
]
const OUTPUT_PATH = path.resolve(
  __dirname,
  "../../personal-page/public/sitemap.xml"
)

/**
 * Generates a sitemap.xml file for the site
 * @param {string} baseUrl - Base URL of the site
 * @param {string[]} languages - Array of language codes
 * @param {string[]} routes - Array of site routes
 * @param {string} outputPath - Full path to save sitemap.xml
 */
function generateSitemap(baseUrl, languages, routes, outputPath) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  languages.forEach((lang) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${lang}${route}`
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

  fs.writeFileSync(outputPath, sitemap, "utf8")
  console.log(`sitemap.xml generated successfully at: ${outputPath}`)
}

// Run the function
generateSitemap(BASE_URL, LANGUAGES, ROUTES, OUTPUT_PATH)
