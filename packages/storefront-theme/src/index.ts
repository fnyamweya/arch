import type {
  ThemeTokenRecord,
  ThemeTokenSetRecord,
  ThemeVersionRecord,
} from "@arch/storefront-core";
import {
  REQUIRED_SEMANTIC_TOKENS,
  CONTRAST_PAIRS,
  WCAG_AA_CONTRAST_NORMAL,
  WCAG_AA_CONTRAST_LARGE,
} from "@arch/storefront-core";

// ─── Token Compiler ───

export interface CompiledTokenSet {
  readonly mode: string;
  readonly cssVariables: ReadonlyMap<string, string>;
  readonly cssText: string;
  readonly resolvedTokens: ReadonlyMap<string, string>;
}

/**
 * Resolves token references and produces CSS custom properties.
 * References use the {group.name} syntax e.g. {color.primary-500}.
 */
export function compileTokenSet(
  tokens: readonly ThemeTokenRecord[],
  mode: string,
): CompiledTokenSet {
  const tokenMap = new Map<string, ThemeTokenRecord>();
  for (const token of tokens) {
    tokenMap.set(`${token.group}.${token.name}`, token);
  }

  const resolvedTokens = new Map<string, string>();
  const resolving = new Set<string>();

  function resolveValue(key: string): string {
    if (resolvedTokens.has(key)) {
      return resolvedTokens.get(key)!;
    }

    const token = tokenMap.get(key);
    if (!token) {
      return "";
    }

    if (resolving.has(key)) {
      return token.value;
    }

    resolving.add(key);

    let value = token.value;
    if (token.reference) {
      const refKey = token.reference.replace(/^\{|\}$/g, "");
      const resolved = resolveValue(refKey);
      if (resolved) {
        value = resolved;
      }
    }

    resolving.delete(key);
    resolvedTokens.set(key, value);
    return value;
  }

  for (const key of tokenMap.keys()) {
    resolveValue(key);
  }

  const cssVariables = new Map<string, string>();
  const cssLines: string[] = [];

  for (const [key, value] of resolvedTokens) {
    const cssVar = `--${key.replace(/\./g, "-").replace(/\//g, "-")}`;
    cssVariables.set(cssVar, value);
    cssLines.push(`  ${cssVar}: ${value};`);
  }

  const selector = mode === "default" ? ":root" : `[data-theme="${mode}"]`;
  const cssText = `${selector} {\n${cssLines.join("\n")}\n}`;

  return { mode, cssVariables, cssText, resolvedTokens };
}

// ─── Contrast Validation (WCAG 2.x) ───

export interface ContrastResult {
  readonly foreground: string;
  readonly background: string;
  readonly foregroundColor: string;
  readonly backgroundColor: string;
  readonly ratio: number;
  readonly passesAA: boolean;
  readonly passesAALarge: boolean;
}

function parseHexColor(hex: string): [number, number, number] | null {
  const match = hex.match(/^#([0-9a-fA-F]{3,8})$/);
  if (!match) return null;

  let r: number, g: number, b: number;
  const h = match[1]!;

  if (h.length === 3) {
    r = Number.parseInt(h[0]! + h[0]!, 16);
    g = Number.parseInt(h[1]! + h[1]!, 16);
    b = Number.parseInt(h[2]! + h[2]!, 16);
  } else if (h.length === 6 || h.length === 8) {
    r = Number.parseInt(h.substring(0, 2), 16);
    g = Number.parseInt(h.substring(2, 4), 16);
    b = Number.parseInt(h.substring(4, 6), 16);
  } else {
    return null;
  }

  return [r, g, b];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(
  foregroundHex: string,
  backgroundHex: string,
): ContrastResult | null {
  const fg = parseHexColor(foregroundHex);
  const bg = parseHexColor(backgroundHex);
  if (!fg || !bg) return null;

  const fgLum = relativeLuminance(...fg);
  const bgLum = relativeLuminance(...bg);
  const ratio = contrastRatio(fgLum, bgLum);

  return {
    foreground: foregroundHex,
    background: backgroundHex,
    foregroundColor: foregroundHex,
    backgroundColor: backgroundHex,
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= WCAG_AA_CONTRAST_NORMAL,
    passesAALarge: ratio >= WCAG_AA_CONTRAST_LARGE,
  };
}

// ─── Theme Validation ───

export interface ThemeLintResult {
  readonly valid: boolean;
  readonly missingTokens: readonly string[];
  readonly contrastFailures: readonly ContrastResult[];
  readonly warnings: readonly string[];
}

export function lintThemeTokens(
  tokens: readonly ThemeTokenRecord[],
): ThemeLintResult {
  const compiled = compileTokenSet(tokens, "default");
  const resolvedMap = compiled.resolvedTokens;

  // Check required tokens
  const missingTokens: string[] = [];
  for (const required of REQUIRED_SEMANTIC_TOKENS) {
    if (!resolvedMap.has(required)) {
      missingTokens.push(required);
    }
  }

  // Check contrast pairs
  const contrastFailures: ContrastResult[] = [];
  for (const pair of CONTRAST_PAIRS) {
    const fgValue = resolvedMap.get(pair.foreground);
    const bgValue = resolvedMap.get(pair.background);
    if (fgValue && bgValue) {
      const result = checkContrast(fgValue, bgValue);
      if (result && !result.passesAA) {
        contrastFailures.push({
          ...result,
          foreground: pair.foreground,
          background: pair.background,
        });
      }
    }
  }

  // Warnings
  const warnings: string[] = [];
  const tokenKeys = new Set(resolvedMap.keys());
  for (const token of tokens) {
    if (token.reference) {
      const refKey = token.reference.replace(/^\{|\}$/g, "");
      if (!tokenKeys.has(refKey)) {
        warnings.push(`Token "${token.group}.${token.name}" references unknown token "${refKey}"`);
      }
    }
  }

  return {
    valid: missingTokens.length === 0 && contrastFailures.length === 0,
    missingTokens,
    contrastFailures,
    warnings,
  };
}

// ─── CSS Generation Helpers ───

export function generateThemeCss(
  tokenSets: readonly {
    mode: string;
    tokens: readonly ThemeTokenRecord[];
  }[],
): string {
  const parts: string[] = [];
  for (const set of tokenSets) {
    const compiled = compileTokenSet(set.tokens, set.mode);
    parts.push(compiled.cssText);
  }
  return parts.join("\n\n");
}

export function generateCssVariableMap(
  tokens: readonly ThemeTokenRecord[],
): Record<string, string> {
  const compiled = compileTokenSet(tokens, "default");
  const result: Record<string, string> = {};
  for (const [key, value] of compiled.cssVariables) {
    result[key] = value;
  }
  return result;
}
