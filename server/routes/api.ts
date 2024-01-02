import { Router } from 'express';
import pageHierarchy from '../mock-data/pageHierarchy.json' assert { type: 'json' };

const api = Router({});

/* Market page */
api.get('/pages/getpagehiearchy', async (req, res) => {
  console.log('pages on sever dude ');

  res.json(pageHierarchy);
});

// Redirect to Episerver UI on API url
api.get('/siteSettings', (req, res) => {
  return res.json(import('../mock-data/siteSettings.json'));
});

export default api;
