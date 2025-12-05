import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// import fs from 'fs';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

    server: {
    // https: {
    //    key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
    // },
    // proxy: {
    //   // Proxy everything Laravel needs
    //   '/sanctum':     { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   '/api':         { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   '/api/auth/login':       { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   '/logout':      { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   '/register':    { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   '/user':        { target: 'http://10.203.153.236:8000', changeOrigin: true, secure: false },
    //   // add more if needed
    // },
    proxy: {
      '/sanctum': {
        target: 'http://10.200.151.236:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://10.200.151.236:8000',
        changeOrigin: true,
        secure: false,
      
      },
    
    },
    
    host: true,


    },
 resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },


});