const response = {
  json: () => [
    {
      id: "line2",
      lineStatuses: [
        {
          statusSeverity: 10,
          statusSeverityDescription: "A",
          reason: "OK-A",
        },
      ],
    },
    {
      id: "line3",
      lineStatuses: [
        {
          statusSeverity: 10,
          statusSeverityDescription: "B",
          reason: "OK-B",
        },
        {
          statusSeverity: 2,
          statusSeverityDescription: "C",
        },
        {
          statusSeverity: 1,
          statusSeverityDescription: "D",
          reason: "NOTOK-D1",
        },
        {
          statusSeverity: 1,
          statusSeverityDescription: "D",
          reason: "NOTOK-D2",
        },
      ],
    },
  ],
};

module.exports = () => new Promise(resolve => resolve(response));
