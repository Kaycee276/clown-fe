import { useState, useMemo } from "react";
import { NETWORKS } from "../utils/networks";

interface NetworkSelectorProps {
  currentChainId: string | null;
  onSelect: (chainId: string) => void;
  onBack: () => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  currentChainId,
  onSelect,
  onBack,
}) => {
  const [search, setSearch] = useState("");

  const filteredNetworks = useMemo(() => {
    return Object.entries(NETWORKS).filter((entry) =>
      entry[1].toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="flex flex-col gap-3 max-h-[350px] overflow-hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="font-medium text-sm flex-1">Select Network</span>
      </div>

      <div className="px-1">
        <input
          type="text"
          placeholder="Search networks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
        />
      </div>

      <div
        className="flex flex-col gap-1 overflow-y-auto pr-1 pb-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
        }}
      >
        {filteredNetworks.length > 0 ? (
          filteredNetworks.map(([id, name]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`text-left text-sm p-3 rounded-lg cursor-pointer transition-colors ${
                currentChainId === id
                  ? "bg-black/90 text-green-300"
                  : "hover:bg-white/10"
              }`}
            >
              {name}
            </button>
          ))
        ) : (
          <p className="text-center text-sm text-white/50 py-4">
            No networks found
          </p>
        )}
      </div>
    </div>
  );
};
