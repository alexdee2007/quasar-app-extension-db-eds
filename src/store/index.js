import file from './file';
import media from './media';

export default {
  modules: {file, media},
  namespaced: true,
  state: {
    tab: 'file',
  },
  mutations: {
    setTab: (state, tab) => {
      state.tab = tab;
    }
  }
};
