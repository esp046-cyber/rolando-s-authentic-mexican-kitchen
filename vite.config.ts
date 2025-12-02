<change>
<file>vite.config.ts</file>
<description>Clean vite.config.ts - COPY ONLY THE CODE INSIDE</description>
<content><![CDATA[import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
plugins: [react()],
// Use relative path './' so it works in any subfolder on GitHub Pages
base: './',
define: {
'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
}
})]]></content>
</change>
