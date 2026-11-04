// Builds ../enclosure-fit.html: the Louisianair hardware sitting in enclosure.scad, cut away and
// exploded. Uses the anatomy kit (https://github.com/... skill, installed at ~/.agents/skills/anatomy).
//   node louisianair/enclosure/fit-figure.mjs            (ANATOMY=/path/to/anatomy to override)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const KIT = process.env.ANATOMY || join(homedir(), ".agents/skills/anatomy");
const k = await import(join(KIT, "kit/iso-kit.mjs"));
const { kitScript } = await import(join(KIT, "scripts/inline-kit.mjs"));
const HERE = dirname(fileURLToPath(import.meta.url));

// ---- enclosure.scad numbers, copied verbatim. ponytail: hand-synced; edit both if the scad changes ----
const maker = [93.98, 68.58], maker_holes = [88.9, 63.5];
const asb = [42.36, 44.15], asb_holes = [[3.31, 3.28], [3.31, 40.87], [38.91, 40.7]];
const afe = [52, 28], afe_holes = [47, 23];
const sensor_drop = 17.5, sn1 = [14, 13], sn2 = [14, 39];
const bank = [140, 70, 16];
const wall = 3, floor_t = 2.4, clr = 2, gap = 6, comp_h = 22, lid_t = 3, dome_h = 18, eave = 14;
const port_d = 13, seat_d = 21, seat_depth = 1.2, boss = [27, 3], foam_c = 1, pod = [32, 16];
const bay_l = Math.max(bank[0], maker[0] + gap + asb[0]) + 2 * clr;
const in_w = Math.max(bank[1], maker[1], asb[1], afe[0]) + 2 * clr;
const afe_l = afe[1] + 2 * clr + 8;
const afe_z = boss[1] - seat_depth + foam_c + sensor_drop;
const deck_z = bank[2] + 4;
const in_h = Math.max(deck_z + 1.6 + comp_h, afe_z + 1.6 + 12);
const L = wall + bay_l + afe_l + wall, W = 2 * wall + in_w, H = floor_t + in_h;
const afe_at = [wall + bay_l + clr, wall + (in_w - afe[0]) / 2];
const ports = [[afe_at[0] + sn1[0], afe_at[1] + sn1[1]], [afe_at[0] + sn2[0], afe_at[1] + sn2[1]]];
const lug_r = 5;
const lugs = [[-lug_r + 1, -lug_r + 1], [L + lug_r - 1, -lug_r + 1], [-lug_r + 1, W + lug_r - 1], [L + lug_r - 1, W + lug_r - 1]];

// The scad puts the wall-mount flange at y = W. The figure flips y so that wall is at the back.
const fy = (y) => W - y;
const rect = (x, y, w, d, r = 0) => ({ x, y: W - y - d, w, d, r }); // scad rect -> figure plan
const deckTop = floor_t + deck_z; // underside of the deck boards
const afeBottom = floor_t + afe_z; // underside of the AFE (sensor side down)
const face = floor_t + boss[1] - seat_depth + foam_c; // sensing face height
const BANK = rect(wall + clr, wall + clr, bank[0], bank[1], 3);
const MAKER = rect(wall + clr, wall + clr, maker[0], maker[1], 1.5);
const ASB = rect(wall + clr + maker[0] + gap, wall + clr, asb[0], asb[1], 1.2);
const AFE = rect(afe_at[0], afe_at[1], afe[1], afe[0], 1.2);
const mx = wall + clr + (maker[0] - maker_holes[0]) / 2, my = wall + clr + (maker[1] - maker_holes[1]) / 2;
const ax = wall + clr + maker[0] + gap;
const DECK_POSTS = [
  ...[0, 1].flatMap((i) => [0, 1].map((j) => [mx + i * maker_holes[0], fy(my + j * maker_holes[1]), "maker"])),
  ...asb_holes.map(([hx, hy]) => [ax + hx, fy(wall + clr + hy), "asb"]),
];
const AFE_POSTS = [0, 1].flatMap((i) => [0, 1].map((j) => [afe_at[0] + (afe[1] - afe_holes[1]) / 2 + i * afe_holes[1], fy(afe_at[1] + (afe[0] - afe_holes[0]) / 2 + j * afe_holes[0])]));
const PORTS = ports.map(([x, y]) => [x, fy(y)]);
const inBank = ([x, y]) => x + 3.5 > BANK.x && x - 3.5 < BANK.x + BANK.w && y + 3.5 > BANK.y && y - 3.5 < BANK.y + BANK.d;
const HITS = DECK_POSTS.filter(inBank).length;
const CUT = 13; // the near walls are cut down to this height so the inside shows

// Explode: [lift mm, window start]. Windows share one span so a part above another stays above it.
const LIFT = { lid: [88, 120, 0], maker: [0, 52, 0.12], asb: [0, 52, 0.12], afe: [0, 30, 0.22], bank: [0, 25, 0.34], pod: [0, -22, 0.3] };
const SPAN = 0.62;
const SWAP = 17; // AFE lift where its sensors clear the near standoffs on screen (they stop overlapping)

