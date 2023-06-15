import { defineStore } from 'pinia';

export const useCommonStore = defineStore({
  id: 'commonStore',
  state: () => ({
    _selectedMarketPage: 0,
    _clientTranslations: [],
    _siteSettings: {},
    _user: {},
    preview: false,
  }),
  getters: {
    selectedMarketPage(state) {
      return state._selectedMarketPage;
    },
    clientTranslations(state) {
      return state._clientTranslations;
    },
    siteSettings(state) {
      return state._siteSettings;
    },
    user(state) {
      return state._user;
    },
  },
  actions: {
    setSelectedMarketPage(selectedMarketPage: number) {
      this._selectedMarketPage = selectedMarketPage;
    },
    setClientTranslations(clientTranslations: []) {
      this._clientTranslations = clientTranslations;
    },
    setSiteSettings(siteSettings: any) {
      this._siteSettings = siteSettings;
    },
    setUser(user: any) {
      this._user = user;
    },
  },
});
