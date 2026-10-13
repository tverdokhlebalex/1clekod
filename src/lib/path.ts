const external = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

/** Добавляет базовый путь сборки. На основном домене путь остаётся прежним. */
export function withBase(path: string) {
  if (!path || external.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || base === "") return path;
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  if (path === "/") return prefix;
  if (!path.startsWith("/")) return path;
  return `${prefix}${path}`;
}
