import uiReducer, {
  setThemeMode,
  setGlobalLoading,
  addNotification,
  removeNotification,
  initializeTheme,
  UIState,
  NotificationPayload,
} from './uiSlice';

describe('uiSlice', () => {
  const initialState: UIState = {
    themeMode: 'light',
    globalLoading: false,
    notifications: [],
  };

  afterEach(() => {
    localStorage.clear(); // Clear localStorage after each test
  });


  it('should return the initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setThemeMode', () => {
    it('should handle setThemeMode to dark', () => {
      const actual = uiReducer(initialState, setThemeMode('dark'));
      expect(actual.themeMode).toEqual('dark');
      expect(localStorage.getItem('themeMode')).toEqual('dark');
    });

    it('should handle setThemeMode to light', () => {
      const darkState = { ...initialState, themeMode: 'dark' as 'dark' };
      localStorage.setItem('themeMode', 'dark');
      const actual = uiReducer(darkState, setThemeMode('light'));
      expect(actual.themeMode).toEqual('light');
      expect(localStorage.getItem('themeMode')).toEqual('light');
    });
  });

  describe('initializeTheme', () => {
    it('should initialize theme from localStorage if set to dark', () => {
      localStorage.setItem('themeMode', 'dark');
      const actual = uiReducer(initialState, initializeTheme());
      expect(actual.themeMode).toEqual('dark');
    });

    it('should initialize theme from localStorage if set to light', () => {
      localStorage.setItem('themeMode', 'light');
      const actual = uiReducer(initialState, initializeTheme());
      expect(actual.themeMode).toEqual('light');
    });

    it('should default to light if localStorage is not set and system preference is not dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)' ? false : false, // Simulates no dark preference
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      const actual = uiReducer(initialState, initializeTheme());
      expect(actual.themeMode).toEqual('light');
      expect(localStorage.getItem('themeMode')).toEqual('light');
    });

    it('should default to dark if localStorage is not set and system preference is dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)' ? true : false, // Simulates dark preference
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      const actual = uiReducer(initialState, initializeTheme());
      expect(actual.themeMode).toEqual('dark');
      expect(localStorage.getItem('themeMode')).toEqual('dark');
    });
  });


  it('should handle setGlobalLoading', () => {
    const actual = uiReducer(initialState, setGlobalLoading(true));
    expect(actual.globalLoading).toEqual(true);
  });

  describe('addNotification', () => {
    it('should add a notification with a generated id if none provided', () => {
      const notification: Omit<NotificationPayload, 'id'> = { message: 'Test notification', type: 'info' };
      const actual = uiReducer(initialState, addNotification(notification));
      expect(actual.notifications).toHaveLength(1);
      expect(actual.notifications[0].message).toEqual('Test notification');
      expect(actual.notifications[0].id).toBeDefined();
      expect(actual.notifications[0].id).toMatch(/^notification_\d{13}_[a-z0-9]{7}$/);
    });

    it('should add a notification with a provided id', () => {
      const notification: NotificationPayload = { id: 'custom-id', message: 'Test notification', type: 'success' };
      const actual = uiReducer(initialState, addNotification(notification));
      expect(actual.notifications).toHaveLength(1);
      expect(actual.notifications[0].id).toEqual('custom-id');
    });
  });

  describe('removeNotification', () => {
    it('should remove a notification by id', () => {
      const notification1: NotificationPayload = { id: 'id-1', message: 'Test 1', type: 'info' };
      const notification2: NotificationPayload = { id: 'id-2', message: 'Test 2', type: 'success' };
      const stateWithNotifications: UIState = { ...initialState, notifications: [notification1, notification2] };

      const actual = uiReducer(stateWithNotifications, removeNotification('id-1'));
      expect(actual.notifications).toHaveLength(1);
      expect(actual.notifications[0].id).toEqual('id-2');
    });

    it('should not change notifications if id not found', () => {
      const notification1: NotificationPayload = { id: 'id-1', message: 'Test 1', type: 'info' };
      const stateWithNotifications: UIState = { ...initialState, notifications: [notification1] };

      const actual = uiReducer(stateWithNotifications, removeNotification('non-existent-id'));
      expect(actual.notifications).toHaveLength(1);
      expect(actual.notifications[0].id).toEqual('id-1');
    });
  });
});