"use strict";

const DateTimeHelper = require("../../src/helpers/DateTimeHelper");

test("sets and gets now", () => {
    const value = "now";
    const helper = new DateTimeHelper(value);
    expect(helper.getNow()).toBe(value);
});

test("tube day for midday", () => {
    const mockFormatMethod = jest.fn();
    const mockMoment = {
        hours: () => 12,
        format: mockFormatMethod
    };

    const helper = new DateTimeHelper();
    helper.getTubeDate(mockMoment);

    expect(mockFormatMethod.mock.calls[0][0]).toBe("DD-MM-YYYY");
});

test("tube day for night time", () => {
    const mockFormatMethod = jest.fn();
    const mockSubtractMethod = jest.fn();
    const mockMoment = {
        hours: () => 3,
        format: mockFormatMethod,
        subtract: mockSubtractMethod
    };

    const helper = new DateTimeHelper();
    helper.getTubeDate(mockMoment);

    expect(mockFormatMethod.mock.calls[0][0]).toBe("DD-MM-YYYY");
    expect(mockSubtractMethod.mock.calls[0][0]).toBe(1);
    expect(mockSubtractMethod.mock.calls[0][1]).toBe("days");
});
