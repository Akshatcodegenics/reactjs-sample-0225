
import { renderHook, act } from '@testing-library/react';
import { useWeb3 } from '../useWeb3';

// Mock ethers
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn(() => ({
    getBalance: jest.fn(() => Promise.resolve(BigInt('1000000000000000000'))), // 1 ETH
  })),
  formatEther: jest.fn(() => '1.0'),
}));

// Mock toast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
}));

describe('useWeb3', () => {
  beforeEach(() => {
    // Mock window.ethereum
    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: {
        request: jest.fn(),
      },
    });
    mockToast.mockClear();
  });

  test('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWeb3());
    
    expect(result.current.account).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.balance).toBe('0');
  });

  test('connects wallet successfully', async () => {
    const mockAccounts = ['0x1234567890abcdef1234567890abcdef12345678'];
    const mockRequest = window.ethereum!.request as jest.Mock;
    mockRequest.mockResolvedValue(mockAccounts);
    
    const { result } = renderHook(() => useWeb3());
    
    await act(async () => {
      await result.current.connectWallet();
    });
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.account).toBe(mockAccounts[0]);
  });

  test('disconnects wallet', () => {
    const { result } = renderHook(() => useWeb3());
    
    act(() => {
      result.current.disconnectWallet();
    });
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.account).toBeNull();
    expect(result.current.balance).toBe('0');
  });
});
