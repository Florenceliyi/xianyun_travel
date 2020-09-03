export const state = () => ({
  sourceURL: '',
});

export const mutations = {
  setSourceURL(state, data) {
    state.sourceURL = data;
  },
  clearSourceURL(state) {
    state.sourceURL = '';
  }
}
