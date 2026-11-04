// Louisianair outdoor enclosure: ASA (or PETG for test fits), three parts.
// Export: openscad -D part=\"tray\" -o tray.stl enclosure.scad
//         openscad -D part=\"lid\"  -o lid.stl  enclosure.scad
//         openscad -D part=\"pod\"  -o pod.stl  enclosure.scad
//
// Layout: one sealed bay. Power bank on the floor, Maker Pi Pico + ASB on a
// deck above it, AFE on standoffs at the far end, sensors pointing down.
// Only the sensor faces (H2S in SN1, SO2 in SN2) meet outside air: each presses
// on a foam ring over a hole in the floor. The pod (open-bottom hood) glues
// under both holes.
// Wall-mount via the flange on the back wall; leave air space under the box.

part = "both"; // tray | lid | pod | both

// ---- board data (mm) ----
// Maker Pi Pico: Cytron datasheet fig 4
maker = [93.98, 68.58]; maker_holes = [88.90, 63.50]; maker_hole_d = 3;
// SmartCitizen 8-ch ASB: from the Gerbers (Edge_Cuts + .drl NPTH)
asb = [42.36, 44.15];
asb_holes = [[3.31, 3.28], [3.31, 40.87], [38.91, 40.70]]; asb_hole_d = 3.2;
// Alphasense 2-way AFE: AFE datasheet fig 1
afe = [52, 28]; afe_holes = [47, 23]; afe_hole_d = 2.6;
// AFE sensor side to sensing face: 16.5 A4 body (datasheet; H2S-A4 and SO2-A4
// share the package) + socket seat.
// ponytail: socket seat guessed; measure with the sensor plugged in.
sensor_drop = 17.5;
// Sensor centres from the AFE corner nearest the box origin, after flipping
// the AFE sensor-down. x runs along the 28 mm edge, y along the 52 mm.
// ponytail: estimated from the datasheet photo; measure before printing.
sn1 = [14, 13]; // H2S
sn2 = [14, 39]; // SO2

// ponytail: guessed slim 10 Ah bank. Measure yours and change these three.
bank = [140, 70, 16];

// ---- print / fit knobs ----
wall = 3;          // ~7 perimeters @ 0.4 nozzle
floor_t = 2.4;
clr = 2;           // board-to-wall clearance
gap = 6;           // gap between Maker and ASB on the deck
comp_h = 22;       // tallest stuff above the deck boards (Pico W + Grove plugs)
insert_d = 4.2;    // M3 heat-set insert hole; check your insert's spec
insert_l = 6;
m25_insert_d = 3.6;
groove = [1.8, 1.4]; // gasket groove w x depth; fits 1.5-2 mm silicone/foam cord
lid_t = 3;         // flat rim of the lid at the eave
dome_h = 18;       // dome rise above the rim; solid at ~15% infill doubles as sun insulation
eave = 14;         // lid overhang past the walls (clears the screw lugs)
// sensor port: foam ring (ID ~12, OD ~20, 1.5 thick closed-cell) in a counterbore
port_d = 13;       // through-hole; > the 10 mm sensing area, < the 16 mm face
seat_d = 21;       // counterbore for the foam ring; sensor body is 20.2
seat_depth = 1.2;
boss = [27, 3];    // floor boss under the seat: diameter, height
foam_c = 1.0;      // foam thickness when squeezed
pod = [32, 16];    // hood OD, drop below the floor; open bottom drains it

// ---- derived ----
bay_l = max(bank[0], maker[0] + gap + asb[0]) + 2*clr;
in_w  = max(bank[1], maker[1], asb[1], afe[0]) + 2*clr;
afe_l = afe[1] + 2*clr + 8;           // extra room for the ribbon plug
afe_z = boss[1] - seat_depth + foam_c + sensor_drop; // standoff height above the floor
deck_z = bank[2] + 4;
in_h  = max(deck_z + 1.6 + comp_h, afe_z + 1.6 + 12);
L = wall + bay_l + afe_l + wall;
W = 2*wall + in_w;
H = floor_t + in_h;
afe_at = [wall + bay_l + clr, wall + (in_w - afe[0])/2]; // AFE corner
ports = [afe_at + sn1, afe_at + sn2];
lug_r = 5;
lug_at = [[-lug_r+1, -lug_r+1], [L+lug_r-1, -lug_r+1], [-lug_r+1, W+lug_r-1], [L+lug_r-1, W+lug_r-1]];
$fn = 40;

module standoff(h, od, id) {
  // sunk 0.5 into the floor so it fuses instead of just touching
  difference() { translate([0,0,-0.5]) cylinder(h=h+0.5, d=od); translate([0,0,h-insert_l]) cylinder(h=insert_l+1, d=id); }
}

// rectangular ring of width w, centred on the wall line, offset `out` outward from it
module rim_ring(w, h, out = 0) {
  o = wall/2 + out;
  difference() {
    translate([o - w/2, o - w/2, 0]) cube([L - 2*o + w, W - 2*o + w, h]);
    translate([o + w/2, o + w/2, -1]) cube([L - 2*o - w, W - 2*o - w, h + 2]);
  }
}

