"use strict";

class StatusController {
    constructor(callback, dateTimeHelper, status, jsonResponseHelper, logger) {
        this.callback = callback;
        this.dateTimeHelper = dateTimeHelper;
        this.status = status;
        this.jsonResponseHelper = jsonResponseHelper;
        this.logger = logger;
    }

    latestAction() {
        return this.status.getAllLatest(this.dateTimeHelper.getNow())
            .then(data => {
                this.logger.info("Successfully fetched latest statuses");
                return this.callback(null, this.jsonResponseHelper.createResponse(data));
            })
            .catch(err => {
                this.logger.error(err);
                return this.callback(true, this.jsonResponseHelper.createErrorResponse(
                    "Failed to fetch latest status"
                ));
            });
    }
}

module.exports = StatusController;
