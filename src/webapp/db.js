export const ALL_LINES = "allLines";
export const SUBSCRIPTIONS = "subscriptions";

const dbIsAvailable = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getItem = key => {
  if (!dbIsAvailable) {
    return null;
  }

  const result = window.localStorage.getItem(key);
  if (result === null) {
    return null;
  }
  return JSON.parse(result);
};

export const getAllSubsciptions = () => getItem(SUBSCRIPTIONS) || {};

export const getLineSubscription = lineID => {
  const subscriptions = getAllSubsciptions();
  return subscriptions[lineID] || [];
};

export const getLines = () => getItem(ALL_LINES) || [];

export const deleteAllSubscriptions = () => {
  if (dbIsAvailable) {
    window.localStorage.setItem(SUBSCRIPTIONS, JSON.stringify({}));
  }
};

export const saveLineSubscription = (lineID, timeSlots) => {
  if (dbIsAvailable) {
    const subscriptions = getAllSubsciptions();
    subscriptions[lineID] = timeSlots;
    window.localStorage.setItem(SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }
};

export const saveLines = lines => {
  if (dbIsAvailable) {
    window.localStorage.setItem(ALL_LINES, JSON.stringify(lines));
  }
};
