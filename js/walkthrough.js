// Room definitions — mirrors the Excel Walkthrough sheet
// calcMode: area=LxW, walls=perimeter*ceilingHt, ceiling=LxW, trim=perimeter, qty=count, linft=linear feet
const ROOMS = [
  {
    name: 'Living Room', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Windows', types: ['Vinyl DH','Casement'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Dining Room', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Hallways', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Kitchen', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
      { cat: 'Sink Drain', types: ['Standard'], calc: 'qty' },
      { cat: 'Sink Water Lines', types: ['Standard'], calc: 'qty' },
      { cat: 'Kitchen Cabinets', types: ['Stock','Semi-Custom','Custom'], calc: 'linft' },
      { cat: 'Countertops', types: ['Laminate','Butcher Block','Quartz','Granite'], calc: 'area' },
    ]
  },
  {
    name: 'Bathroom 1', categories: [
      { cat: 'Floors', types: ['LVP','Tile'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
      { cat: 'Sink Drain', types: ['Standard'], calc: 'qty' },
      { cat: 'Sink Water Lines', types: ['Standard'], calc: 'qty' },
      { cat: 'Bathtub', types: ['Standard'], calc: 'qty' },
      { cat: 'Shower walls', types: ['Surround','Tile'], calc: 'qty' },
      { cat: 'Vanity', types: ['Budget','Mid Range','High End'], calc: 'qty' },
      { cat: 'Toilet', types: ['Standard'], calc: 'qty' },
    ]
  },
  {
    name: 'Bedroom 1', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Bedroom 2', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Bedroom 3', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Bathroom 2', categories: [
      { cat: 'Floors', types: ['LVP','Tile'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
      { cat: 'Sink Drain', types: ['Standard'], calc: 'qty' },
      { cat: 'Sink Water Lines', types: ['Standard'], calc: 'qty' },
      { cat: 'Bathtub', types: ['Standard'], calc: 'qty' },
      { cat: 'Shower walls', types: ['Surround','Tile'], calc: 'qty' },
      { cat: 'Vanity', types: ['Budget','Mid Range','High End'], calc: 'qty' },
    ]
  },
  {
    name: 'Basement', categories: [
      { cat: 'Floors', types: ['LVP','Tile','Carpet','Epoxy'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Drop Ceiling'], calc: 'ceiling' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
      { cat: 'Electrical Panel', types: ['100A','200A','Fuse Convert'], calc: 'qty' },
      { cat: 'Hot water tank', types: ['Tank 40-50','Tankless'], calc: 'qty' },
      { cat: 'Heat', types: ['Furnace','Boiler','Full HVAC'], calc: 'qty' },
      { cat: 'Main stack', types: ['Cast Iron','PVC'], calc: 'qty' },
      { cat: 'Main water lines', types: ['Copper','PEX'], calc: 'qty' },
    ]
  },
  {
    name: 'Bedroom 4', categories: [
      { cat: 'Floors', types: ['Hardwood','LVP','Tile','Carpet'], calc: 'area' },
      { cat: 'Walls', types: ['Drywall','Plaster'], calc: 'walls' },
      { cat: 'Ceilings', types: ['Drywall','Plaster'], calc: 'ceiling' },
      { cat: 'Trim', types: ['Baseboard','Crown','Casing'], calc: 'trim' },
      { cat: 'Doors', types: ['Hollow Core','Solid Core'], calc: 'qty' },
      { cat: 'Lights and Devices', types: ['Outlet','GFCI','Light Fixture','Recessed'], calc: 'qty' },
    ]
  },
  {
    name: 'Exterior', categories: [
      { cat: 'Siding', types: ['Vinyl'], calc: 'area' },
      { cat: 'Roof', types: ['Asphalt'], calc: 'area' },
      { cat: 'Gutters', types: ['Aluminum'], calc: 'linft' },
      { cat: 'Driveway', types: ['Concrete'], calc: 'area' },
      { cat: 'Doors', types: ['Exterior','Storm'], calc: 'qty' },
    ]
  },
];

const CONDITIONS = ['Good', 'Fair', 'Poor'];
const ACTIONS = ['Keep', 'Repair', 'Replace', 'Refinish', 'Paint', 'Demo', 'Reface'];

function calcQty(mode, length, width, ceilingHeight) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const ch = parseFloat(ceilingHeight) || 8;
  switch (mode) {
    case 'area': return l > 0 && w > 0 ? l * w : 0;
    case 'walls': return l > 0 && w > 0 ? 2 * (l + w) * ch : 0;
    case 'ceiling': return l > 0 && w > 0 ? l * w : 0;
    case 'trim': return l > 0 && w > 0 ? 2 * (l + w) : 0;
    case 'qty': return w > 0 ? w : (l > 0 ? l : 0);
    case 'linft': return l > 0 ? l : 0;
    default: return w > 0 ? w : 0;
  }
}

function needsDimensions(mode) {
  return ['area', 'walls', 'ceiling', 'trim'].includes(mode);
}

function dimLabels(mode) {
  switch (mode) {
    case 'area': case 'walls': case 'ceiling': case 'trim':
      return { dim1: 'Length (ft)', dim2: 'Width (ft)' };
    case 'qty':
      return { dim1: '', dim2: 'Qty' };
    case 'linft':
      return { dim1: 'Linear ft', dim2: '' };
    default:
      return { dim1: '', dim2: 'Qty' };
  }
}

function createBlankPropertyData() {
  const rooms = {};
  ROOMS.forEach(r => {
    rooms[r.name] = { length: 0, width: 0, items: {} };
    r.categories.forEach(c => {
      rooms[r.name].items[c.cat] = { type: '', condition: '', action: '', dim1: 0, dim2: 0 };
    });
  });
  return rooms;
}
