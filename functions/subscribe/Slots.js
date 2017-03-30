'use strict';

class Slots {
    constructor(data) {
        this.data = data;
    }

    pad(str) {
        const pad = '00';
        str = '' + str; // converts to string
        return pad.substring(0, pad.length - str.length) + str;
    }

    getPuts(subscription, lineID) {
        const puts = [];
        const now = Date.now();
        const userID = subscription.endpoint;

        // loop through all of the data generating slot items
        for (let day = 0;day < 7; day++) {
            if (!this.data[day]) {
                continue;
            }
            let start = null;
            const dayData = this.data[day];
            for (let hour = 0; hour < 24; hour++) {
                if (!dayData[hour]) {
                    start = null;
                    continue;
                }
                if (start === null) {
                    start = hour;
                }

                const lineSlot = lineID + '_' + this.pad(day) + this.pad(hour);
                const item = {
                    UserID: userID,
                    LineSlot: lineSlot,
                    Line: lineID,
                    Day: day,
                    Hour: hour,
                    WindowStart: start,
                    Created: now,
                    Subscription: subscription,
                };
                puts.push({
                    PutRequest : {
                        Item: item
                    }
                });
            }
        }

        return puts;
    }

    getDeletes(currentData) {
        currentData = currentData.filter(item => {
            if (this.data[item.Day] && this.data[item.Day][item.Hour]) {
                // exists. do not delete
                return false;
            }
            // can be deleted
            return true;
        });
        const deletes = currentData.map(item => {
            return {
                DeleteRequest : {
                    Key: {
                        UserID: item.UserID,
                        LineSlot: item.LineSlot
                    }
                }
            }
        });

        return deletes;
    }
};

module.exports = Slots;