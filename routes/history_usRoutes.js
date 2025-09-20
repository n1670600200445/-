const express = require('express');
const router = express.Router();

const history_usViews = require('../controllers/history_usControllers');

router.post('/history_us/list',history_usViews.list);
router.post('/history_us/name_mm',history_usViews.history_name_mm);
router.post('/history_us/name_ms',history_usViews.history_name_ms);

router.get('/history_us/all',history_usViews.list_all);
router.post('/history_us/all',history_usViews.list_all1);
router.post('/history_us/allname_mm',history_usViews.history_allname_mm);
router.post('/history_us/allname_ms',history_usViews.history_allname_ms);
//show detail history
router.get('/history_us/detail_hl:id',history_usViews.detail_hl);


module.exports = router;