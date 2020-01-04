class TimeSlotsHelper {
  constructor(data) {
    this.data = data;
  }

  static pad(input) {
    const pad = "00";
    const str = `${input}`; // converts to string
    return `${pad.substring(0, pad.length - str.length)}${str}`;
  }

  getPuts(subscription, lineID, now) {
    const puts = [];
    const userID = subscription.endpoint;

    // loop through all of the data generating slot items
    for (let day = 0; day < 7; day += 1) {
      if (this.data[day]) {
        let start = null;
        const dayData = this.data[day];
        for (let hour = 0; hour < 24; hour += 1) {
          if (dayData[hour]) {
            if (start === null) {
              start = hour;
            }
            puts.push(TimeSlotsHelper.createHourSlot(lineID, userID, day, hour, start, now, subscription));
          } else {
            start = null;
          }
        }
      }
    }
    return puts;
  }

  static createHourSlot(lineID, userID, day, hour, start, now, subscription) {
    const lineSlot = `${lineID}_${TimeSlotsHelper.pad(day)}${TimeSlotsHelper.pad(hour)}`;
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
    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  getDeletes(currentData) {
    // return only the ones that don't exist in the new data set
    const deletable = currentData.filter(item => !(this.data[item.Day] && this.data[item.Day][item.Hour]));
    return deletable.map(item => ({
      DeleteRequest: {
        Key: {
          UserID: item.UserID,
          LineSlot: item.LineSlot,
        },
      },
    }));
  }
}

module.exports = TimeSlotsHelper;
