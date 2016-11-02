import { each } from 'lodash';
import registry from '@/bootstrap/registry';
import * as actions from '@/actions';
import * as components from '@/components';
import * as mixins from '@/mixins';
import * as modules from '@/modules';
import * as plugins from '@/plugins';
import getters from '@/getters';

export default function bindings( done ){
  each(actions, ( action, name ) => { registry.actions(name, action); });
  each(components, ( component ) => { registry.components(component); });
  each(mixins, ( mixin ) => { registry.mixins(mixin); });
  each(modules, ( module, name ) => { registry.modules(name, module); });
  each(plugins, ( plugin ) => { registry.plugins(plugin); });
  each(getters, ( getter, name ) => { registry.getters(name, getter); });
  done(registry);
}
