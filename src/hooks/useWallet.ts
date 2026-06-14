import { useEffect, useCallback } from 'react';
import { useWalletStore } from '../store/walletStore';

export const useWallet = () => {
  const {
    account,
    chainId,
    isConnecting,
    error,
    setAccount,
    setChainId,
    setIsConnecting,
    setError,
  } = useWalletStore();

  const switchChain = useCallback(async (targetChainId: string) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to switch network. The network might not be added to your wallet.');
    }
  }, [setError]);

  const switchAccount = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to switch account');
    }
  }, [setError]);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Ethereum wallet not found. Please install MetaMask or another compatible wallet.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [setAccount, setError, setIsConnecting]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
  }, [setAccount]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      const handleChainChanged = (chain: unknown) => {
        setChainId(chain as string);
      };
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          const accs = accounts as string[];
          if (accs.length > 0) {
            setAccount(accs[0]);
          }
        })
        .catch(console.error);

      // Fetch initial chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chain: unknown) => setChainId(chain as string))
        .catch(console.error);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [setAccount, setChainId]);

  return {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchChain,
    switchAccount,
  };
};
