import store from 'store';
import edsStore from '../store';
import {euSignMedia, initEuSignMedia } from '../lib/eu-sign-media';
import {euSignFile, initEuSignFile } from '../lib/eu-sign-file';
import SignForm from '../component/SignForm.vue';

// register store module
store.registerModule('eds', edsStore);

// init libs
initEuSignFile();
initEuSignMedia();

export default ({ Vue }) => {

  // prototype
  Vue.prototype.$euSignFile = euSignFile;
  Vue.prototype.$euSignMedia = euSignMedia;

  // globally register component
  Vue.component('sign-form', SignForm);

}
