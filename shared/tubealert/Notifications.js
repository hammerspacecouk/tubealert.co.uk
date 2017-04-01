"use strict";

const Webpush = require('web-push');
const fetch = require("node-fetch");
const STATIC_HOST = 'https://beta.tubealert.co.uk/';

class Notifications {
    constructor(publicKey, privateKey) {
        Webpush.setGCMAPIKey('1049276846959');
        Webpush.setVapidDetails(
            'mailto:contact@hammerspace.co.uk',
            publicKey,
            privateKey
        );
        this.manifest = null;
    }

    makePayload(manifest, lineData) {
        return JSON.stringify({
            title: lineData.name,
            body: lineData.statusSummary,
            icon: STATIC_HOST + manifest["icon-" + lineData.urlKey + ".png"],
            tag: "/" + lineData.urlKey
        })
    }

    getPayload(lineData) {
        if (this.manifest) {
            return this.makePayload(this.manifest, lineData);
        }
        return fetch(STATIC_HOST + "assets-manifest.json")
            .then(res => res.json())
            .then(manifest => {
                this.manifest = manifest;
                return this.makePayload(manifest, lineData)
            })
    }

    send(subscription, lineData) {
        return this.getPayload(lineData)
            .then(payload => {
                return Webpush.sendNotification(
                    subscription,
                    payload
                )
            });
    }
}

module.exports = Notifications;