const WIDTH = 900, HEIGHT = 760;
const P = k.fitProjection(
  [
    ...k.boxCorners({ x: -14, y: -4, w: L + 28, d: W + 8 }, -pod[1] + LIFT.pod[1], H),
    ...k.boxCorners({ x: -eave, y: -eave, w: L + 2 * eave, d: W + 2 * eave }, H + LIFT.lid[1], H + LIFT.lid[1] + lid_t + dome_h),
  ],
  WIDTH, HEIGHT, { pad: 30, azimuth: 58, elevation: 32 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const hp = (name, inner, extra = "") => `<g class="hp" data-name="${name}"${extra}>${inner}</g>`;
const byDepth = (items, of = (item) => item) => [...items].sort((a, b) => k.depthOf([...of(a).slice(0, 2), 0], P) - k.depthOf([...of(b).slice(0, 2), 0], P));
const hull = (points) => {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => list.reduce((out, p) => { while (out.length > 1 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop(); out.push(p); return out; }, []);
  const lower = half(sorted), upper = half([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
const box = (plan, z, h, tone = "mid", bevel = 0.3, steps = 3) => S(k.slabOf(plan, z, h, P, steps, bevel), { tone });
const chip = (cx, cy, w, d, z, h = 1, tone = "mid") => box({ x: cx - w / 2, y: cy - d / 2, w, d, r: 0.3 }, z, h, tone, 0.2, 2);
// a Grove socket: housing with a latch slot facing +y
const grove = (cx, cy, z, along = "x") => {
  const [w, d] = along === "x" ? [10, 8] : [8, 10];
  return box({ x: cx - w / 2, y: cy - d / 2, w, d, r: 0.5 }, z, 6, "mid", 0.3) + Ln(k.planOutline({ x: cx - w / 2 + 1.4, y: cy - d / 2 + 1.4, w: w - 2.8, d: d - 2.8, r: 0.3 }, z + 6, P, 2), { tone: "faint" });
};

// ---- tray ----
function flangeAndBack() {
  const out = [];
  const flange = { x: -14, y: -4, w: L + 28, d: 4, r: 0 };
  out.push(S(k.slabOf(flange, 0, H, P, 1), { tone: "mid" }));
  for (const x of [-7, L + 7]) for (const z of [H * 0.3, H * 0.75]) {
    out.push(Ln(k.sideRing([x, 0, z], 2.5, "y", P, 24), { tone: "lo" }));
    out.push(D([at([x, 0, z])], { size: 0.5, tone: "lo" }));
  }
  for (const p of byDepth(lugs.slice(0, 2))) out.push(lug(p));
  return hp("Wall-mount flange · 4 × M4 to the wall", out.join(""));
}
function lug([x, y], top = H) {
  const ring = k.circleRing(x, fy(y) === y ? y : y, lug_r, 28);
  const cx = Math.min(Math.max(x, 0), L - 1), cy = Math.min(Math.max(y, 0), W - 1);
  const shape = hull([...ring, [cx, cy], [cx + 1, cy], [cx, cy + 1], [cx + 1, cy + 1]]);
  return S(k.extrude(shape, 0, top, P), { tone: "mid" }) + (top === H ? Ln(k.ring(x, y, 2.1, H, P, 20), { tone: "lo" }) + D([at([x, y, H])], { size: 0.45, tone: "lo" }) : "");
}
function trayBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: 0, y: 0, w: L, d: W, r: 0 }, 0, 1, P)}"/>`];
  out.push(S(k.slabOf({ x: 0, y: 0, w: L, d: W, r: 0 }, 0, floor_t, P, 1), { tone: "lo" }));
  out.push(S(k.slabOf({ x: 0, y: 0, w: L, d: wall, r: 0 }, floor_t, H - floor_t, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: 0, y: wall, w: wall, d: W - wall, r: 0 }, floor_t, H - floor_t, P, 1), { tone: "mid" }));
  // compression rib on the rim, along the wall centreline; ends where the near walls are cut
  out.push(Ln(k.onTop([[wall / 2, W], [wall / 2, wall / 2], [L, wall / 2]], H, P), { tone: "faint" }));
  // inner face of the end wall: PG7 gland nut and M12 vent (scad y = 0.3 W and 0.7 W)
  for (const [y, r, name] of [[fy(W * 0.3), 6.3, "PG7 gland · charge cable"], [fy(W * 0.7), 6.15, "M12 breather vent"]]) {
    out.push(hp(name, gland(y, floor_t + 10, r)));
  }
  return out.join("");
}
function gland(y, z, r) {
  // ponytail: nut drawn as stacked side rings on the wall face, not a true prism along x
  const rings = [0, 1.5, 3].map((dx) => Ln(k.sideRing([wall + dx, y, z], dx ? r * 0.8 : r + 2, "x", P, 6), { tone: dx === 3 ? "mid" : "lo" })).join("");
  return rings + Ln(k.sideRing([wall + 3, y, z], r * 0.45, "x", P, 24), { tone: "lo" }) + D([at([wall + 3, y, z])], { size: 0.5, tone: "mid" });
}
function floorParts() {
  const out = [];
  // bank cradle rib (scad y = wall + clr + bank.d + 0.5, 2 thick, 5 tall)
  const rib = rect(wall + 4, wall + clr + bank[1] + 0.5, bank[0] - 8, 2, 0.3);
  out.push(hp("Bank cradle rib", box(rib, floor_t, 5, "lo")));
  // sensor ports: boss, foam-ring seat, through-hole, foam ring
  for (const [x, y] of byDepth(PORTS)) {
    const top = floor_t + boss[1];
    let inner = S(k.cylinder(x, y, boss[0] / 2, floor_t, boss[1], P, 48, 0.3), { tone: "lo" });
    inner += Ln(k.ring(x, y, seat_d / 2, top, P, 48), { tone: "lo" });
    inner += S(k.cylinder(x, y, 10, top - seat_depth, foam_c, P, 40), { tone: "lo", crease: "none" }); // squeezed foam ring
    inner += Ln(k.ring(x, y, port_d / 2 - 0.5, top - seat_depth + foam_c, P, 40), { tone: "faint" });
    out.push(hp("Floor port · foam ring seat", inner));
  }
  return out.join("");
}
function trayFront() {
  const out = [];
  const front = { x: wall, y: W - wall, w: L - 2 * wall, d: wall, r: 0 };
  const end = { x: L - wall, y: wall, w: wall, d: W - wall, r: 0 };
  out.push(S(k.slabOf(front, floor_t, CUT - floor_t, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf(end, floor_t, CUT - floor_t, P, 1), { tone: "mid" }));
  // the back wall's cut end and the left wall's cut end stay full height; mark the section with a faint seam
  out.push(Ln(k.lineOnTop([wall, W - wall / 2], [L - wall / 2, W - wall / 2], CUT, P) + k.lineOnTop([L - wall / 2, W - wall / 2], [L - wall / 2, wall], CUT, P), { tone: "faint" }));
  for (const p of byDepth(lugs.slice(2))) out.push(lug(p, p[0] > L / 2 ? CUT : H));
  out.push(Ln(k.ring(lugs[3][0], lugs[3][1], 2.1, CUT, P, 20), { tone: "lo" }));
  return hp("Tray · ASA, 3 mm walls (near walls cut away)", out.join(""));
}

// ---- standoffs ----
const post = (x, y, z0, z1, r, insert) => z1 - z0 < 0.05 ? "" : S(k.cylinder(x, y, r, z0, z1 - z0, P, 24), { tone: "mid" }) + (insert ? Ln(k.ring(x, y, insert, z1, P, 16), { tone: "lo" }) : "");
function afePosts(near) {
  const list = byDepth(AFE_POSTS).filter(([x]) => (x > afe_at[0] + afe[1] / 2) === near);
  return hp("AFE standoffs · M2.5 inserts", list.map(([x, y]) => post(x, y, floor_t, afeBottom, 3, 1.8)).join(""));
}

// ---- power bank ----
function powerBank() {
  const z = floor_t, h = bank[2];
  let out = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BANK, 4), z, 0.1, P)}" style="filter:blur(4px)"/>`;
  out += S(k.slabOf(BANK, z, h, P, 6, 1.2), { tone: "mid", inner: Ln(k.sideSeam(BANK, z + h / 2, P, 6), { tone: "faint" }) });
  out += Ln(k.planOutline(k.insetPlan(BANK, 6), z + h, P, 6), { tone: "faint" });
  // USB-C and USB-A on the near end, 4 charge LEDs on top
  const ex = BANK.x + BANK.w;
  out += Ln(k.sideRing([ex, BANK.y + 22, z + h / 2], 1.6, "x", P, 16), { tone: "lo" });
  out += Ln(k.pathOf([[ex, BANK.y + 40, z + 5], [ex, BANK.y + 52, z + 5], [ex, BANK.y + 52, z + 10], [ex, BANK.y + 40, z + 10]].map(at), true), { tone: "lo" });
  out += D([0, 1, 2, 3].map((i) => at([ex - 10 - i * 4, BANK.y + BANK.d - 8, z + h])), { size: 0.7, tone: "hi" });
  // where each deck standoff runs into the bank
  out += DECK_POSTS.filter(inBank).map(([x, y]) => Ln(k.ring(x, y, 4.4, z + h, P, 24), { tone: "red" })).join("");
  return hp(`Power bank ${bank.join(" × ")} mm (guessed size)`, out);
}

