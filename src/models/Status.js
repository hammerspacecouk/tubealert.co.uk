const TABLE_NAME_STATUSES = 'tubealert.co.uk_statuses';

class Status {
  constructor(documentClient, dateTimeHelper, lineModel, config, logger) {
    this.documentClient = documentClient;
    this.dateTimeHelper = dateTimeHelper;
    this.config = config;
    this.lineModel = lineModel;
    this.logger = logger;

    this.severities = this.lineModel.getSeverities();
  }

  storeStatus(date, data) {
    const tubeDate = this.dateTimeHelper.getTubeDate(date);
    const params = {
      TableName: TABLE_NAME_STATUSES,
      Item: {
        TubeDate: tubeDate,
        Timestamp: date.unix(),
        Statuses: data,
      },
    };
    this.logger.info(`Storing data for ${tubeDate}`);
    return this.documentClient.put(params).promise()
      .then(() => data);
  }

  fetchNewLatest() {
    const now = this.dateTimeHelper.getNow();
    const url = 'https://api.tfl.gov.uk/Line/Mode/tube,dlr,tflrail,overground/Status' +
      `?app_id=${this.config.TFL_APP_ID}` +
      `&app_key=${this.config.TFL_APP_KEY}`;

    this.logger.info('Fetching from TFL');
    // only include this require on invocation (so the memory is cleared)
    return require('node-fetch')(url) // eslint-disable-line global-require
      .then(response => response.json())
      .then(this.mutateData.bind(this))
      .then(data => this.storeStatus(now, data));
  }

  makeStatusItem(originalLineData, lineStatus) {
    const now = this.dateTimeHelper.getNow();
    // create a copy of the lineData object
    const lineData = Object.assign({}, originalLineData);

    // set some defaults
    delete lineData.tflKey;
    lineData.isDisrupted = null;
    lineData.updatedAt = now.toISOString();
    lineData.statusSummary = 'No Information';
    lineData.latestStatus = {
      updatedAt: now.toISOString(),
      isDisrupted: null,
      title: 'No Information',
      shortTitle: 'No Information',
      descriptions: null,
    };

    if (lineStatus) {
      const sortedStatuses = lineStatus.lineStatuses.sort((a, b) => (
        this.severities[a.statusSeverity].displayOrder -
        this.severities[b.statusSeverity].displayOrder
      ));

      // get sorted titles and reasons, ensuring unique values
      const titles = sortedStatuses.map(s => s.statusSeverityDescription)
        .filter((value, index, self) => (self.indexOf(value) === index));
      const reasons = sortedStatuses.map(s => s.reason || null)
        .filter((value, index, self) => (value !== null && self.indexOf(value) === index));

      lineData.latestStatus.isDisrupted = sortedStatuses.reduce((value, status) => {
        if (this.severities[status.statusSeverity].disrupted) {
          return true;
        }
        return value;
      }, false);
      lineData.latestStatus.title = titles.join(', ');
      lineData.latestStatus.shortTitle = titles.slice(0, 2).join(', ');
      lineData.latestStatus.descriptions = reasons;

      lineData.isDisrupted = lineData.latestStatus.isDisrupted;
      lineData.statusSummary = lineData.latestStatus.shortTitle;
    }

    return lineData;
  }

  mutateData(data) {
    // work through all of the lines we want in order
    // and build up a JSON object of their statuses
    this.logger.info('Manipulating result into preferred format');
    return this.lineModel.getAll().map((lineData) => {
      const lineStatus = data.find(status => status.id === lineData.tflKey);

      return this.makeStatusItem(lineData, lineStatus);
    });
  }

  getAllLatest(date) {
    const tubeDate = this.dateTimeHelper.getTubeDate(date);
    this.logger.info(`Getting current status for ${tubeDate}`);
    const params = {
      TableName: TABLE_NAME_STATUSES,
      KeyConditionExpression: '#date = :date',
      ExpressionAttributeNames: {
        '#date': 'TubeDate',
      },
      ExpressionAttributeValues: {
        ':date': tubeDate,
      },
      ScanIndexForward: false,
    };
    return this.documentClient.query(params).promise()
      .then((result) => {
        if (result.Items.length > 0) {
          return result.Items[0].Statuses;
        }
        return [];
      });
  }

  getLatestDisrupted(date) {
    return this.getAllLatest(date)
      .then(statuses => statuses.filter(line => line.isDisrupted));
  }
}

module.exports = Status;
