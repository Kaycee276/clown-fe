import React, { useState, useRef, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { AnimatePresence, motion } from "framer-motion";
import { NetworkSelector } from "./NetworkSelector";
import { NETWORKS } from "../utils/networks";

export const WalletConnectButton: React.FC = () => {
  const {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchChain,
    switchAccount,
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsNetworkOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getNetworkName = (id: string | null) => {
    if (!id) return "Unknown Network";
    return NETWORKS[id] || `Network ID: ${Number(id)}`;
  };

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleButtonClick = () => {
    if (account) {
      if (isOpen) {
        setIsNetworkOpen(false);
      }
      setIsOpen(!isOpen);
    } else {
      connectWallet();
    }
  };

  return (
    <div className="relative flex flex-col items-end" ref={dropdownRef}>
      {error && (
        <p className="text-red-400 text-sm font-sans absolute -top-8 right-0 whitespace-nowrap">
          {error}
        </p>
      )}

      <button
        onClick={handleButtonClick}
        disabled={isConnecting}
        className="liquid-glass-btn relative group overflow-hidden rounded-full px-6 py-3 font-bold text-base tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="relative z-10 text-white font-['Black_Ops_One']">
          {isConnecting
            ? "Connecting..."
            : account
              ? formatAddress(account)
              : "Connect Wallet"}
        </span>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 rounded-full pointer-events-none"></div>
      </button>

      <AnimatePresence>
        {isOpen && account && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 backdrop-blur-[2px] bg-black/30"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsNetworkOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && account && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="absolute top-full right-0 mt-4 p-4 rounded-2xl flex flex-col gap-3 min-w-[280px] liquid-glass-dropdown z-50 text-white origin-top-right overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isNetworkOpen ? (
                <motion.div
                  key="main-menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                <button
                  onClick={() => setIsNetworkOpen(true)}
                  className="flex justify-between items-center bg-black/90 hover:bg-black/70 transition-colors rounded-xl p-3 cursor-pointer w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tracking-wide">
                      {getNetworkName(chainId)}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="flex justify-between items-center bg-black/90 rounded-xl p-3">
                  <span className="text-sm font-mono tracking-wider opacity-90">
                    {formatAddress(account)}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-white hover:text-blue-400 transition-colors ml-2 p-1 bg-white/5 rounded-md hover:bg-white/10 cursor-pointer"
                    title="Copy Address"
                  >
                    {copied ? (
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    switchAccount();
                    setIsOpen(false);
                    setIsNetworkOpen(false);
                  }}
                  className="mt-2 w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors font-medium flex items-center justify-center gap-2 tracking-wide cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  Switch Account
                </button>

                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsOpen(false);
                    setIsNetworkOpen(false);
                  }}
                  className="mt-1 w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors font-medium flex items-center justify-center gap-2 tracking-wide cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Disconnect
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="network-selector"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <NetworkSelector
                  currentChainId={chainId}
                  onBack={() => setIsNetworkOpen(false)}
                  onSelect={(id) => {
                    switchChain(id);
                    setIsNetworkOpen(false);
                  }}
                />
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
