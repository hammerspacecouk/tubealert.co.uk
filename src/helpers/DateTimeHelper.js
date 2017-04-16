

class DateTimeHelper {
  /**
   * @param nowMoment Moment
   */
  constructor(nowMoment) {
    this.now = nowMoment;
  }

  getNow() {
    return this.now;
  }

  static getTubeDate(momentDate) {
    const hour = momentDate.hours();
    const date = momentDate;
    if (hour <= 3) {
      // the tube date is yesterday
      date.subtract(1, 'days');
    }
    return date.format('DD-MM-YYYY');
  }
}

module.exports = DateTimeHelper;