// ---- Maker Pi Pico + Pico W ----
function makerBoard() {
  const z = deckTop, t = 1.6, top = z + t, B = MAKER;
  let out = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(B, 3), z, 0.1, P)}" style="filter:blur(4px)"/>`;
  out += S(k.slabOf(B, z, t, P, 4, 0.3), { tone: "hi", crease: "lo" });
  out += DECK_POSTS.filter((p) => p[2] === "maker").map(([x, y]) => Ln(k.ring(x, y, 2.6, top, P, 16), { tone: "lo" }) + D([at([x, y, top])], { size: 0.6, tone: "mid" })).join("");
  const cx = B.x + B.w / 2, cy = B.y + B.d / 2;
  // GP LED rows along both headers
  out += D(Array.from({ length: 20 }, (_, i) => [cx - 24 + i * 2.54, cy - 12]).concat(Array.from({ length: 20 }, (_, i) => [cx - 24 + i * 2.54, cy + 12])).map(([x, y]) => at([x, y, top])), { size: 0.55, tone: "mid" });
  // headers the Pico W sits in
  for (const y of [cy - 8.9, cy + 8.9]) out += box({ x: cx - 25.5, y: y - 1.3, w: 51, d: 2.6, r: 0.2 }, top, 8.5, "mid", 0.2, 1);
  // edge furniture: Grove sockets, buzzer, buttons, microSD, audio jack
  const parts = [
    ...[B.x + 10, B.x + 24, B.x + 70, B.x + 84].map((x) => () => grove(x, B.y + B.d - 6, top)),
    ...[B.x + 10, B.x + 24, B.x + 84].map((x) => () => grove(x, B.y + 6, top)),
  ];
  out += parts.slice(4).map((f) => f()).join("");
  out += S(k.cylinder(B.x + 47, B.y + 7, 5.5, top, 5, P, 32), { tone: "mid" }) + Ln(k.ring(B.x + 47, B.y + 7, 1, top + 5, P, 12), { tone: "lo" });
  out += [B.x + 38, B.x + 56].map((x) => box({ x: x - 3, y: B.y + B.d - 13, w: 6, d: 6, r: 0.4 }, top, 1.6, "mid", 0.2, 1) + S(k.cylinder(x, B.y + B.d - 10, 1.6, top + 1.6, 0.8, P, 16), { tone: "hi" })).join("");
  out += box({ x: B.x + 1, y: cy - 7, w: 12, d: 14, r: 0.3 }, top, 1.8, "mid", 0.2, 1);
  out += box({ x: B.x + B.w - 13, y: cy - 4, w: 12, d: 7, r: 0.6 }, top, 5, "mid", 0.3, 2);
  out += parts.slice(0, 4).map((f) => f()).join("");
  return hp("Maker Pi Pico base", out);
}
function picoW() {
  const B = MAKER, cx = B.x + B.w / 2, cy = B.y + B.d / 2, z = deckTop + 1.6 + 8.5, t = 1;
  const plan = { x: cx - 25.5, y: cy - 10.5, w: 51, d: 21, r: 0.8 };
  let out = S(k.slabOf(plan, z, t, P, 4, 0.2), { tone: "hi", crease: "lo" });
  out += D(Array.from({ length: 20 }, (_, i) => [cx - 24.1 + i * 2.54, cy - 9.6]).concat(Array.from({ length: 20 }, (_, i) => [cx - 24.1 + i * 2.54, cy + 9.6])).map(([x, y]) => at([x, y, z + t])), { size: 0.45, tone: "lo" });
  out += chip(cx - 1, cy, 7, 7, z + t, 0.9, "hi");
  out += box({ x: cx + 8, y: cy - 6, w: 11, d: 11, r: 0.6 }, z + t, 1.6, "mid", 0.2, 2); // CYW43439 shield
  out += Ln(k.planOutline({ x: cx + 20, y: cy - 5, w: 4.5, d: 10, r: 0.4 }, z + t, P, 2), { tone: "faint" }); // antenna keep-out
  out += box({ x: cx - 25.5 - 1.2, y: cy - 4, w: 5.6, d: 8, r: 0.6 }, z + t, 2.8, "mid", 0.3, 2); // micro-USB
  out += box({ x: cx - 15, y: cy - 7.5, w: 4, d: 3, r: 0.3 }, z + t, 1.2, "mid", 0.2, 1) + S(k.cylinder(cx - 13, cy - 6, 0.9, z + t + 1.2, 0.5, P, 12), { tone: "hi" }); // BOOTSEL
  return hp("Raspberry Pi Pico W", out);
}

