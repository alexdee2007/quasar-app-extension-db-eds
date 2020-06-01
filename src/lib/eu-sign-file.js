import store from 'store';
import { EndUser, EndUserConstants } from './euscp';
import euSettings from './eu-settings';

// file lib
export const euSignFile = new EndUser(null, EndUserConstants.EndUserLibraryType.JS);

// init file lib
export const initEuSignFile = async() => {
  try {
    store.commit('eds/file/setProgressInit', true);
    const isInitialized = await euSignFile.IsInitialized();
    !isInitialized && await euSignFile.Initialize(euSettings);
    store.commit('eds/file/initSuccess');
  } catch (err) {
    store.commit('eds/file/initFailed', err.message);
  } finally {
    store.commit('eds/file/setProgressInit', false);
  }
}
