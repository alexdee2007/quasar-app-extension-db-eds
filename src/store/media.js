export default {
  namespaced: true,
  state: {
    inited: false,
    progressInit: false,
    error: null,
    medias: [],
    key: null
  },
  mutations: {
    setProgressInit: (state, progressInit) => {
      state.progressInit = progressInit;
      if (progressInit === true) {
        state.inited = false;
        state.error = null;
      }
    },
    setMedias: (state, medias) => {
      state.medias = medias;
    },
    setKey: (state, key) => {
      state.key = key;
    },
    initFailed: (state, error) => {
      console.error('eds/media/initFailed', error);
      state.inited = false;
      state.error = error;
    },
    initSuccess: (state) => {
      console.log('eds/media/initSuccess');
      state.inited = true;
      state.error = null;
    },
    setMedias: (state, medias) => {
      console.log('eds/media/setMedias', medias);
      state.medias = medias.map(media => ({value: media.visibleName, key: media}));
    }
  }
}