// ---- ASB ----
function asbBoard() {
  const z = deckTop, t = 1.6, top = z + t, B = ASB;
  let out = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(B, 3), z, 0.1, P)}" style="filter:blur(4px)"/>`;
  out += S(k.slabOf(B, z, t, P, 4, 0.3), { tone: "hi", crease: "lo" });
  out += DECK_POSTS.filter((p) => p[2] === "asb").map(([x, y]) => Ln(k.ring(x, y, 2.6, top, P, 16), { tone: "lo" }) + D([at([x, y, top])], { size: 0.6, tone: "mid" })).join("");
  out += chip(B.x + 14, B.y + 16, 5, 5, top, 1);
  out += chip(B.x + 26, B.y + 16, 5, 5, top, 1);
  out += chip(B.x + 14, B.y + 28, 3, 4, top, 1.4);
  out += chip(B.x + 26, B.y + 28, 3, 4, top, 1.4);
  out += D(Array.from({ length: 8 }, (_, i) => at([B.x + 8 + i * 3.6, B.y + 6, top])), { size: 0.5, tone: "lo" });
  out += box({ x: B.x + B.w - 9, y: B.y + 9, w: 7, d: 16, r: 0.4 }, top, 6, "mid", 0.3, 1); // AFE ribbon header (shrouded)
  out += Ln(k.planOutline({ x: B.x + B.w - 7.6, y: B.y + 10.4, w: 4.2, d: 13.2, r: 0.2 }, top + 6, P, 1), { tone: "faint" });
  out += grove(B.x + 9, B.y + B.d - 6, top);
  return hp("SmartCitizen ASB (our board)", out);
}

