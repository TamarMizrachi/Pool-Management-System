const SubscriptionModel = require('../models/subscriptionModel');

const SubscriptionController = {

    async getMySubscription(req, res) {
        try {
            const userId = req.user.id;
            const subscription = await SubscriptionModel.getUserSubscription(userId);

            if (!subscription) {
                return res.json({ hasSubscription: false, message: 'אין מנוי קיים' });
            }

            if (subscription.status === 'active' && new Date(subscription.end_date) < new Date()) {

                await SubscriptionModel.updateToExpired(subscription.id);
                subscription.status = 'expired';
            }
            return res.json(subscription);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'שגיאה בבדיקת המנוי' });
        }
    },

  async purchaseSubscription(req, res) {
    try {
        const userId = req.user.id;

        const isCreated = await SubscriptionModel.createSubscription(userId);

        if (!isCreated) {
            return res.status(400).json({ message: 'לא ניתן לרכוש מנוי חדש כאשר קיים מנוי פעיל בתוקף' });
        }

        return res.status(201).json({ message: 'המנוי נרכש ועודכן בהצלחה בבסיס הנתונים!' });

    } catch (error) {
        console.error('Error in purchaseSubscription:', error);
        return res.status(500).json({ message: 'שגיאה בתהליך שמירת המנוי החדש' });
    }
}
};

module.exports = SubscriptionController;