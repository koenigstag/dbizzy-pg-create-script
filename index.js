import { readFile } from 'fs/promises';
(async () => {
  const tableRowsMeta = 
  JSON.parse(
    await readFile(
      new URL('./table.json', import.meta.url)
    )
  );
  console.log(tableRowsMeta);


  const createScript = () => {
    const boilerplate = `CREATE TABLE IF NOT EXISTS "${}"`
  };













})();
