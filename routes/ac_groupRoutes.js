const express = require('express');
const router = express.Router();

const ac_groupController = require('../controllers/ac_groupController');
const osmoController    = require('../controllers/osmoController'); // ← ใช้ personnel

// กลุ่ม
router.get('/group/list', ac_groupController.list);
router.get('/group/search', ac_groupController.search);
router.post('/group/add/:id', ac_groupController.add);
router.post('/group/delete/:id', ac_groupController.delete);

// อสม.
router.get('/osmo/list', osmoController.list);                     // dropdown
router.get('/osmo/:osmoId/members', ac_groupController.listByOsmo);
router.post('/osmo/assign/:memberId', ac_groupController.assignMember);
router.post('/osmo/:osmoId/unassign/:memberId', ac_groupController.unassignMember);
router.get('/osmo/search', osmoController.search);

// อุณหภูมิ
router.get('/temp-dataset/:memberId', ac_groupController.getByMemberId);
router.get('/temp-dataset', ac_groupController.getAll);

module.exports = router;
