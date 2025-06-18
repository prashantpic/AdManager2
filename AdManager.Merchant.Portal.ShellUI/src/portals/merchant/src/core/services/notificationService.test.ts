import notificationService from './notificationService';
import { store } from '../state/store'; // Actual store
import { addNotification, NotificationPayload } from '../state/slices/uiSlice'; // Actual action

// Mock the Redux store's dispatch method
jest.mock('../state/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
        ui: { notifications: [], themeMode: 'light', globalLoading: false },
        merchantContext: { profile: null, isLoading: false, error: null },
    })), // Provide a basic mock for getState if needed by other parts of store setup
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
}));

describe('notificationService', () => {
  const mockDispatch = store.dispatch as jest.Mock;

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('showSuccess dispatches addNotification with correct payload', () => {
    const message = 'Operation successful!';
    notificationService.showSuccess(message);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toEqual(addNotification.type);
    expect(dispatchedAction.payload.message).toEqual(message);
    expect(dispatchedAction.payload.type).toEqual('success');
    expect(dispatchedAction.payload.autoHideDuration).toEqual(6000); // Default
    expect(dispatchedAction.payload.id).toBeUndefined(); // No ID passed
  });

  it('showSuccess dispatches addNotification with custom autoHideDuration and id', () => {
    const message = 'Success with custom duration and ID!';
    const duration = 3000;
    const customId = "custom-success-id";
    notificationService.showSuccess(message, duration, customId);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.payload.message).toEqual(message);
    expect(dispatchedAction.payload.type).toEqual('success');
    expect(dispatchedAction.payload.autoHideDuration).toEqual(duration);
    expect(dispatchedAction.payload.id).toEqual(customId);
  });

  it('showError dispatches addNotification with correct payload', () => {
    const message = 'An error occurred!';
    notificationService.showError(message);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toEqual(addNotification.type);
    expect(dispatchedAction.payload.message).toEqual(message);
    expect(dispatchedAction.payload.type).toEqual('error');
    expect(dispatchedAction.payload.autoHideDuration).toEqual(8000); // Default
  });

  it('showWarning dispatches addNotification with correct payload', () => {
    const message = 'Warning: please check.';
    notificationService.showWarning(message, 5000);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toEqual(addNotification.type);
    expect(dispatchedAction.payload.message).toEqual(message);
    expect(dispatchedAction.payload.type).toEqual('warning');
    expect(dispatchedAction.payload.autoHideDuration).toEqual(5000); // Custom
  });

  it('showInfo dispatches addNotification with correct payload', () => {
    const message = 'Information for you.';
    notificationService.showInfo(message);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toEqual(addNotification.type);
    expect(dispatchedAction.payload.message).toEqual(message);
    expect(dispatchedAction.payload.type).toEqual('info');
    expect(dispatchedAction.payload.autoHideDuration).toEqual(5000); // Default
  });
});