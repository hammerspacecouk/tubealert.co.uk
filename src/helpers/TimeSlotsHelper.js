"use strict";

class TimeSlotsHelper {
    constructor(data) {
        this.data = data;
    }

    pad(str) {
        const pad = '00';
        str = '' + str; // converts to string
        return pad.substring(0, pad.length - str.length) + str;
    }

    getPuts(subscription, lineID, now) {
        const puts = [];
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
                    Created: now.toISOString(),
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
        // return only the ones that don't exist in the new data set
        const deletable = currentData.filter(item => !(this.data[item.Day] && this.data[item.Day][item.Hour]));
        return deletable.map(item => ({
            DeleteRequest : {
                Key: {
                    UserID: item.UserID,
                    LineSlot: item.LineSlot
                }
            }
        }));
    }
}

module.exports = TimeSlotsHelper;
