"use client";

import { Loader2, Search } from "lucide-react";
import { Input } from "../../../../../components/ui/input";

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  setShowResults,
  isLoading,
  disabled,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  disabled?: boolean;
}) => (
  <div className="flex gap-2">
    <div className="relative flex-1">
      <Input
        placeholder="Search for a song..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        disabled={disabled}
        className="pr-10"
      />
      {isLoading ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  </div>
);

export default SearchInput;
