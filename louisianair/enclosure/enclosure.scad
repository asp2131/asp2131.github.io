// Louisianair outdoor enclosure: ASA (or PETG for test fits), four parts.
// Export: openscad -D part=\"tray\" -o tray.stl enclosure.scad
//         openscad -D part=\"lid\"  -o lid.stl  enclosure.scad
//         openscad -D part=\"pod\"  -o pod.stl  enclosure.scad
//         openscad -D part=\"deck\" -o deck.stl enclosure.scad
//
// Layout: one sealed bay. Power bank on the floor, dropped in between two wall
// ledges. A removable deck plate screws onto the ledges over the bank and carries
// the Maker Pi Pico + ASB. Boards are narrower than the bank, so nothing may stand
// on the floor under them. AFE on standoffs at the far end, sensors pointing down.
// A gap at the gland end of the deck lets the USB cable climb from bank to Pico.
// Assembly: bank in, deck plate on (4 x M3 into the ledges), boards on the plate.
// Only the sensor faces (H2S in SN1, SO2 in SN2) meet outside air: each presses
// on a foam ring over a hole in the floor. The pod (open-bottom hood) glues
// under both holes.
// Wall-mount via the flange on the back wall; leave air space under the box.

part = "both"; // tray | lid | pod | deck | both

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
// deck: plate on wall ledges, boards on short standoffs on the plate
ledge_w = 8;       // how far each ledge sticks out of its wall; bank drops in between
ledge_h = 8;       // solid ledge depth below its top (holds the M3 insert)
bank_clr = 2;      // air between bank top and deck plate underside
plate_t = 2.4;
post_h = 5;        // board standoffs on the plate; plate + post must be > insert_l
cable_gap = 12;    // open strip at the gland end of the deck for the USB cable
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
bay_l = cable_gap + max(bank[0], maker[0] + gap + asb[0]) + 2*clr;
in_w  = max(bank[1] + 2*ledge_w + 2*clr, maker[1] + 2*clr, asb[1], afe[0] + 2*clr);
afe_l = afe[1] + 2*clr + 8;           // extra room for the ribbon plug
afe_z = boss[1] - seat_depth + foam_c + sensor_drop; // standoff height above the floor
deck_z = bank[2] + bank_clr;          // plate underside = ledge top, above the floor
board_z = deck_z + plate_t + post_h;  // board underside above the floor
in_h  = max(board_z + 1.6 + comp_h, afe_z + 1.6 + 12);
L = wall + bay_l + afe_l + wall;
W = 2*wall + in_w;
H = floor_t + in_h;
deck_x = wall + cable_gap;            // plate start; the cable gap is behind it
deck_l = wall + bay_l - deck_x;
bank_at = [wall + cable_gap + clr, wall + (in_w - bank[1])/2];
maker_at = [deck_x + clr, wall + (in_w - maker[1])/2];
asb_at = [maker_at[0] + maker[0] + gap, wall + (in_w - asb[1])/2];
// plate screws, on the ledge centrelines near the plate ends
plate_screws = [for (x = [deck_x + 5, deck_x + deck_l - 5], y = [wall + ledge_w/2, W - wall - ledge_w/2]) [x, y]];
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
      // bank cradle ribs, one each side
      for (y = [bank_at[1] - 2.5, bank_at[1] + bank[1] + 0.5]) translate([bank_at[0] + 4, y, floor_t]) cube([bank[0] - 8, 2, 5]);
      // deck ledges on both long walls; 45° chamfer underneath so they print without support
      for (side = [0, 1]) translate([deck_x, side ? W - wall : wall, 0]) mirror([0, side, 0]) hull() {
        translate([0, -0.5, floor_t + deck_z - ledge_h]) cube([deck_l, ledge_w + 0.5, ledge_h]);
        translate([0, -0.5, floor_t + deck_z - ledge_h - ledge_w]) cube([deck_l, 0.5, 0.01]);
      }
      // AFE standoffs (M2.5); board sits sensor-side down. Shim with washers to set foam squeeze.
      for (i = [0,1], j = [0,1])
        translate([afe_at[0] + (afe[1] - afe_holes[1])/2 + i*afe_holes[1],
                   afe_at[1] + (afe[0] - afe_holes[0])/2 + j*afe_holes[0], floor_t])
          standoff(afe_z, 6, m25_insert_d);
      for (p = ports) translate([p[0], p[1], floor_t]) cylinder(h=boss[1], d=boss[0]);
    }
    // lid screw inserts in the lugs (outside the gasket, so screws never leak)
    for (p = lug_at) translate([p[0], p[1], H - insert_l]) cylinder(h=insert_l+1, d=insert_d);
    // deck plate inserts in the ledges
    for (p = plate_screws) translate([p[0], p[1], floor_t + deck_z - insert_l]) cylinder(h=insert_l+1, d=insert_d);
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

module deck() {
  // printed flat; sits on the ledges, origin at the plate's corner (deck_x, wall + 0.5, ledge top).
  // Boards bolt to the posts (M3 inserts); 4 x M3 pan heads hold it to the ledges.
  w = in_w - 1;
  mx = maker_at[0] - deck_x + (maker[0] - maker_holes[0])/2;
  my = maker_at[1] - wall - 0.5 + (maker[1] - maker_holes[1])/2;
  difference() {
    union() {
      cube([deck_l, w, plate_t]);
      for (i = [0,1], j = [0,1]) translate([mx + i*maker_holes[0], my + j*maker_holes[1], plate_t]) standoff(post_h, 7, insert_d);
      for (h = asb_holes) translate([asb_at[0] - deck_x + h[0], asb_at[1] - wall - 0.5 + h[1], plate_t]) standoff(post_h, 7, insert_d);
    }
    for (p = plate_screws) translate([p[0] - deck_x, p[1] - wall - 0.5, -1]) cylinder(h=plate_t + 2, d=3.4);
    // vent slots so the bank's heat doesn't sit under the plate
    for (x = [30 : 22 : deck_l - 30]) translate([x, w/2 - 12, -1]) cube([4, 24, plate_t + 2]);
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
if (part == "deck") deck();
if (part == "both") translate([deck_x, wall + 0.5, floor_t + deck_z]) deck(); // installed
if (part == "both") {
  translate([0, 0, H + 1 + 30]) lid(); // exploded above the tray
  translate([ports[0][0], ports[0][1], -10]) mirror([0, 0, 1]) hood(); // exploded below the ports
}
echo(outer = [L, W, H], deck_z = deck_z, board_z = board_z, ledge_gap = in_w - 2*ledge_w);
