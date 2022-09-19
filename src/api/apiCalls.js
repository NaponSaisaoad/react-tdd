import axios from 'axios';
import i18n from '../locale/i18n';
import { store } from '../state/store';

axios.interceptors.request.use((request) => {
  request.headers['Accept-Language'] = i18n.language;
  const { header } = store.getState();
  if (header) {
    request.headers['Authorization'] = header;
  }
  return request;
});