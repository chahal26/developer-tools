'use client';

import { useEffect, useState } from 'react';

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type ColorSource = 'hex' | 'rgb' | 'hsl';

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const bigint = parseInt(value, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  );
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#ff5733');
  const [rgb, setRgb] = useState<RGB>(hexToRgb('#ff5733'));
  const [hsl, setHsl] = useState<HSL>(rgbToHsl(rgb.r, rgb.g, rgb.b));
  const [lastUpdated, setLastUpdated] = useState<ColorSource>('hex');

  useEffect(() => {
    if (lastUpdated === 'hex') {
      const rgbVal = hexToRgb(hex);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setRgb(rgbVal);
      setHsl(hslVal);
    }
  }, [hex, lastUpdated]);

  useEffect(() => {
    if (lastUpdated === 'rgb') {
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  }, [lastUpdated, rgb]);

  useEffect(() => {
    if (lastUpdated === 'hsl') {
      const rgbVal = hslToRgb(hsl.h, hsl.s, hsl.l);
      setRgb(rgbVal);
      setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  }, [hsl, lastUpdated]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Color Converter</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HEX */}
        <div className="bg-white p-4 rounded shadow border">
          <label className="block text-sm font-medium text-gray-700 mb-1">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setLastUpdated('hex');
              setHex(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded"
            maxLength={7}
          />
        </div>

        {/* RGB */}
        <div className="bg-white p-4 rounded shadow border">
          <label className="block text-sm font-medium text-gray-700 mb-1">RGB</label>
          <div className="flex space-x-2">
            {(['r', 'g', 'b'] as const).map((c) => (
              <input
                key={c}
                type="number"
                min={0}
                max={255}
                value={rgb[c]}
                onChange={(e) => {
                  setLastUpdated('rgb');
                  setRgb((prev) => ({ ...prev, [c]: Number(e.target.value) }));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            ))}
          </div>
        </div>

        {/* HSL */}
        <div className="bg-white p-4 rounded shadow border">
          <label className="block text-sm font-medium text-gray-700 mb-1">HSL</label>
          <div className="flex space-x-2">
            {(['h', 's', 'l'] as const).map((c) => (
              <input
                key={c}
                type="number"
                min={c === 'h' ? 0 : 0}
                max={c === 'h' ? 360 : 100}
                value={hsl[c]}
                onChange={(e) => {
                  setLastUpdated('hsl');
                  setHsl((prev) => ({ ...prev, [c]: Number(e.target.value) }));
                }}
                className="w-full px-2 py-1 border rounded"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            setLastUpdated('hex');
            setHex(e.target.value);
          }}
          className="w-32 h-32 p-0 border-0 rounded cursor-pointer"
          style={{ appearance: 'none' }}
        />
      </div>

    </div>
  );
}
