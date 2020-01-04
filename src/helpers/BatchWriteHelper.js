const MAX_BATCH_SIZE = 25;

class BatchWriteHelper {
  constructor(documentClient, tableName, logger) {
    this.documentClient = documentClient;
    this.tableName = tableName;
    this.logger = logger;
  }

  makeRequests(requests, inputTotal) {
    const total = inputTotal || requests.length;

    if (requests.length === 0) {
      // nothing to do. get out and return the original count
      return total;
    }

    // can only process 25 at a time
    const toProcess = requests.slice(0, MAX_BATCH_SIZE);
    let remaining = requests.slice(MAX_BATCH_SIZE);
    this.logger.info(`Processing ${toProcess.length} items`);

    // perform the batch request
    const params = {
      RequestItems: {},
    };
    params.RequestItems[this.tableName] = toProcess;

    return this.documentClient
      .batchWrite(params)
      .promise()
      .then(data => {
        // put any UnprocessedItems back onto remaining list
        if ("UnprocessedItems" in data && this.tableName in data.UnprocessedItems) {
          remaining = remaining.concat(data.UnprocessedItems[this.tableName]);
        }
        return remaining;
      })
      .then(remainingResult => this.makeRequests(remainingResult, total));
  }
}

module.exports = BatchWriteHelper;
