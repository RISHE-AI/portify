import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function syncInitialDataPlugin() {
  return {
    name: 'sync-initial-data-plugin',
    configureServer(server) {
      server.middlewares.use('/__sync_initial_data', (req, res, next) => {
        if (req.method !== 'POST') return next()
        let rawBody = ''
        req.on('data', (chunk) => {
          rawBody += chunk
        })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(rawBody)
            const publicData = {
              lastUpdated: parsed.lastUpdated || Date.now(),
              profile: parsed.profile || {},
              projects: (parsed.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
              experience: (parsed.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
              education: (parsed.education || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
              skills: parsed.skills || [],
              certifications: parsed.certifications || [],
              achievements: parsed.achievements || []
            }
            const initialDataPath = path.join(__dirname, 'src', 'services', 'initialData.js')
            const content = `// Auto-synced from Admin Dashboard — hardcoded portfolio data for all visitors\nexport const initialPortfolioData = ${JSON.stringify(publicData, null, 2)};\n`
            fs.writeFileSync(initialDataPath, content, 'utf-8')

            // Also sync server/data/database.json if present
            const dbPath = path.join(__dirname, 'server', 'data', 'database.json')
            if (fs.existsSync(dbPath)) {
              const existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
              const mergedDb = { ...existingDb, ...publicData }
              fs.writeFileSync(dbPath, JSON.stringify(mergedDb, null, 2), 'utf-8')
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: err.message }))
          }
        })
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), syncInitialDataPlugin()],
  server: {
    port: 5173,
    watch: {
      ignored: ['**/src/services/initialData.js', '**/server/data/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
