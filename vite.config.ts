<change>
<file>vite.config.ts</file>
<description>Update base path to absolute repository name for GitHub Pages stability</description>
<content><![CDATA[import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
plugins: [react()],
// IMPORTANT: This must match your GitHub Repository name exactly, with slashes.
base: '/rolando-s-authentic-mexican-kitchen/',
define: {
'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
}
})]]></content>
</change>
