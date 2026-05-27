export function isActiveStatus(value) {
  const v = String(value || "").trim().toLowerCase();
  return v === "activa" || v === "activo";
}

export function formatInputDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}