module tray() {
  difference() {
    union() {
      // compression rib on the rim; presses the cord seated in the lid groove
      translate([0, 0, H]) rim_ring(1, 1);
      difference() {
        cube([L, W, H]);
        translate([wall, wall, floor_t]) cube([L - 2*wall, in_w, H]);
      }
      for (p = lug_at) hull() {
        translate([p[0], p[1], 0]) cylinder(h=H, r=lug_r);
        translate([min(max(p[0],0),L-1), min(max(p[1],0),W-1), 0]) cube([1,1,H]);
      }
      // wall-mount flange on the back wall
      translate([-14, W, 0]) difference() {
        cube([L + 28, 4, H]);
        for (x = [7, L + 21], z = [H*0.3, H*0.75]) translate([x, -1, z]) rotate([-90,0,0]) cylinder(h=6, d=5);
      }
      // bank cradle ribs
      for (y = [wall + clr + bank[1] + 0.5]) translate([wall + 4, y, floor_t]) cube([bank[0] - 8, 2, 5]);
      // deck: Maker Pi Pico + ASB standoffs above the bank
      mx = wall + clr + (maker[0] - maker_holes[0])/2;
      my = wall + clr + (maker[1] - maker_holes[1])/2;
      for (i = [0,1], j = [0,1]) translate([mx + i*maker_holes[0], my + j*maker_holes[1], floor_t])
        standoff(deck_z, 7, insert_d);
      ax = wall + clr + maker[0] + gap;
      for (h = asb_holes) translate([ax + h[0], wall + clr + h[1], floor_t]) standoff(deck_z, 7, insert_d);
      // AFE standoffs (M2.5); board sits sensor-side down. Shim with washers to set foam squeeze.
      for (i = [0,1], j = [0,1])
        translate([afe_at[0] + (afe[1] - afe_holes[1])/2 + i*afe_holes[1],
                   afe_at[1] + (afe[0] - afe_holes[0])/2 + j*afe_holes[0], floor_t])
          standoff(afe_z, 6, m25_insert_d);
      for (p = ports) translate([p[0], p[1], floor_t]) cylinder(h=boss[1], d=boss[0]);
    }
    // lid screw inserts in the lugs (outside the gasket, so screws never leak)
    for (p = lug_at) translate([p[0], p[1], H - insert_l]) cylinder(h=insert_l+1, d=insert_d);
    // sensor port: through-hole + foam-ring seat on top of the boss
    for (p = ports) translate([p[0], p[1], 0]) {
      translate([0, 0, -1]) cylinder(h=floor_t + boss[1] + 2, d=port_d);
      translate([0, 0, floor_t + boss[1] - seat_depth]) cylinder(h=seat_depth + 1, d=seat_d);
    }
    // electronics bay: PG7 gland (charge/solar cable) and M12 breather vent, both low on the end wall
    translate([-1, W*0.3, floor_t + 10]) rotate([0,90,0]) cylinder(h=wall+2, d=12.6);
    translate([-1, W*0.7, floor_t + 10]) rotate([0,90,0]) cylinder(h=wall+2, d=12.3);
  }
}

module lid() {
  // printed dome-up as installed: flat underside on the bed, no supports.
  // Underside: gasket groove (glue the cord in) + drip kerf near the eave edge.
  difference() {
    intersection() {
      hull() {
        translate([-eave, -eave, 0]) cube([L + 2*eave, W + 2*eave, lid_t]);
        translate([L/2, W/2, lid_t]) resize([L*0.8, W*0.8, 2*dome_h]) sphere(d=10, $fn=96);
      }
      translate([-eave - 1, -eave - 1, 0]) cube([L + 2*eave + 2, W + 2*eave + 2, lid_t + dome_h + 1]);
    }
    translate([0, 0, -1]) rim_ring(groove[0], groove[1] + 1);
    translate([0, 0, -1]) rim_ring(1.2, 2, eave - 2 - wall/2); // drip kerf, ~2 mm in from the edge
    // screw holes + flat seat for washer/head on the sloped dome
    for (p = lug_at) translate([p[0], p[1], 0]) {
      translate([0, 0, -1]) cylinder(h=lid_t + dome_h + 2, d=3.4);
      translate([0, 0, lid_t + 2]) cylinder(h=dome_h, d=9);
    }
  }
}

module stadium(h, d) { hull() for (p = [[0, 0], sn2 - sn1]) translate(p) cylinder(h=h, d=d); }

module hood() {
  // printed flange-down. Glue under the port (acetone-weld for ASA, CA for PETG),
  // with stainless insect mesh trapped between flange and floor. No membrane:
  // it slows gas diffusion into the sensor.
  difference() {
    // stadium over both ports; origin at the SN1 port
    union() { stadium(2, pod[0] + 10); stadium(pod[1], pod[0]); }
    translate([0, 0, -1]) stadium(pod[1] + 2, pod[0] - 4);
  }
}

if (part == "tray" || part == "both") tray();
if (part == "lid") lid();
if (part == "pod") hood();
if (part == "both") {
  translate([0, 0, H + 1 + 30]) lid(); // exploded above the tray
  translate([ports[0][0], ports[0][1], -10]) mirror([0, 0, 1]) hood(); // exploded below the ports
}
echo(outer = [L, W, H]);
