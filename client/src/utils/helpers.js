const CATEGORY_COLORS = {
  technology: "var(--accent2)",
  politics: "var(--red)",
  business: "var(--accent)",
  science: "var(--green)",
  health: "#ff915a",
  sports: "#c882ff",
  entertainment: "#ffb45a",
};

export const getCategoryColor = (category) => {
  if (!category || typeof category !== "string") {
    return "var(--text-muted)";
  }

  const normalized = category.trim().toLowerCase();

  return CATEGORY_COLORS[normalized] || "var(--text-muted)";
};