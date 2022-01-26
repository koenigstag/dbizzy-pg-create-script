# DBIZZY-PG-CREATE-SCRIPT

## Purpose
This project is used as a tool for generation of sql create scripts for [PostgreSQL](https://www.postgresql.org/) database.

This project uses [node-postgres](https://node-postgres.com/) package to connect ready PostgreSQL database and query table columns, their types, Primary Key and Foreign Key constraints.

Generated sql scripts can be used as input for [dbizzy.dbizzy](https://marketplace.visualstudio.com/items?itemName=dBizzy.dbizzy) vscode extension to visualize database tables as ERD.

## Usage
To generate sql create script simply insert host and port, database name, user and password. 

Also you need to pass tablenames for which you want to generate create scripts.

Then run 'start' npm script.

## Milestones
In future versions there are planned such features:
1) if none tablenames specified, then query all tables from selected database
2) 
