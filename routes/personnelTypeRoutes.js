const express = require('express');
const router = express.Router();

const personnelViews = require('../controllers/personnelTypeControllers');

router.get('/personneltype',personnelViews.list); //เข้าหน้ารายชื่อหน่วยงาน
router.post('/personneltype/save',personnelViews.save); //เพิ่มรายชื่อหน่วยงาน
router.post('/personneltype/update',personnelViews.update); //แก้ไขรายชื่อหน่วยงาน
router.post('/personneltype/delete',personnelViews.delete);//ยืนยันการลบข้อมูลเข้าหน้ารายชื่อหน่วยงาน
//!----------------------------------------------------------Route ดูรายชื่อเจ้าหน้าที่ในหน่วยงาน -------------------------------------------------------
router.get('/personneltype/name:id',personnelViews.listname); //เข้าหน้ารายชื่อเจ้าหน้าที่ที่อยู่ในหน่วยงาน
router.post('/personneltype/savename',personnelViews.savename); //เพิ่มรายชื่อหน่วยงาน
router.post('/personneltype/updatename',personnelViews.updatename); //แก้ไขรายชื่อหน่วยงาน
router.post('/personneltype/deletename',personnelViews.deletename);//ยืนยันการลบข้อมูล

module.exports = router;