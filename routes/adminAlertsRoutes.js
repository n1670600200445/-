const express = require('express');
const router = express.Router();

const adminAlerts = require('../controllers/adminAlertsControllers');

router.get('/admin/alerts',adminAlerts.list); //เข้าหน้ารายการแจ้งเหตุ
router.post('/admin/alerts/save',adminAlerts.save); //เพิ่มรายการแจ้งเหตุ
router.get('/admin/alerts/edit:id',adminAlerts.edit); //เข้าหน้าแก้ไขรายการแจ้งเหตุ
router.post('/admin/alerts/update:id',adminAlerts.update); //แก้ไขรายการแจ้งเหตุ
router.get('/admin/alerts/delete:id',adminAlerts.delete);//ยืนยันการลบข้อมูล
module.exports = router;