import { defineConfig } from 'vite';

export default defineConfig({
  // Projenizin kök dizini
  root: './',
  base: "/three-map-generation/",
  // Geliştirme sunucusu ayarları
  server: {
    // Geliştirme sunucusunun çalışacağı port
    port: 3000,
    
    // Geliştirme sunucusunun başlatılmasından sonra otomatik olarak tarayıcıyı açar
    open: true,
  },

  // Eklenti ayarları
  plugins: [
    // Gerekirse eklentileri burada yapılandırabilirsiniz
  ],

  // Diğer özelleştirmeler
  // Örneğin: build ayarları, optimize ayarları, css ayarları, etc.
});
