export const authStorage = {
    getAccessToken: () => localStorage.getItem('access_token'),
    setAccessToken: (token: string) => localStorage.setItem('access_token', token),
    removeAccessToken: () => localStorage.removeItem('access_token'),
  };



//!! to use in tauri app environment
/*   import { Store } from 'tauri-plugin-store-api';

const store = new Store('.auth.dat');

export const authStorage = {
  getAccessToken: async () => await store.get('access_token'),
  setAccessToken: async (token: string) => {
    await store.set('access_token', token);
    await store.save();
  },
}; */