// ---- AFE + sensors (sensor side down) ----
function sensors() {
  const top = afeBottom;
  const body = top - 1 - face; // A4 can, socket seat above it
  let out = "";
  for (const [index, [x, y]] of byDepth(PORTS).entries()) {
    const name = y < W / 2 ? "SO₂ sensor · A4 (SN2)" : "H₂S sensor · A4 (SN1)";
    void index;
    let inner = S(k.cylinder(x, y, 10.1, face, body, P, 56, 0.5), { tone: "hi", lit: true, inner: Ln(k.sideArc(x, y, 10.1, face + 3, P, 28), { tone: "faint" }) });
    inner += S(k.cylinder(x, y, 9, face + body, 1, P, 40), { tone: "mid" });
    out += hp(name, inner);
  }
  return out;
}
function afeBoard() {
  const z = afeBottom, t = 1.6, top = z + t, B = AFE;
  let out = S(k.slabOf(B, z, t, P, 4, 0.3), { tone: "hi", crease: "lo" });
  out += AFE_POSTS.map(([x, y]) => Ln(k.ring(x, y, 2.1, top, P, 16), { tone: "lo" }) + D([at([x, y, top])], { size: 0.55, tone: "mid" })).join("");
  // socket pins showing through over each sensor
  for (const [x, y] of PORTS) out += D(Array.from({ length: 4 }, (_, i) => at([x + 6 * Math.cos(i * Math.PI / 2 + 0.6), y + 6 * Math.sin(i * Math.PI / 2 + 0.6), top])), { size: 0.55, tone: "hi" }) + Ln(k.ring(x, y, 10.1, top, P, 48), { tone: "faint" });
  out += chip(B.x + 14, B.y + B.d / 2, 4, 6, top, 1);
  out += box({ x: B.x + 1.5, y: B.y + B.d / 2 - 8, w: 6, d: 16, r: 0.4 }, top, 5, "mid", 0.3, 1); // ribbon header to the ASB
  return hp("Alphasense 2-way AFE", out);
}

// ---- pod and lid ----
function hood() {
  const [x] = PORTS[0];
  const y0 = Math.min(PORTS[0][1], PORTS[1][1]), span = Math.abs(PORTS[0][1] - PORTS[1][1]);
  const stadium = (r) => ({ x: x - r, y: y0 - r, w: 2 * r, d: span + 2 * r, r });
  let out = S(k.slabOf(stadium(pod[0] / 2), -pod[1], pod[1] - 2, P, 12), { tone: "mid" });
  out += S(k.slabOf(stadium(pod[0] / 2 + 5), -2, 2, P, 12, 0.3), { tone: "mid" });
  out += Ln(k.sideSeam(stadium(pod[0] / 2), -pod[1] + 3, P, 12), { tone: "faint" });
  return hp("Sensor hood · open bottom, insect mesh", out);
}
function lid() {
  const rim = { x: -eave, y: -eave, w: L + 2 * eave, d: W + 2 * eave, r: 2 };
  const z = H, top = z + lid_t;
  let out = S(k.slabOf(rim, z, lid_t, P, 4, 0.4), { tone: "mid" });
  // dome = hull(rim, ellipsoid): the silhouette is the hull of the rim top and the ellipsoid
  const ell = [];
  const [a, b, c] = [L * 0.4, W * 0.4, dome_h];
  for (let i = 0; i < 48; i++) for (let j = 0; j <= 8; j++) {
    const u = (i / 48) * Math.PI * 2, v = (j / 8) * (Math.PI / 2);
    ell.push([L / 2 + a * Math.cos(u) * Math.cos(v), W / 2 + b * Math.sin(u) * Math.cos(v), top + c * Math.sin(v)]);
  }
  const rimTop = k.ringOf(k.insetPlan(rim, 0.4), 4).map(([x, y]) => [x, y, top]);
  const outline = hull([...ell, ...rimTop].map(at));
  out += `<g class="iso-solid"><path class="iso-fill" d="${k.pathOf(outline, true)}"/><path class="iso-top" d="${k.pathOf(outline, true)}"/>`;
  // contour lines: sections of the hull, lerped from the rim to the ellipsoid crown
  for (const f of [0.35, 0.62, 0.84]) {
    const s = Math.sqrt(1 - f * f);
    const ring = Array.from({ length: 64 }, (_, i) => {
      const u = (i / 64) * Math.PI * 2;
      const ex = L / 2 + a * s * Math.cos(u), ey = W / 2 + b * s * Math.sin(u);
      return [ex, ey];
    });
    out += Ln(k.onTop(ring, top + c * f, P, true), { tone: f > 0.8 ? "lo" : "faint" });
  }
  out += Ln(k.pathOf(outline, true), { tone: "mid" }) + `</g>`;
  for (const [x, y] of lugs) {
    out += Ln(k.ring(x, y, 4.5, top, P, 24), { tone: "lo" }) + Ln(k.ring(x, y, 1.7, top, P, 16), { tone: "lo" });
    out += S(k.cylinder(x, y, 3, top, 1.4, P, 6), { tone: "mid" }); // M3 screw head
  }
  return hp("Lid · domed, gasket in the underside groove", out);
}

