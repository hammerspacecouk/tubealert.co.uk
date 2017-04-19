import { saveLineSubscription, getLineSubscription, deleteAllSubscriptions } from '../../db';

export const SUBSCRIPTION_RECEIVE = 'SUBSCRIPTION_RECEIVE';
export const receiveSubscriptions = (lineID, data) => ({
  type: SUBSCRIPTION_RECEIVE,
  line: lineID,
  subscription: data
});

export const saveSubscription = (lineID, data) => (dispatch) => {
  saveLineSubscription(lineID, data);
  dispatch(receiveSubscriptions(lineID, data));
};

export const readSubscriptions = lineID => (dispatch) => {
  dispatch(receiveSubscriptions(lineID, getLineSubscription(lineID)));
};

export const unsubscribe = () => deleteAllSubscriptions;

