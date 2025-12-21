// src/components/MemberSearchSelect.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";
import type { Member } from "@/types";

interface MemberSearchSelectProps {
  label?: string;
  value: Member | null;
  onChange: (member: Member | null) => void;
  placeholder?: string;
  className?: string;
}

export function MemberSearchSelect({
  label = "Search Member",
  value,
  onChange,
  placeholder = "Type member name or ID...",
  className,
}: MemberSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      apiClient
        .get(MEMBERS_API.LIST, { params: { search, limit: 10 } })
        .then((res) => setResults(res.data?.members?.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const displayValue = value
    ? `${value.first_name} ${value.last_name} (${value.membership_id || value.id})`
    : search;

  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          setSearch(e.target.value);
          if (value) onChange(null); // clear selection when typing
        }}
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
      {results.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white">
          {results.map((m) => (
            <button
              key={m.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={() => {
                onChange(m);
                setSearch("");
                setResults([]);
              }}
            >
              {m.first_name} {m.last_name} ({m.membership_id || m.id})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}