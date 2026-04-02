import express from 'express';
import { getHomeContent, getMoviesShowsContent } from '../controllers/contentController.js';

const router = express.Router();

router.get('/home', getHomeContent);
router.get('/movies-shows', getMoviesShowsContent);

export default router;
