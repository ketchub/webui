import tooltip from '@/_lib/tooltips';
let $container;

export default {
  bind( el, binding ) {
    el.addEventListener('mouseenter', onMouseEnter.bind(el, binding));
    el.addEventListener('mouseleave', tooltip.hide);
  },
  unbind( el ) {
    el.removeEventListener('mouseenter', onMouseEnter);
    el.removeEventListener('mouseleave', tooltip.hide);
    tooltip.hide();
  }
};

function onMouseEnter(binding, event) {
  if (binding && binding.value) {
    ensureContainer(() => {
      tooltip.show({
        content: binding.value
      });
    });
  }
}

function ensureContainer(done) {
  if (!$container) {
    $container = document.createElement('div');
    $container.className = 'fc-tooltip-container';
    document.body.appendChild($container);
  }
  done();
}
