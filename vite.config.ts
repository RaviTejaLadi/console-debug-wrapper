import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/ConsoleDebugWrapper/index.ts"),
      name: "ConsoleDebugWrapper",
      fileName: (format) => `console-debug-wrapper.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "tailwindcss",
        "lucide-react",
        "tailwind-merge",
        "clsx",
        "class-variance-authority",
        "@radix-ui/react-label",
        "@radix-ui/react-popover",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tailwindcss: "tailwindcss",
        },
      },
    },
  },
})
