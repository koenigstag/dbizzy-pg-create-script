const path = require('path');
const fs = require('fs/promises');
const { Client } = require('pg');
const {
  database,
  tablenames,
  user,
  host,
  password,
  port,
} = require('./database.json');

const client = new Client({
  database,
  user,
  host,
  password,
  port,
});
client.connect();

(async () => {
  const getColumns = async (tablename) =>
    await client.query(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '${tablename}';`
    );

  const getConstraints = async (type, tablename) =>
    await client.query(
      `SELECT
tc.constraint_name, 
  tc.table_schema,
  tc.table_name, 
  kcu.column_name, 
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = '${type}' AND tc.table_name='${tablename}';`
    );

  const createScript = async (tablename) => {
    const { rows: pks } = await getConstraints('PRIMARY KEY', tablename);
    const { rows: fks } = await getConstraints('FOREIGN KEY', tablename);
    const { rows: columns } = await getColumns(tablename);

    const prepareDataType = (column) => {
      const data_type = column.data_type;
      const max_length = column.character_maximum_length;
      const num_precision = column.numeric_precision;
      const numeric_scale = column.numeric_scale;

      return `${data_type}${
        data_type === 'numeric'
          ? `(${num_precision}, ${numeric_scale})`
          : max_length
          ? `(${max_length})`
          : ``
      }`;
    };

    const prepareConstraints = (column) => {
      const is_nullable = column.is_nullable;
      const column_default = column.column_default;

      const meta = `${is_nullable === 'NO' ? ' NOT NULL' : ''}${
        column_default
          ? ` DEFAULT ${
              column_default === 'true' || column_default === 'false'
                ? column_default.toUpperCase()
                : column_default
            }`
          : ``
      }`;

      return `${meta}`;
    };

    const addPKs = (pks) => {
      return pks
        .map(
          (pk) =>
            `CONSTRAINT "${pk.constraint_name}" PRIMARY KEY ("${pk.column_name}")`
        )
        .join(',\n\t');
    };

    const addFKs = (fks) => {
      return fks
        .map(
          (fk) =>
            `CONSTRAINT "${fk.constraint_name}" FOREIGN KEY ("${fk.column_name}") REFERENCES "${fk.foreign_table_name}"("${fk.foreign_column_name}")`
        )
        .join(',\n\t');
    };

    const pkRows = addPKs(pks);
    const fkRows = addFKs(fks);

    const boilerplate = `
CREATE TABLE ${tablename} (
${columns
  .map((col) => {
    return `\t"${col.column_name}" ${prepareDataType(col)}${prepareConstraints(
      col
    )}`;
  })
  .join(',\n')}${pkRows ? ',\n' + pkRows : ''}${fkRows ? ',\n' + fkRows : ''}
);
`;

    return boilerplate;
  };

  let script = '';
  for (const tablename of tablenames) {
    script += await createScript(tablename);
  }
  
  await fs.writeFile(path.resolve(__dirname, 'result.sql'), script);
})();
