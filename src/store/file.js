export default {
  namespaced: true,
  state: {
    inited: false,
    progressInit: false,
    error: null,
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
    setKey: (state, key) => {
      state.key = key;
    },
    initFailed: (state, error) => {
      console.error('eds/file/initFailed', error);
      state.inited = false;
      state.error = error;
    },
    initSuccess: (state) => {
      console.log('eds/file/initSuccess');
      state.inited = true;
      state.error = null;
    }
  }
}
