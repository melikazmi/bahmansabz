"use client";

import { useMemo, useState } from "react";
import AdvancedMultiSelect, {
  type AdvancedSelectItem,
} from "@/components/task3/advanced-multi-select";

function generateItems(): AdvancedSelectItem[] {
  const groups = [
    "فرانت اند",
    "بک اند",
    "دواپس",
    "پایگاه داده",
    "ابزار توسعه",
    "مدیریت محصول",
    "امنیت",
    "تحلیل داده",
  ];

  const result: AdvancedSelectItem[] = [];
  for (let index = 1; index <= 128; index += 1) {
    const group = groups[index % groups.length];
    result.push({
      id: `item-${index}`,
      label: `${group} - گزینه ${index.toLocaleString("fa-IR")}`,
      group,
      keywords: [group, `option-${index}`, `skill-${index % 20}`],
    });
  }
  return result;
}

export default function Task3Page() {
  const items = useMemo(() => generateItems(), []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedPreview = selectedIds.slice(0, 20);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.06)] md:p-7">
        <div className="grid items-center gap-4 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-2 text-xl font-bold text-slate-900 md:text-2xl">
              کامپوننت Dropdown Select پیشرفته
            </h2>
            <p className="text-sm leading-8 text-slate-600">
              این نسخه برای استفاده واقعی بهینه شده: جستجو، چندانتخابی، گروه بندی،
              انتخاب همه/هیچ، نمایش تعداد انتخاب و مجازی سازی.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
            <p className="text-xs font-semibold text-emerald-700">Config</p>
            <p className="mt-2 text-sm text-slate-700">تعداد آیتم: ۳۶۰</p>
            <p className="text-sm text-slate-700">Row Height: 36px</p>
            <p className="text-sm text-slate-700">Virtualized: فعال</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.05)] md:p-6">
        <AdvancedMultiSelect
          label="انتخاب مهارت ها"
          items={items}
          value={selectedIds}
          onChange={setSelectedIds}
          placeholder="لطفاً یک یا چند گزینه انتخاب کنید"
          viewportHeight={260}
          rowHeight={36}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">تعداد کل آیتم ها</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {items.length.toLocaleString("fa-IR")}
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">تعداد انتخاب شده</p>
          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {selectedIds.length.toLocaleString("fa-IR")}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-900">نمونه انتخاب های فعلی</h3>
        {selectedPreview.length ? (
          <div className="flex flex-wrap gap-2">
            {selectedPreview.map((itemId) => {
              const item = items.find((candidate) => candidate.id === itemId);
              if (!item) return null;
              return (
                <span
                  key={item.id}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {item.label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500">هنوز موردی انتخاب نشده است.</p>
        )}
      </section>
    </div>
  );
}
