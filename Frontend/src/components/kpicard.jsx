import React from 'react';

export default function KpiCard({ title, value, hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-xs text-slate-500 mt-2">{hint}</div>
    </div>
  );
}