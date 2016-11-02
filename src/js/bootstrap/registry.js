export default { modules, actions, getters, components, mixins, plugins };

    // Vuex related
let _modules    = {},
    _actions    = {},
    _getters    = {},
    // Regular VueJS
    _components = [],
    _mixins     = [],
    _plugins    = [];

function modules( name, definition ){
  if( arguments.length === 0 ){ return _modules; }
  _modules[name] = definition;
}

function actions( name, definition ){
  if( arguments.length === 0 ){ return _actions; }
  _actions[name] = definition;
}

function getters( name, definition ){
  if( arguments.length === 0 ){ return _getters; }
  _getters[name] = definition;
}

function components( makeComponentFunc ){
  if( arguments.length === 0 ){ return _components; }
  _components.push(makeComponentFunc);
}

function mixins( definition ){
  if( arguments.length === 0 ){ return _mixins; }
  _mixins.push(definition);
}

function plugins( definition ){
  if( arguments.length === 0 ){ return _plugins; }
  _plugins.push(definition);
}
