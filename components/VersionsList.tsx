import React, { useCallback } from "react";
import { useVersions } from "../hooks/useVersions";
import type { Version } from "../lib/types";

interface VersionsListProps {
  modelYearId: string;
  onSelect: (version: Version) => void;
}

const VersionCard: React.FC<{
  version: Version;
  onSelect: (v: Version) => void;
}> = React.memo(({ version, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(version);
  }, [onSelect, version]);

  return (
    <button
      className="bg-white dark:bg-gray-900 border rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={handleClick}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-2 rounded">
        <span className="text-gray-400 text-2xl">🏷️</span>
      </div>
      <span className="font-medium text-center text-sm mt-1">
        {version.name}
      </span>
    </button>
  );
});

export const VersionsList: React.FC<VersionsListProps> = React.memo(
  ({ modelYearId, onSelect }) => {
    const { versions, isLoading, isError } = useVersions(modelYearId);

    if (isLoading) return <div>Loading versions...</div>;
    if (isError) return <div>Error loading versions.</div>;
    if (!versions || versions.length === 0)
      return <div>No versions found.</div>;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {versions.map((version) => (
          <VersionCard key={version.id} version={version} onSelect={onSelect} />
        ))}
      </div>
    );
  }
);
