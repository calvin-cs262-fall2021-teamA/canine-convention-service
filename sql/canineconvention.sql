-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS DogActivity;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Dog;
DROP TABLE IF EXISTS Person;

-- Create the schema.
CREATE TABLE Person (
	ID SERIAL PRIMARY KEY,
	firstName varchar(50),
	lastName varchar(50), 
	email varchar(50) NOT NULL,
	phone varchar(50) NOT NULL
	);

CREATE TABLE Dog (
	ID SERIAL PRIMARY KEY, 
	personID integer REFERENCES Person(ID),
	dogName varchar(50) NOT NULL,
	Birthdate date NOT NULL,
	Personality varchar(50) NOT NULL,
	Gender varchar(50) NOT NULL,
	Neutered boolean NOT NULL
	);

CREATE TABLE Activity (
	ID SERIAL PRIMARY KEY,
	location varchar(50) NOT NULL,
	EventTime timestamp with time zone,
	Age integer,
	Personality varchar(50),
	Gender varchar(50),
	Neutered boolean,
	Attendees integer DEFAULT 1 NOT NULL
	);

CREATE TABLE DogActivity (
	dogID integer REFERENCES Dog(ID),
	eventID integer REFERENCES Activity(ID)
	);

-- Allow users to select data from the tables.
GRANT SELECT ON Person TO PUBLIC;
GRANT SELECT ON Dog TO PUBLIC;
GRANT SELECT ON Activity TO PUBLIC;
GRANT SELECT ON DogActivity TO PUBLIC;