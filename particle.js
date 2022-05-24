// eslint-disable-next-line import/no-unresolved
import {Draggable} from '@shopify/draggable';

function translateMirror(mirror, mirrorCoords, containerRect) {
  if (mirrorCoords.top < containerRect.top || mirrorCoords.left < containerRect.left) {
    return;
  }

  requestAnimationFrame(() => {
    mirror.style.transform = `translate3d(${mirrorCoords.left}px, ${mirrorCoords.top}px, 0)`;
  });
}

function calcOffset(offset) {
  return offset * 2 * 0.5;
}

export default function DragEvents() {
  const toggleClass = 'PillSwitch--isOn';
  const containers = document.querySelectorAll('#DragEvents .PillSwitch');

  if (containers.length === 0) {
    return false;
  }

  const draggable = new Draggable(containers, {
    draggable: '.PillSwitchControl',
    delay: 0,
  });

  let isToggled = false;
  let initialMousePosition;
  let containerRect;
  let dragRect;
  let dragThreshold;
  let headings;
  let headingText;

  // --- Draggable events --- //
  draggable.on('drag:start', (evt) => {
    initialMousePosition = {
      x: evt.sensorEvent.clientX,
      y: evt.sensorEvent.clientY,
    };
  });

  draggable.on('mirror:created', (evt) => {
    containerRect = evt.sourceContainer.getBoundingClientRect();
    dragRect = evt.source.getBoundingClientRect();

    const containerRectQuarter = containerRect.width / 4;
    dragThreshold = isToggled ? containerRectQuarter * -1 : containerRectQuarter;
    headings = {
      source: evt.originalSource.querySelector('[data-switch-on]'),
      mirror: evt.mirror.querySelector('[data-switch-on]'),
    };
    headingText = {
      on: headings.source.dataset.switchOn,
      off: headings.source.dataset.switchOff,
    };
  });

  draggable.on('mirror:move', (evt) => {
    // Required to help restrict the draggable element to the container
    evt.cancel();

    // We do not want to use `getBoundingClientRect` while dragging,
    // as that would be very expensive.
    // Instead, we look at the mouse position, which we can ballpark as being
    // close to the center of the draggable element.
    // We need to look at both the X and Y offset and determine which is the higher number.
    // That way we can drag outside of the container and still have the
    // draggable element move appropriately.
    const offsetX = calcOffset(evt.sensorEvent.clientX - initialMousePosition.x);
    const offsetY = calcOffset(initialMousePosition.y - evt.sensorEvent.clientY);
    const offsetValue = offsetX > offsetY ? offsetX : offsetY;
    const mirrorCoords = {
      top: dragRect.top - offsetValue,
      left: dragRect.left + offsetValue,
    };

    translateMirror(evt.mirror, mirrorCoords, containerRect);

    if (isToggled && offsetValue < dragThreshold) {
      evt.sourceContainer.classList.remove(toggleClass);
      headings.source.textContent = headingText.off;
      headings.mirror.textContent = headingText.off;
      isToggled = false;
    } else if (!isToggled && offsetValue > dragThreshold) {
      evt.sourceContainer.classList.add(toggleClass);
      headings.source.textContent = headingText.on;
      headings.mirror.textContent = headingText.on;
      isToggled = true;
    }
  });

  const triggerMouseUpOnESC = (evt) => {
    if (evt.key === 'Escape') {
      draggable.cancel();
    }
  };

  draggable.on('drag:start', () => {
    document.addEventListener('keyup', triggerMouseUpOnESC);
  });

  return draggable;
}
import Draggable from './Draggable';

export default Draggable;

export * from './DragEvent';
export * from './DraggableEvent';
export * from './Plugins';
export * from './Sensors';

particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#af2525"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;