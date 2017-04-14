"use strict";

class SubscriptionController {
    constructor(callback, jsonResponse) {
        this.callback = callback;
        this.jsonResponse = jsonResponse;
    }

    subscribeAction() {
        const data = {"message": "All data"};
        this.callback(null, this.jsonResponse.createResponse(data));
    }

    unsubscribeAction() {
        const data = {"status": "Unsubscribed"};
        this.callback(null, this.jsonResponse.createResponse(data));
    }
}

module.exports = SubscriptionController;
