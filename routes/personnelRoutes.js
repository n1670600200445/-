const express = require('express');
const router = express.Router();

const personnelViews = require('../controllers/personnelControllers');

router.get('/personnel',personnelViews.list); //เข้าหน้ารายชื่อ PERSONNEL
router.post('/personnel/save',personnelViews.save); //เพิ่มรายชื่อ PERSONNEL
router.post('/personnel/edit',personnelViews.edit); //เข้าหน้าแก้ไขรายชื่อ PERSONNEL
router.post('/personnel/update',personnelViews.update); //แก้ไขรายชื่อ PERSONNEL
router.post('/personnel/checkdelete',personnelViews.checkdelete);//ยืนยันการลบข้อมูล
router.post('/personnel/delete',personnelViews.delete);//ยืนยันการลบข้อมูล

module.exports = router;