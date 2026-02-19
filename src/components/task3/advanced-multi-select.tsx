"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useMemo, useRef, useState } from "react";

export type AdvancedSelectItem = {
  id: string;
  label: string;
  group: string;
  keywords?: string[];
};

type Row = { type: "group"; key: string; group: string } | {
  type: "item";
  key: string;
  item: AdvancedSelectItem;
};

type AdvancedMultiSelectProps = {
  label: string;
  items: AdvancedSelectItem[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  viewportHeight?: number;
  rowHeight?: number;
};

const OVERSCAN = 6;

export default function AdvancedMultiSelect({
  label,
  items,
  value,
  onChange,
  placeholder = "موردی انتخاب نشده است",
  viewportHeight = 240,
  rowHeight = 36,
}: AdvancedMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const itemMap = useMemo(() => {
    const map = new Map<string, AdvancedSelectItem>();
    items.forEach((item) => map.set(item.id, item));
    return map;
  }, [items]);

  const selectedItems = useMemo(
    () =>
      value
        .map((itemId) => itemMap.get(itemId))
        .filter((item): item is AdvancedSelectItem => Boolean(item)),
    [itemMap, value]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const keywords = item.keywords?.join(" ").toLowerCase() ?? "";
      return (
        item.label.toLowerCase().includes(query) ||
        item.group.toLowerCase().includes(query) ||
        keywords.includes(query)
      );
    });
  }, [items, search]);

  const groupedRows = useMemo(() => {
    const groupedMap = new Map<string, AdvancedSelectItem[]>();
    filteredItems.forEach((item) => {
      const list = groupedMap.get(item.group) ?? [];
      list.push(item);
      groupedMap.set(item.group, list);
    });

    const rows: Row[] = [];
    groupedMap.forEach((groupItems, groupName) => {
      rows.push({ type: "group", key: `group-${groupName}`, group: groupName });
      groupItems.forEach((item) => {
        rows.push({ type: "item", key: `item-${item.id}`, item });
      });
    });

    return rows;
  }, [filteredItems]);

  const totalHeight = groupedRows.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + OVERSCAN * 2;
  const endIndex = Math.min(groupedRows.length, startIndex + visibleCount);
  const visibleRows = groupedRows.slice(startIndex, endIndex);
  const topPadding = startIndex * rowHeight;
  const bottomPadding = Math.max(0, totalHeight - endIndex * rowHeight);

  const filteredIds = filteredItems.map((item) => item.id);
  const isAllFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((itemId) => selectedSet.has(itemId));

  function updateFromListbox(nextItems: AdvancedSelectItem[]) {
    const uniqueIds = Array.from(new Set(nextItems.map((item) => item.id)));
    onChange(uniqueIds);
  }

  function selectAllFiltered() {
    const merged = Array.from(new Set([...value, ...filteredIds]));
    onChange(merged);
  }

  function clearAllFiltered() {
    const filteredSet = new Set(filteredIds);
    onChange(value.filter((itemId) => !filteredSet.has(itemId)));
  }

  function clearEverything() {
    onChange([]);
  }

  return (
    <div className="w-full space-y-2.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>

      <Listbox value={selectedItems} onChange={updateFromListbox} multiple by="id">
        <div className="relative">
          <ListboxButton className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-right text-sm text-slate-700 shadow-sm transition focus:border-[#41BA89] focus:outline-none data-[open]:border-[#41BA89]">
            <span className="line-clamp-1 pe-2">
              {value.length
                ? `${value.length.toLocaleString("fa-IR")} مورد انتخاب شده`
                : placeholder}
            </span>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <svg
                viewBox="0 0 20 20"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute z-[1000] mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(2,6,23,0.12)]">
            <div className="border-b border-slate-100 p-3">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setScrollTop(0);
                  viewportRef.current?.scrollTo({ top: 0 });
                }}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder="جستجو در آیتم ها..."
                className="mb-2.5 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-[#41BA89]"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={isAllFilteredSelected ? clearAllFiltered : selectAllFiltered}
                  className="inline-flex h-8 items-center rounded-lg bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  {isAllFilteredSelected ? "لغو انتخاب فیلترشده" : "انتخاب همه فیلترشده"}
                </button>
                <button
                  type="button"
                  onClick={clearEverything}
                  className="inline-flex h-8 items-center rounded-lg bg-slate-100 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  انتخاب هیچ کدام
                </button>
                <span className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600">
                  انتخاب شده: {value.length.toLocaleString("fa-IR")}
                </span>
              </div>
            </div>

            {groupedRows.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">آیتمی پیدا نشد.</div>
            ) : (
              <div
                ref={viewportRef}
                onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
                className="overflow-auto"
                style={{ height: `${viewportHeight}px` }}
              >
                <div style={{ paddingTop: `${topPadding}px`, paddingBottom: `${bottomPadding}px` }}>
                  {visibleRows.map((row) => {
                    if (row.type === "group") {
                      return (
                        <div
                          key={row.key}
                          className="mx-2 my-1 flex items-center rounded-lg bg-slate-50 px-3 text-[11px] font-semibold text-slate-600"
                          style={{ height: `${rowHeight}px` }}
                        >
                          {row.group}
                        </div>
                      );
                    }

                    return (
                      <ListboxOption
                        key={row.key}
                        value={row.item}
                        className={({ selected, focus }) =>
                          [
                            "mx-2 my-1 flex cursor-pointer items-center justify-between rounded-lg px-3 text-sm outline-none",
                            selected ? "bg-emerald-50 text-emerald-700" : "text-slate-700",
                            focus ? "ring-2 ring-[#41BA89] ring-offset-1" : "",
                          ].join(" ")
                        }
                        style={{ height: `${rowHeight}px` }}
                      >
                        {({ selected }) => (
                          <>
                            <span className="line-clamp-1">{row.item.label}</span>
                            <span
                              className={[
                                "text-xs font-bold transition-opacity",
                                selected ? "opacity-100" : "opacity-30",
                              ].join(" ")}
                            >
                              ✓
                            </span>
                          </>
                        )}
                      </ListboxOption>
                    );
                  })}
                </div>
              </div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
