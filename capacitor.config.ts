
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f2d8ce0edb924dc6801f57d17fd9e8c4',
  appName: 'reel-local-play',
  webDir: 'dist',
  server: {
    url: "https://f2d8ce0e-db92-4dc6-801f-57d17fd9e8c4.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorMedia: {
      androidPermissionMode: "onDemo"
    },
    Media: {
      scanMediaOnReconnect: true
    }
  }
};

export default config;
