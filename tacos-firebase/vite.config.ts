import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [{
    name: 'admin-route',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url === '/admin.html' || request.url?.startsWith('/admin.html?')) {
          response.statusCode = 302;
          response.setHeader('Location', '/admin');
          response.end();
          return;
        }
        if (request.url === '/ventas.html' || request.url?.startsWith('/ventas.html?')) {
          response.statusCode = 302;
          response.setHeader('Location', '/ventas');
          response.end();
          return;
        }
        if (request.url === '/admin' || request.url?.startsWith('/admin?')) {
          request.url = request.url.replace(/^\/admin(?=$|\?)/, '/admin.html');
        }
        if (request.url === '/ventas' || request.url?.startsWith('/ventas?')) {
          request.url = request.url.replace(/^\/ventas(?=$|\?)/, '/ventas.html');
        }
        next();
      });
    }
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        menu: resolve(__dirname, 'menu.html'),
        ventas: resolve(__dirname, 'ventas.html'),
      }
    }
  }
});