// ---- assembly in painter's order ----
const g = (part, inner, extra = "") => `<g data-part="${part}"${extra}>${inner}</g>`;
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  className: "fit",
  label: `Cutaway of the Louisianair enclosure, ${L.toFixed(0)} by ${W} by ${H} mm outside. A power bank lies on the floor; the Maker Pi Pico with the Pico W and the SmartCitizen ASB sit on a deck of standoffs above it; the Alphasense AFE sits sensor-side down on four standoffs at the far end so its H2S and SO2 sensors press onto foam rings over two floor ports, with a hood under the floor. ${HITS} of the deck standoffs land inside the power bank's footprint.`,
  body: [
    g("pod", hood()),
    flangeAndBack(),
    trayBack(),
    floorParts(),
    afePosts(false),
    `<g data-part="deck-low"></g>`,
    g("bank", powerBank()),
    `<g data-part="deck-high"></g>`,
    g("maker", makerBoard() + picoW()),
    g("asb", asbBoard()),
    afePosts(true),
    g("afe", sensors(), ' data-ride="afe"'),
    `<g data-part="afe-near">${afePosts(true)}</g>`,
    g("afe", afeBoard(), ' data-ride="afe"'),
    trayFront(),
    g("lid", lid()),
  ],
});

const readoutAt = (apart) => apart
  ? "apart · lid off, boards up, bank out, hood down"
  : `in the box · ${L.toFixed(0)} × ${W} × ${H} mm outside · ${HITS} deck standoffs hit the bank`;

const live = `
const P = ${JSON.stringify(P)};
const LIFT = ${JSON.stringify(LIFT)}, SPAN = ${SPAN}, SWAP = ${SWAP};
const DECK = ${JSON.stringify(DECK_POSTS)}, FLOOR = ${floor_t}, DECK_TOP = ${deckTop}, BANK_H = ${bank[2]};
const READ = [${JSON.stringify(readoutAt(false))}, ${JSON.stringify(readoutAt(true))}];
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const button = document.querySelector(".fit-apart");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const parts = {};
svg.querySelectorAll("[data-part]").forEach((node) => (parts[node.dataset.part] ||= []).push(node));
const ease = (t) => t * t * (3 - 2 * t);
const liftOf = (name, e) => { const [rest, apart, start] = LIFT[name]; return rest + (apart - rest) * ease(Math.min(1, Math.max(0, (e - start) / SPAN))); };
const post = (x, y, z0, z1) => z1 - z0 < 0.05 ? "" : solidSvg(cylinder(x, y, 3.5, z0, z1 - z0, P, 24), { tone: "mid" }) + (z1 >= DECK_TOP - 0.01 ? lineSvg(ring(x, y, 2.1, z1, P, 16), { tone: "lo" }) : "");
const sorted = [...DECK].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));
const deckName = 'Deck standoffs · ' + DECK.length + ' × M3, ' + (DECK_TOP - FLOOR) + ' mm tall';
let e = 0, target = 0, frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0, lastKey = "";
function draw() {
  const lift = {};
  for (const name in LIFT) lift[name] = liftOf(name, e);
  for (const name of ["pod", "bank", "maker", "asb", "afe", "lid"]) for (const node of parts[name]) node.setAttribute("transform", translateAlong(P, [0, 0, lift[name]]));
  const bottom = FLOOR + lift.bank, top = bottom + BANK_H;
  const key = bottom.toFixed(2);
  if (key !== lastKey) {
    lastKey = key;
    // each deck standoff is drawn in two pieces around the bank: below its underside and above its top
    parts["deck-low"][0].innerHTML = '<g class="hp" data-name="' + deckName + '">' + sorted.map(([x, y]) => post(x, y, FLOOR, Math.min(DECK_TOP, bottom))).join("") + "</g>";
    parts["deck-high"][0].innerHTML = '<g class="hp" data-name="' + deckName + '">' + sorted.map(([x, y]) => post(x, y, Math.max(FLOOR, Math.min(DECK_TOP, top)), DECK_TOP)).join("") + "</g>";
  }
  parts["afe-near"][0].style.display = lift.afe < SWAP ? "" : "none";
  const text = READ[e > 0.5 ? 1 : 0];
  if (readout.textContent !== text) readout.textContent = text;
  button.textContent = target ? "Put it together" : "Take it apart";
  button.setAttribute("aria-pressed", String(!!target));
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) { clock += dt; target = Math.floor(clock / 3.6) % 2; }
  e = still.matches ? target : e + (target - e) * (1 - Math.exp(-dt / 0.55));
  if (Math.abs(target - e) < 0.0005) e = target;
  draw();
  frame = visible && (touring || e !== target) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const set = (next) => { touring = false; target = next; clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = target ? 3.6 : 0; run(); }, 8000); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
button.addEventListener("click", () => set(target ? 0 : 1));
stage.addEventListener("keydown", (event) => {
  const to = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: 0, ArrowDown: 0, Home: 0, End: 1 }[event.key];
  if (to === undefined) return;
  event.preventDefault();
  set(to);
});
draw();

// hover names, same behaviour as the hardware map
const tip = document.createElement("div");
tip.className = "chain-tip";
tip.setAttribute("aria-hidden", "true");
tip.innerHTML = '<span class="chain-tip-name"></span><span class="chain-tip-glow"></span>';
document.body.append(tip);
const tipName = tip.firstChild;
let hot = null;
const light = (name) => {
  if (name === hot) return;
  svg.querySelectorAll(".hp.hot").forEach((node) => node.classList.remove("hot"));
  hot = name;
  if (name) { svg.querySelectorAll('.hp[data-name="' + CSS.escape(name) + '"]').forEach((node) => node.classList.add("hot")); tipName.textContent = name; }
  tip.style.opacity = name ? "1" : "0";
};
svg.addEventListener("pointermove", (event) => {
  const node = event.target.closest(".hp");
  light(node ? node.dataset.name : null);
  tip.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px) translate(-50%, calc(-100% - 22px))";
  if (node) { touring = false; clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; run(); }, 8000); }
});
svg.addEventListener("pointerleave", () => light(null));
document.querySelector(".chain-steps").addEventListener("pointerover", (event) => {
  const link = event.target.closest(".chain-link");
  if (link) { light(link.dataset.name); tip.style.opacity = "0"; }
});
document.querySelector(".chain-steps").addEventListener("pointerout", (event) => { if (event.target.closest(".chain-link")) light(null); });

const toggle = document.querySelector(".chain-theme");
const paint = (mode) => {
  document.body.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  toggle.textContent = mode === "dark" ? "Light mode" : "Dark mode";
  toggle.setAttribute("aria-pressed", String(mode === "light"));
};
paint(localStorage.getItem("chain-theme") || document.body.dataset.theme);
toggle.addEventListener("click", () => { const next = document.body.dataset.theme === "dark" ? "light" : "dark"; localStorage.setItem("chain-theme", next); paint(next); });
`;

