import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const keyPath = '/Users/mac/Downloads/private_50ec3d72-27b2-450a-82d2-b86fe1fd4df2(1).key'
const certPath = '/Users/mac/Downloads/ssl/meetfleet_org.crt'
const caPath = '/Users/mac/Downloads/ssl/meetfleet_org.ca-bundle'

const hasCert = fs.existsSync(keyPath) && fs.existsSync(certPath)

export default defineConfig({
  plugins: [react()],
  server: {
    https: hasCert ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      ca: fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined,
    } : false,
  },
})
