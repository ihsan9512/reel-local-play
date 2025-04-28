
import '@capacitor-community/media';

declare module '@capacitor-community/media' {
  interface MediaPlugin {
    deleteMedia(options: { id: string }): Promise<void>;
  }
}
