export function isEmpty(value) {
  return String(value ?? "").trim() === "";
}

export function hasRequiredError(showValidation, value) {
  return showValidation && isEmpty(value);
}

export function fieldClass(hasError) {
  return `w-full rounded-xl border px-4 py-3 bg-white outline-none transition ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-slate-300 focus:border-blue-500"
  }`;
}

export function labelClass() {
  return "text-sm font-medium text-slate-600 mb-2 block";
}

export function requiredTextClass() {
  return "text-xs font-medium text-red-600 mb-1 block";
}