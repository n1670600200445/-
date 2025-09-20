const express = require('express');
const router = express.Router();

const adminViews = require('../controllers/adminControllers');

router.get('/admin',adminViews.list); //เข้าหน้ารายชื่อ ADMIN
router.post('/admin/save',adminViews.save); //เพิ่มรายชื่อ ADMIN
router.post('/admin/update',adminViews.update); //แก้ไขรายชื่อ ADMIN
router.post('/admin/delete',adminViews.delete);//ยืนยันการลบข้อมูล

module.exports = router;