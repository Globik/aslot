-- \i /home/globi/aslot/sql/session.sql
-- \i /root/aslot/sql/session.sql

drop table if exists session;
CREATE TABLE IF NOT EXISTS session(
id TEXT NOT NULL PRIMARY KEY,
expiry timestamp NOT NULL,
session JSON);

