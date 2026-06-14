import { create } from 'zustand';

interface WalletState {
  account: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
  setAccount: (account: string | null) => void;
  setChainId: (chainId: string | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  account: null,
  chainId: null,
  isConnecting: false,
  error: null,
  setAccount: (account) => set({ account }),
  setChainId: (chainId) => set({ chainId }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error }),
}));
