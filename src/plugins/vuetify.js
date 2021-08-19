import '@mdi/font/css/materialdesignicons.css' //material design icons
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import theme from './theme/theme';
Vue.use(Vuetify);

export default new Vuetify({
    theme,
    icons: {
        iconfont: 'mdi',
    },
});