import Vue from 'vue';
import Router from 'vue-router';
import Control from '@/components/Control';
import Data from '@/components/control/Data';
import Overlay from '@/components/Overlay';
import Host from '../components/overlay/Host';
import Thanks from '../components/overlay/Thanks';
import Presentation from '../components/overlay/Presentation';
import NextUp from '../components/overlay/NextUP';
import BRB from '../components/overlay/BRB';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/control',
      component: Control,
      children: [
        {
          path: 'data',
          name: 'Data',
          component: Data
        }
      ]
    },
    {
      path: '/overlay/',
      component: Overlay,
      children: [
        {
          path: 'host',
          name: 'Host',
          component: Host
        },
        {
          path: 'presentation',
          name: 'Presentation',
          component: Presentation
        },
        {
          path: 'nextUp',
          name: 'nextUp',
          component: NextUp
        },
        {
          path: 'brb',
          name: 'BRB',
          component: BRB
        },
        {
          path: 'thanks',
          name: 'Thanks',
          component: Thanks
        }
      ]
    }
  ]
});
