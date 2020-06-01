import store from 'store';
import { EndUser, EndUserConstants } from './euscp';
import euSettings from './eu-settings';

// file lib
export const euSignMedia = new EndUser(null, EndUserConstants.EndUserLibraryType.SW);

// init media lib
export const initEuSignMedia = async() => {
  try {
    store.commit('eds/media/setProgressInit', true);
    const isInitialized = await euSignMedia.IsInitialized();
    if (!isInitialized) {

      // check lib
      const result = await euSignMedia.GetLibraryInfo();
      if (!result.supported) {
        throw 'Бібліотека веб-підпису не підтримується в вашому браузері або ОС!';
      }
      if (!result.loaded) {
        if (result.isNativeLibraryNeedUpdate) {
          throw 'Бібліотека веб-підпису потребує оновлення. Будь ласка, встановіть <a href="' + result.nativeLibraryInstallURL + '"target="_blank">оновлення</a> та оновіть сторінку.';
        }
        if (result.isWebExtensionSupported && !result.isWebExtensionInstalled) {
          throw 'Бібліотека веб-підпису потребує встановлення веб-розширення. Будь ласка, встановіть <a href="' + result.webExtensionInstallURL + '" target="_blank">веб-розширення</a> та оновіть сторінку.';
        }
        throw 'Бібліотека веб-підпису потребує встановлення. Будь ласка, встановіть <a href="' + result.nativeLibraryInstallURL + '" target="_blank">бібліотеку</a> та оновіть сторінку.';
      }

      // init
      await euSignMedia.Initialize(euSettings);
      const medias = await euSignMedia.GetKeyMedias();
      store.commit('eds/media/setMedias', medias);

    }
    store.commit('eds/media/initSuccess');
  } catch (err) {
    store.commit('eds/media/initFailed', err);
  } finally {
    store.commit('eds/media/setProgressInit', false);
  }
}
