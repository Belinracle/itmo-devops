import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
    base: '/frontend/',
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./setupTests.js",
        globals: true,
        coverage: {
            reporter: ['text', 'lcov']
        },
    }
})