const link = (name, text) => `<button type="button" class="chain-link" data-name="${name}">${text}</button>`;
const deckName = `Deck standoffs · ${DECK_POSTS.length} × M3, ${deck_z} mm tall`;
const caption = `<figcaption class="iso-legend chain-caption"><h2>How it fits</h2><ol class="chain-steps">
<li><strong>${link(`Power bank ${bank.join(" × ")} mm (guessed size)`, "Power bank")}</strong> lies flat on the floor, pushed back against the ${link("Bank cradle rib", "cradle rib")}.</li>
<li><strong>${link(deckName, "Deck standoffs")}</strong> rise ${deck_z} mm from the floor to carry the boards above the bank.</li>
<li><strong>${link("Maker Pi Pico base", "Maker Pi Pico")}</strong> with the ${link("Raspberry Pi Pico W", "Pico W")} and the ${link("SmartCitizen ASB (our board)", "ASB")} sit side by side on that deck, ${gap} mm apart.</li>
<li><strong>${link("Alphasense 2-way AFE", "AFE")}</strong> sits upside down on its own ${link("AFE standoffs · M2.5 inserts", "four standoffs")} at the far end.</li>
<li>The ${link("H₂S sensor · A4 (SN1)", "H₂S")} and ${link("SO₂ sensor · A4 (SN2)", "SO₂")} sensors hang under it and press on ${link("Floor port · foam ring seat", "foam rings")} over two holes in the floor. Those faces are the only parts that touch outside air.</li>
<li>The ${link("Sensor hood · open bottom, insect mesh", "hood")} is glued under the holes to keep rain off. The ${link("Lid · domed, gasket in the underside groove", "lid")} screws onto the four corner lugs, and the ${link("Wall-mount flange · 4 × M4 to the wall", "flange")} hangs it on a wall.</li>
</ol>
<p class="fit-warn"><strong>Doesn't fit yet.</strong> The bank is ${bank[0]} × ${bank[1]} mm, but ${HITS} of the ${DECK_POSTS.length} deck standoffs stand inside its footprint (red rings). The gap between the Maker standoffs is only ${(maker_holes[1] - 7).toFixed(1)} mm across. Use a bank under that width, or carry the deck on ledges in the walls.</p>
<details class="chain-more"><summary>See more details</summary><div class="iso-legend"><span class="iso-keys">
<span class="iso-key">Outside ${L.toFixed(1)} × ${W} × ${H} mm, plus ${eave} mm lid eave and ${dome_h} mm dome</span>
<span class="iso-key">Deck boards' underside ${deckTop} mm above the base; ${comp_h} mm left above them for the Pico W and Grove plugs</span>
<span class="iso-key">AFE underside ${afeBottom.toFixed(1)} mm up; sensing faces at ${face.toFixed(1)} mm, on 1 mm of squeezed foam</span>
<span class="iso-key">Sensor positions and the socket seat are estimates; the bank size is a guess (see enclosure.scad)</span>
</span></div></details></figcaption>`;

