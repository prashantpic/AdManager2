import merchantContextReducer, {
  setMerchantContext,
  clearMerchantContext,
  setMerchantContextLoading,
  setMerchantContextError,
  MerchantContextState,
} from './merchantContextSlice';
import { UserProfile } from '../../auth/auth.types';

describe('merchantContextSlice', () => {
  const initialState: MerchantContextState = {
    profile: null,
    isLoading: false,
    error: null,
  };

  const mockUserProfile: UserProfile = {
    id: 'user-123',
    email: 'merchant@example.com',
    name: 'Merchant User',
    merchantId: 'merchant-abc',
    roles: ['merchant_owner'],
    permissions: ['manage_all'],
  };

  it('should return the initial state', () => {
    expect(merchantContextReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setMerchantContext', () => {
    const stateWithLoading: MerchantContextState = { ...initialState, isLoading: true, error: 'Previous error' };
    const actual = merchantContextReducer(stateWithLoading, setMerchantContext(mockUserProfile));
    expect(actual.profile).toEqual(mockUserProfile);
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toBeNull();
  });

  it('should handle clearMerchantContext', () => {
    const stateWithProfile: MerchantContextState = {
      ...initialState,
      profile: mockUserProfile,
      isLoading: false,
      error: 'Some error',
    };
    const actual = merchantContextReducer(stateWithProfile, clearMerchantContext());
    expect(actual.profile).toBeNull();
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toBeNull();
  });

  it('should handle setMerchantContextLoading to true', () => {
    const stateWithError: MerchantContextState = { ...initialState, error: 'Previous error' };
    const actual = merchantContextReducer(stateWithError, setMerchantContextLoading(true));
    expect(actual.isLoading).toBe(true);
    expect(actual.error).toBeNull(); // Error should be cleared when loading starts
  });

  it('should handle setMerchantContextLoading to false', () => {
    const stateWithLoading: MerchantContextState = { ...initialState, isLoading: true };
    const actual = merchantContextReducer(stateWithLoading, setMerchantContextLoading(false));
    expect(actual.isLoading).toBe(false);
  });

  it('should handle setMerchantContextError', () => {
    const stateWithLoading: MerchantContextState = { ...initialState, isLoading: true };
    const errorMessage = 'Failed to load merchant profile.';
    const actual = merchantContextReducer(stateWithLoading, setMerchantContextError(errorMessage));
    expect(actual.error).toEqual(errorMessage);
    expect(actual.isLoading).toBe(false);
  });

  it('should handle setMerchantContextError with null to clear error', () => {
    const stateWithError: MerchantContextState = { ...initialState, error: 'Some error' };
    const actual = merchantContextReducer(stateWithError, setMerchantContextError(null));
    expect(actual.error).toBeNull();
    expect(actual.isLoading).toBe(false); // isLoading should also be set to false as per logic
  });
});