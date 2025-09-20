const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: './public/image_default/' });
const menusViews = require('../controllers/menuControllers');

router.get('/menus',menusViews.list);
router.get('/menus/fetch_mm_list/findmm_intab:tab_id',menusViews.fetch_mm_list);
router.post('/menus/icon_default',menusViews.icon_default);
router.post('/menus/forms_list',menusViews.forms_list);
router.post('/menus/save',upload.any(),menusViews.save);
router.post('/menus/edit',menusViews.edit);
router.post('/menus/update',upload.any(),menusViews.update);
router.post('/menus/check',menusViews.check);
router.post('/menus/delete',menusViews.delete);
router.post('/menus/position_mm',menusViews.position_mm);
router.post('/menus/clicktab_mm',menusViews.clicktab_mm);

router.get('/menus/find:id',menusViews.findmenu_sub);
router.get('/menus/fetch_ms_list',menusViews.fetch_ms_list);
router.post('/menus/save_ms',upload.any(),menusViews.save_ms);
router.post('/menus/edit_ms',menusViews.edit_ms);
router.post('/menus/update_ms',upload.any(),menusViews.update_ms);
router.post('/menus/check_ms',menusViews.check_ms);
router.post('/menus/delete_ms',menusViews.delete_ms);
router.post('/menus/position_ms',menusViews.position_ms);
router.post('/menus/clicktab_ms',menusViews.clicktab_ms);
module.exports = router;