import axios from 'axios';
import * as fs from 'fs';
import * as data from './prisma/harvest-data-new.json';

const monsterid = 2532;
const monstername = 'Maéstrick Vaggerpiro el Canto Rodado';

async function dothething() {
  const monster = await axios.get<{
    subareas: number[];
    name: Record<string, string>;
  }>(`https://api.dofusdb.fr/monsters/${monsterid}?lang=es`);

  const url = monster.data.subareas.reduce((acc, sub) => {
    return acc.concat(`&id[]=${sub}`);
  }, 'https://api.dofusdb.fr/subareas?$skip=0&$select[]=id&$select[]=name&$select[]=mapIds&lang=es');

  const subareas = await axios.get<{
    data: { name: Record<string, string> }[];
  }>(url);

  const item = data.find(
    (i) => i.name.toLowerCase().trim() === monstername.toLowerCase().trim(),
  );

  if (!item) return;
  item.de = {
    name: monster.data.name.de,
    subzone: subareas.data.data.map((x) => x.name.de).join(', '),
  };
  item.en = {
    name: monster.data.name.en,
    subzone: subareas.data.data.map((x) => x.name.en).join(', '),
  };
  item.es = {
    name: monster.data.name.es,
    subzone: subareas.data.data.map((x) => x.name.es).join(', '),
  };
  item.fr = {
    name: monster.data.name.fr,
    subzone: subareas.data.data.map((x) => x.name.fr).join(', '),
  };
  item.it = {
    name: monster.data.name.it,
    subzone: subareas.data.data.map((x) => x.name.it).join(', '),
  };
  item.pt = {
    name: monster.data.name.pt,
    subzone: subareas.data.data.map((x) => x.name.pt).join(', '),
  };
  console.log(JSON.stringify(item, null, 2));
}

//dothething();
fixids();

async function fixids() {
  const harvest = await axios.get<{ harvest: { id: string }[] }>(
    'https://dofus-db.onrender.com/harvest',
  );

  const result = data.map((x, i) => ({ ...x, id: harvest.data.harvest[i].id }));
  fs.writeFileSync(
    './prisma/harvest-data-new.json',
    JSON.stringify(result, null, 2),
  );
}
