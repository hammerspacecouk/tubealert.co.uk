"use strict";

const Webpush = require('web-push');

class Notifications {
    constructor(publicKey, privateKey) {
        Webpush.setGCMAPIKey('1049276846959');
        Webpush.setVapidDetails(
            'mailto:contact@hammerspace.co.uk',
            publicKey,
            privateKey
        );
    }

    makePayload(lineData) {
        return {
            title: lineData.name,
            body: lineData.statusSummary,
            icon: "http://localhost:8080/icon-" + lineData.urlKey + ".png",
            tag: "/" + lineData.urlKey
        }
    };

    send(subscription, lineData) {
        return Webpush.sendNotification(
            subscription,
            JSON.stringify(this.makePayload(lineData))
        )
    }
}

module.exports = Notifications;
