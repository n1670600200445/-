const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: './public/image_webapp/g_Imagefield/' });
const personnelAlertsViews = require('../controllers/personnelAlertsControllers');
//!------------------------------------------------------------เจ้าหน้าที่รับเหตุ----------------------------------------------
router.get('/personnelAlerts',personnelAlertsViews.index); 
router.get('/personnelAlerts/list',personnelAlertsViews.list); //เข้าหน้ารายการแจ้งเหตุmี่ประชาชนเป็นคนแจ้งมา
router.get('/personnelAlerts/findvalue_res:id',personnelAlertsViews.value_reslist_ps); //เจ้าหน้าที่ปิดงานสำเร็จ

router.get('/personnelAlerts/menu:id',personnelAlertsViews.menu_ps); 
router.get('/personnelAlerts/add_m:id',personnelAlertsViews.notify_m);
router.get('/personnelAlerts/add_s:id',personnelAlertsViews.notify_s); 
router.post('/personnelAlerts/save:id',upload.any(),personnelAlertsViews.save);
router.post('/personnelAlerts/create',personnelAlertsViews.notify_showform_ps);

router.get('/personnelAlerts/get/alerts:idalerts',personnelAlertsViews.getJob); //เจ้าหน้าที่รับงาน
router.post('/personnelAlerts/get/success:idalerts',personnelAlertsViews.jobSuccess); //เจ้าหน้าที่ปิดงานสำเร็จ
router.post('/personnelAlerts/get/failed:idalerts',personnelAlertsViews.jobFailed); //เจ้าหน้าที่ปิดงานไม่สำเร็จ

router.get('/personnelAlerts/alertstype',personnelAlertsViews.alertstype); //เจ้าหน้าที่ดูรายการเหตุที่หน่วยงานตัวเองรับผิดชอบ
router.get('/personnelAlerts/getalerts',personnelAlertsViews.getalerts); //เจ้าหน้าที่ดูรายการเหตุที่ตัวเองกำลังดำเนินการ
router.get('/personnelAlerts/alerts_success',personnelAlertsViews.alerts_success); //เจ้าหน้าที่ดูรายการเหตุที่ตัวเองทำสำเร็จแล้ว
router.get('/personnelAlerts/alerts_failed',personnelAlertsViews.alerts_failed); //เจ้าหน้าที่ดูรายการเหตุที่ตัวเองไม่สำเร็จ




module.exports = router;