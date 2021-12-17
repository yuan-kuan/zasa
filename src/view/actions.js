export function longpress(node, threshold = 500) {
  const handle_mousedown = (evt) => {

    evt.preventDefault();

    const timeout = setTimeout(() => {
      node.removeEventListener('mousemove', cancel);
      node.removeEventListener('mouseup', cancel);
      node.removeEventListener('touchend', cancel);
      node.removeEventListener('touchcancel', cancel);
      node.dispatchEvent(new CustomEvent('longpress'));
    }, threshold);

    const cancel = (evt) => {
      clearTimeout(timeout);
      evt.preventDefault();
      node.removeEventListener('mousemove', cancel);
      node.removeEventListener('mouseup', cancel);
      node.removeEventListener('touchend', cancel);
      node.removeEventListener('touchcancel', cancel);
      node.dispatchEvent(new CustomEvent('tagclick'));
    };

    node.addEventListener('mousemove', cancel);
    node.addEventListener('mouseup', cancel);
    node.addEventListener('touchend', cancel);
    node.addEventListener('touchcancel', cancel);
  }

  node.addEventListener('mousedown', handle_mousedown);
  node.addEventListener('touchstart', handle_mousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handle_mousedown);
      node.removeEventListener('touchstart', handle_mousedown);
    }
  };
}