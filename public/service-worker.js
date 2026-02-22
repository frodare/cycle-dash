/* eslint-disable */
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.routing.registerRoute(
  ({ request }) => {
    return request.destination === 'image' || request.destination === 'audio';
  },
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ request }) => {
    return request.destination === 'script' || request.destination === 'style';
  },
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  ({ request }) => {
    return request.destination === 'document';
  },
  new workbox.strategies.NetworkFirst()
);