const css = `<style>
body,.iso{--anatomy-mono:"Nunito",ui-sans-serif,system-ui,sans-serif;font-family:"Nunito",ui-sans-serif,system-ui,sans-serif;font-size:22px}
.iso-page{width:min(1500px,100% - 32px)}
.iso-plate{padding:90px 24px 120px}
.iso-plate-corners{inset:24px 28px}
.iso-plate-corner{font-size:19px;line-height:1.3}
.iso-plate-corner[data-corner="readout"]{white-space:normal;max-width:60%;text-align:right}
.iso-stage{outline:none}
.iso{--hover:#38bdf8;--hover-fill:color-mix(in srgb,#38bdf8 30%,var(--anatomy-card));--hover-side:color-mix(in srgb,#38bdf8 18%,var(--anatomy-card))}
.iso[data-theme="light"]{--hover:#0284c7;--hover-fill:color-mix(in srgb,#38bdf8 38%,#fff);--hover-side:color-mix(in srgb,#0284c7 26%,#fff)}
.fit .hp{cursor:pointer}
.fit .hp :is(.iso-fill,.iso-top,.iso-shade){transition:fill .18s,stroke .18s}
.fit .hp.hot :is(.iso-top){fill:var(--hover-fill)!important}
.fit .hp.hot :is(.iso-fill,.iso-shade){fill:var(--hover-side)!important}
.fit .hp.hot .iso-line{stroke:var(--hover)!important}
.fit .hp.hot .iso-dots circle{fill:var(--hover);opacity:.9}
.chain-link[data-name="Raspberry Pi Pico W"],.chain-link[data-name="SmartCitizen ASB (our board)"],.chain-link[data-name="Alphasense 2-way AFE"],.fit .hp:is([data-name="Raspberry Pi Pico W"],[data-name="SmartCitizen ASB (our board)"],[data-name="Alphasense 2-way AFE"]){--hover:#22c55e}
.chain-link[data-name="Maker Pi Pico base"],.fit .hp[data-name="Maker Pi Pico base"]{--hover:#a855f7}
.chain-link[data-name^="H₂S"],.chain-link[data-name^="SO₂"],.fit .hp:is([data-name^="H₂S"],[data-name^="SO₂"]){--hover:#f97316}
.fit .hp:is([data-name="Raspberry Pi Pico W"],[data-name="SmartCitizen ASB (our board)"],[data-name="Alphasense 2-way AFE"],[data-name="Maker Pi Pico base"],[data-name^="H₂S"],[data-name^="SO₂"]){--hover-fill:color-mix(in srgb,var(--hover) 60%,var(--anatomy-card));--hover-side:color-mix(in srgb,var(--hover) 40%,var(--anatomy-card))}
.chain-tip{position:fixed;left:0;top:0;z-index:50;pointer-events:none;padding:10px 18px 12px;border-radius:14px;background:#0a0a0a;color:#fff;font:700 20px/1.25 "Nunito",ui-sans-serif,system-ui,sans-serif;white-space:nowrap;box-shadow:0 10px 30px -8px #000a,0 0 0 1px #ffffff1a;opacity:0;transition:opacity .15s;overflow:hidden}
.chain-tip-glow{position:absolute;left:12%;right:12%;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#34d399,#38bdf8,transparent)}
.chain-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px}
.chain-bar a{color:var(--anatomy-strong);font-weight:600}
.chain-theme,.fit-apart{font:inherit;font-size:20px;font-weight:600;color:var(--anatomy-strong);background:var(--anatomy-card);border:1px solid var(--anatomy-mid);border-radius:999px;padding:8px 22px;cursor:pointer}
.chain-theme:hover,.fit-apart:hover{border-color:var(--anatomy-hi)}
:is(.chain-theme,.fit-apart):focus-visible{outline:2px solid var(--anatomy-hi);outline-offset:3px}
.iso-figure:has(.chain-caption){display:grid;grid-template-columns:minmax(0,2fr) minmax(300px,1fr);gap:32px;align-items:start}
@media (max-width:900px){.iso-figure:has(.chain-caption){grid-template-columns:1fr}}
.chain-caption{font-size:20px;color:var(--anatomy-text);line-height:1.5;display:block}
.chain-caption h2{margin:0 0 12px;font-size:32px;font-weight:700;color:var(--anatomy-strong)}
.chain-link{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline dotted 1px;text-underline-offset:4px}
.chain-link:hover,.chain-link:focus-visible{color:var(--hover);outline:none}
.chain-steps{margin:0;padding-left:1.4em;display:grid;gap:10px}
.chain-steps strong,.fit-warn strong{color:var(--anatomy-strong);font-weight:700}
.fit-warn{margin:22px 0 0;padding:12px 16px;border-left:3px solid var(--anatomy-red);background:color-mix(in srgb,var(--anatomy-red) 8%,transparent);border-radius:4px}
.chain-more{margin-top:22px}
.chain-more summary{cursor:pointer;font-weight:700;color:var(--anatomy-strong)}
.chain-more .iso-keys{display:grid;gap:8px;margin-top:10px}
.fit-actions{display:flex;justify-content:center;margin-top:-64px;position:relative}
@media (max-width:560px){body,.iso{font-size:17px}.iso-plate{padding:56px 10px 96px}.iso-plate-corner{font-size:12px}.chain-caption h2{font-size:24px}.chain-theme,.fit-apart{font-size:15px}}
</style>`;

const plate = `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">Fig 2</span><span class="iso-plate-corner" data-corner="title">What goes where in the box</span><span class="iso-plate-corner" data-corner="hint">Hover a part · ← → take it apart</span><span class="iso-plate-corner" data-corner="readout" data-readout>${readoutAt(false)}</span></div><div class="iso-stage" tabindex="0" role="group" aria-label="Enclosure fit: left and right arrow keys put it together or take it apart">${svg}</div><div class="fit-actions"><button type="button" class="fit-apart" aria-pressed="false">Take it apart</button></div></div>${caption}</figure>`;
const body = `${css}<div class="chain-bar"><a href="connection-diagram.html">← Hardware map</a><button type="button" class="chain-theme" aria-pressed="false">Light mode</button></div>${plate}`;
const page = k.pageHtml({ title: "Louisianair · what goes where in the box", theme: "dark", body, script: kitScript() + live, width: 1500 })
  .replace("<style>", '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"><style>');
writeFileSync(join(HERE, "..", "enclosure-fit.html"), page);
console.log(`wrote enclosure-fit.html · outer ${L.toFixed(2)} × ${W} × ${H} · ${HITS}/${DECK_POSTS.length} deck standoffs inside the bank footprint`);
