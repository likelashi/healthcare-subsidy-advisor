import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'healthcare-subsidy-advisor' with your actual GitHub repo name
  // If deploying to https://<username>.github.io/<repo>/, use '/<repo>/'
  // If deploying to https://<username>.github.io/ (user/org site), use '/'
  base: '/healthcare-subsidy-advisor/',
})
