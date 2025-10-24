//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

//// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react()],
//})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    // RENDER FIX: Add the following block to allow the live Render URL
    preview: {
        // Add the live host here to prevent "Blocked host" error when running on Render
        allowedHosts: [
            'job-portal-react-o7b2.onrender.com',
            'localhost', // For local testing
        ],
    },
    // RENDER FIX END
});
 
