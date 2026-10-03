// "Words fly in and assemble" (client's reference video): every word starts at its own random offset/scale/skew,
// blurred and transparent, then settles into place once the group scrolls into view. The scattered state is plain
// CSS (.sw-word in globals.css) from deterministic per-word values, so server and client render the same markup and
// nothing flashes in place before it scatters. Offsets are in cqw: needs a [container-type:inline-size] ancestor.

// mulberry32: tiny seeded PRNG, same numbers on server and client
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scatterVars(seed: number): React.CSSProperties {
  const r = rng(seed);
  const sign = () => (r() < 0.5 ? -1 : 1);
  return {
    "--sx": `${sign() * (8 + r() * 40)}cqw`,
    "--sy": `${sign() * (4 + r() * 22)}cqw`,
    "--ss": (0.4 + r() * 2).toFixed(2),
    "--sk": `${(-18 * r()).toFixed(1)}deg`,
    "--sd": `${(r() * 0.7).toFixed(2)}s`,
  } as React.CSSProperties;
}

// Splits text into word spans; whitespace (incl. \n for whitespace-pre-line) stays as plain text between them.
export function ScatterWords({ text, seed }: { text: string; seed: number }) {
  return text.split(/(\s+)/).map((part, i) =>
    /^\s*$/.test(part) ? part : (
      <span key={i} className="sw-word" style={scatterVars(seed * 101 + i)}>
        {part}
      </span>
    ),
  );
}
