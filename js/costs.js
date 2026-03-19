// Buffalo, NY (Erie County) Rehab Cost Database — 2024-2025 Market Rates
const COSTS = {
  // ── FLOORS ──
  "Floors|Hardwood|Replace":  { low: 6, mid: 12, high: 25, unit: "sq ft" },
  "Floors|Hardwood|Refinish": { low: 3, mid: 5.5, high: 8, unit: "sq ft" },
  "Floors|Hardwood|Repair":   { low: 3, mid: 6.5, high: 10, unit: "sq ft" },
  "Floors|Hardwood|Demo":     { low: 1, mid: 2.5, high: 5, unit: "sq ft" },
  "Floors|LVP|Replace":       { low: 4, mid: 7.5, high: 16, unit: "sq ft" },
  "Floors|LVP|Repair":        { low: 2, mid: 4, high: 8, unit: "sq ft" },
  "Floors|LVP|Demo":          { low: 1, mid: 1.5, high: 3, unit: "sq ft" },
  "Floors|Tile|Replace":      { low: 10, mid: 18, high: 30, unit: "sq ft" },
  "Floors|Tile|Repair":       { low: 5, mid: 10, high: 18, unit: "sq ft" },
  "Floors|Tile|Demo":         { low: 2, mid: 4, high: 7, unit: "sq ft" },
  "Floors|Carpet|Replace":    { low: 2, mid: 5, high: 8, unit: "sq ft" },
  "Floors|Carpet|Demo":       { low: 0.7, mid: 1, high: 1.6, unit: "sq ft" },
  "Floors|Epoxy|Replace":     { low: 3, mid: 5, high: 8, unit: "sq ft" },

  // ── WALLS ──
  "Walls|Drywall|Replace": { low: 2, mid: 3.5, high: 5, unit: "sq ft" },
  "Walls|Drywall|Repair":  { low: 1, mid: 2, high: 3, unit: "sq ft" },
  "Walls|Drywall|Paint":   { low: 1.5, mid: 2.5, high: 4, unit: "sq ft" },
  "Walls|Drywall|Demo":    { low: 1, mid: 1.5, high: 2, unit: "sq ft" },
  "Walls|Plaster|Replace": { low: 3, mid: 5, high: 8, unit: "sq ft" },
  "Walls|Plaster|Repair":  { low: 2, mid: 3.5, high: 5, unit: "sq ft" },
  "Walls|Plaster|Paint":   { low: 1.5, mid: 2.5, high: 4, unit: "sq ft" },
  "Walls|Plaster|Demo":    { low: 1.5, mid: 2.5, high: 4, unit: "sq ft" },

  // ── CEILINGS ──
  "Ceilings|Drywall|Replace":      { low: 2, mid: 3.5, high: 5, unit: "sq ft" },
  "Ceilings|Drywall|Repair":       { low: 1, mid: 2, high: 3, unit: "sq ft" },
  "Ceilings|Drywall|Paint":        { low: 1, mid: 2, high: 3, unit: "sq ft" },
  "Ceilings|Plaster|Replace":      { low: 3, mid: 5, high: 8, unit: "sq ft" },
  "Ceilings|Plaster|Repair":       { low: 2, mid: 3.5, high: 5, unit: "sq ft" },
  "Ceilings|Plaster|Paint":        { low: 1, mid: 2, high: 3, unit: "sq ft" },
  "Ceilings|Drop Ceiling|Replace": { low: 3, mid: 5, high: 8, unit: "sq ft" },
  "Ceilings|Drop Ceiling|Repair":  { low: 1, mid: 2, high: 4, unit: "sq ft" },

  // ── TRIM ──
  "Trim|Baseboard|Replace": { low: 3, mid: 5, high: 8, unit: "lin ft" },
  "Trim|Baseboard|Paint":   { low: 1, mid: 2, high: 3, unit: "lin ft" },
  "Trim|Baseboard|Repair":  { low: 2, mid: 3.5, high: 5, unit: "lin ft" },
  "Trim|Crown|Replace":     { low: 4, mid: 7, high: 12, unit: "lin ft" },
  "Trim|Crown|Paint":       { low: 1, mid: 2, high: 3, unit: "lin ft" },
  "Trim|Casing|Replace":    { low: 3, mid: 5, high: 8, unit: "lin ft" },
  "Trim|Casing|Paint":      { low: 1, mid: 2, high: 3, unit: "lin ft" },

  // ── DOORS ──
  "Doors|Hollow Core|Replace": { low: 178, mid: 265, high: 350, unit: "each" },
  "Doors|Hollow Core|Paint":   { low: 50, mid: 75, high: 100, unit: "each" },
  "Doors|Solid Core|Replace":  { low: 250, mid: 385, high: 524, unit: "each" },
  "Doors|Solid Core|Paint":    { low: 50, mid: 75, high: 100, unit: "each" },
  "Doors|Exterior|Replace":    { low: 456, mid: 850, high: 1238, unit: "each" },
  "Doors|Exterior|Paint":      { low: 75, mid: 125, high: 200, unit: "each" },
  "Doors|Storm|Replace":       { low: 200, mid: 350, high: 500, unit: "each" },

  // ── WINDOWS ──
  "Windows|Vinyl DH|Replace":  { low: 400, mid: 550, high: 700, unit: "each" },
  "Windows|Casement|Replace":  { low: 450, mid: 625, high: 800, unit: "each" },
  "Windows|Egress|Replace":    { low: 2000, mid: 3500, high: 5000, unit: "each" },

  // ── LIGHTS & DEVICES ──
  "Lights and Devices|Outlet|Replace":       { low: 100, mid: 175, high: 250, unit: "each" },
  "Lights and Devices|GFCI|Replace":         { low: 130, mid: 190, high: 250, unit: "each" },
  "Lights and Devices|Light Fixture|Replace": { low: 100, mid: 200, high: 300, unit: "each" },
  "Lights and Devices|Recessed|Replace":     { low: 150, mid: 225, high: 300, unit: "each" },

  // ── PLUMBING ──
  "Sink Drain|Standard|Replace":       { low: 200, mid: 350, high: 500, unit: "each" },
  "Sink Drain|Standard|Repair":        { low: 100, mid: 200, high: 350, unit: "each" },
  "Sink Water Lines|Standard|Replace": { low: 200, mid: 350, high: 500, unit: "each" },
  "Sink Water Lines|Standard|Repair":  { low: 100, mid: 200, high: 350, unit: "each" },
  "Bathtub|Standard|Replace":          { low: 800, mid: 1150, high: 1500, unit: "each" },
  "Bathtub|Standard|Refinish":         { low: 300, mid: 450, high: 600, unit: "each" },
  "Bathtub|Standard|Repair":           { low: 200, mid: 400, high: 600, unit: "each" },
  "Shower walls|Surround|Replace":     { low: 500, mid: 1000, high: 1500, unit: "each" },
  "Shower walls|Tile|Replace":         { low: 1200, mid: 2000, high: 3000, unit: "each" },
  "Toilet|Standard|Replace":           { low: 250, mid: 370, high: 500, unit: "each" },
  "Toilet|Standard|Repair":            { low: 100, mid: 200, high: 350, unit: "each" },
  "Vanity|Budget|Replace":             { low: 300, mid: 400, high: 500, unit: "each" },
  "Vanity|Mid Range|Replace":          { low: 500, mid: 750, high: 1000, unit: "each" },
  "Vanity|High End|Replace":           { low: 1000, mid: 1750, high: 2500, unit: "each" },

  // ── KITCHEN ──
  "Kitchen Cabinets|Stock|Replace":       { low: 60, mid: 130, high: 200, unit: "lin ft" },
  "Kitchen Cabinets|Semi-Custom|Replace": { low: 100, mid: 350, high: 650, unit: "lin ft" },
  "Kitchen Cabinets|Custom|Replace":      { low: 500, mid: 850, high: 1200, unit: "lin ft" },
  "Kitchen Cabinets|Stock|Reface":        { low: 200, mid: 350, high: 500, unit: "lin ft" },
  "Kitchen Cabinets|Semi-Custom|Reface":  { low: 200, mid: 350, high: 500, unit: "lin ft" },
  "Kitchen Cabinets|Custom|Reface":       { low: 200, mid: 350, high: 500, unit: "lin ft" },
  "Countertops|Laminate|Replace":         { low: 20, mid: 35, high: 50, unit: "sq ft" },
  "Countertops|Butcher Block|Replace":    { low: 40, mid: 60, high: 80, unit: "sq ft" },
  "Countertops|Quartz|Replace":           { low: 50, mid: 90, high: 150, unit: "sq ft" },
  "Countertops|Granite|Replace":          { low: 80, mid: 130, high: 200, unit: "sq ft" },

  // ── BASEMENT SYSTEMS ──
  "Electrical Panel|100A|Replace":         { low: 800, mid: 900, high: 1000, unit: "each" },
  "Electrical Panel|200A|Replace":         { low: 1800, mid: 3000, high: 4500, unit: "each" },
  "Electrical Panel|Fuse Convert|Replace": { low: 1500, mid: 3000, high: 4500, unit: "each" },
  "Hot water tank|Tank 40-50|Replace":     { low: 1200, mid: 1500, high: 2000, unit: "each" },
  "Hot water tank|Tankless|Replace":       { low: 2000, mid: 2800, high: 4000, unit: "each" },
  "Heat|Furnace|Replace":                  { low: 3200, mid: 4500, high: 6000, unit: "each" },
  "Heat|Boiler|Replace":                   { low: 3500, mid: 5500, high: 8000, unit: "each" },
  "Heat|Full HVAC|Replace":                { low: 7500, mid: 10000, high: 12500, unit: "each" },
  "Main stack|Cast Iron|Replace":          { low: 1500, mid: 2500, high: 4000, unit: "each" },
  "Main stack|PVC|Replace":                { low: 800, mid: 1500, high: 2500, unit: "each" },
  "Main stack|Cast Iron|Repair":           { low: 500, mid: 1000, high: 2000, unit: "each" },
  "Main stack|PVC|Repair":                 { low: 300, mid: 700, high: 1200, unit: "each" },
  "Main water lines|Copper|Replace":       { low: 1000, mid: 2000, high: 3500, unit: "each" },
  "Main water lines|PEX|Replace":          { low: 800, mid: 1500, high: 2500, unit: "each" },
  "Main water lines|Copper|Repair":        { low: 300, mid: 600, high: 1000, unit: "each" },
  "Main water lines|PEX|Repair":           { low: 200, mid: 400, high: 800, unit: "each" },

  // ── EXTERIOR ──
  "Siding|Vinyl|Replace":     { low: 4, mid: 6, high: 8, unit: "sq ft" },
  "Roof|Asphalt|Replace":     { low: 3.5, mid: 4.5, high: 5.5, unit: "sq ft" },
  "Gutters|Aluminum|Replace": { low: 3.4, mid: 4.35, high: 5.3, unit: "lin ft" },
  "Driveway|Concrete|Replace": { low: 8, mid: 11, high: 15, unit: "sq ft" }
};

function getCost(category, type, action, tier) {
  if (!type || !action || action === 'Keep') return 0;
  const key = `${category}|${type}|${action}`;
  const entry = COSTS[key];
  if (!entry) return 0;
  return entry[tier] || entry.mid;
}

function getCostUnit(category, type, action) {
  if (!type || !action || action === 'Keep') return '';
  const key = `${category}|${type}|${action}`;
  const entry = COSTS[key];
  return entry ? entry.unit : '';
}
