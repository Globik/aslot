-- \i /home/globi/aslot/sql/guest.sql
-- \i /root/aslot/sql/guest.sql

drop table if exists guest;
CREATE TABLE IF NOT EXISTS guest(
city VARCHAR (30),
country varchar(20),
d timestamp not null default now());

-- sudo su postgres

-- psql -d {database}
д--алее назначаем права
-- GRANT ALL ON SCHEMA public TO {user};
