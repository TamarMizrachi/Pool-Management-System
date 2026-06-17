const express = require('express');
const router = express.Router(); 
const ScheduleController = require('../controllers/scheduleController');
const verifyToken = require('../middleware/authMiddleware');


router.get('/', ScheduleController.getAllSlots);
router.post('/', ScheduleController.createSlot);
router.put('/:id', ScheduleController.updateSlot);
router.delete('/:id', ScheduleController.deleteSlot);

router.get('/my-appointments', verifyToken, ScheduleController.getMyAppointments);
router.post('/appointment/register', verifyToken, ScheduleController.registerToSlot);
router.delete('/appointment/cancel', verifyToken, ScheduleController.cancelAppointment);

module.exports = router;
