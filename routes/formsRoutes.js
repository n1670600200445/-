const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: './public/image_webapp/g_Imagefield/' });
const formsViews = require('../controllers/formsControllers');

router.get('/forms',formsViews.list); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/save',formsViews.save); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/edit',formsViews.edit); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/update',formsViews.update); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/check',formsViews.check); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/delete',formsViews.delete); //เข้าหน้ารายชื่อ ฟอร์ม
router.post('/forms/qrcode',formsViews.genQrcode); //สร้าง qrcode 

router.get('/forms_res',formsViews.forms_res);//ฟอร์มที่มีการตอบกลับ
router.post('/forms_res/list',formsViews.forms_res_list);
router.get('/forms_res/findvalue_res:id',formsViews.value_reslist);//แสดงข้อมูลตอบกลับของแบบฟอร์ม
router.post('/forms_res/edit',formsViews.value_edit);
router.post('/value_res/update:id',upload.any(),formsViews.value_update);
router.post('/value_res/delete',formsViews.value_delete); //ลบข้อมูลตอบกลับ
module.exports = router;