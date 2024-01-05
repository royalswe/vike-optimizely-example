// Theese are mocks only for demo purposes.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import pageHierarchy from './pageHierarchy.json';
import siteSettings from './siteSettings.json';
import getContent from './getContent.json';

// Describe network behavior with request handlers.
const server = setupServer(
  http.get(
    import.meta.env.VITE_API_BASE_URL + '/_api/pages/getpagehiearchy',
    ({ request, params, cookies }) => {
      return HttpResponse.json(pageHierarchy);
    }
  ),
  http.get(
    import.meta.env.VITE_API_BASE_URL +
      '/_api/pages/getstartpageorsettingspageproperties/*',
    () => {
      return HttpResponse.json(siteSettings);
    }
  ),
  http.get(import.meta.env.VITE_API_BASE_URL + '/api/episerver/*', () => {
    return HttpResponse.json(getContent);
  }),
  http.get(import.meta.env.VITE_API_BASE_URL + '/_api/notices/*', () => {
    return HttpResponse.json(null);
  })
);

// Start request interception by starting the Service Worker.
server.listen();
