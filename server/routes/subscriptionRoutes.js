const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscriptionController');
const verifyToken = require('../middleware/authMiddleware'); 

router.get('/my-subscription', verifyToken, SubscriptionController.getMySubscription);
router.post('/purchase', verifyToken, SubscriptionController.purchaseSubscription);

module.exports = router;