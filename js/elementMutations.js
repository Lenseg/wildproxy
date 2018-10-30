import { prepareUrl } from './utils';

function updateNodeSourceAttribute(node, attributeName) {
  const oldUrl = node[attributeName];
  const newUrl = prepareUrl(oldUrl);

  if (newUrl !== oldUrl) {
    node.setAttribute(attributeName, newUrl);
  }
}

window.addEventListener('load', () => {
  const attributeFilter = ['src', 'href'];
  const sourceSelector = attributeFilter.reduce((accumulator, currentValue) => `[${accumulator}], [${currentValue}]`);
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes, attributeName, target, type}) => {
      if (type === 'childList') {
        addedNodes.forEach(node => {
          const children = node.querySelectorAll ? node.querySelectorAll(sourceSelector) : [];

          [node, ...children].forEach(n => {
            const attr = attributeFilter.find(attribute => attribute in n);

            if (attr) {
              updateNodeSourceAttribute(n, attr);
            }
          });
        });
      } else if (type === 'attributes') {
        updateNodeSourceAttribute(target, attributeName);
      }
    });
  });

  observer.observe(document.body, {
    attributeFilter,
    attributes: true,
    childList: true,
    subtree: true
  });
});
