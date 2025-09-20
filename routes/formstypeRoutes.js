const express = require('express');
const router = express.Router();

const formstypeViews = require('../controllers/formstypeControllers');

router.get('/formstype',formstypeViews.list); //รายชื่อ ประเภทฟอร์ม
router.post('/formstype/save',formstypeViews.save); //บันทึก ประเภทฟอร์ม
router.post('/formstype/edit',formstypeViews.edit); //แก้ไข ประเภทฟอร์ม
router.post('/formstype/update',formstypeViews.update); //บันทึกการแก้ไข ประเภทฟอร์ม
router.post('/formstype/check',formstypeViews.check); //เช็คก่อนลบ ประเภทฟอร์ม
router.post('/formstype/delete',formstypeViews.delete); //ลบ ประเภทฟอร์ม

module.exports = router;