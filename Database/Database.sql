-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS DogActivity;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Dog;
DROP TABLE IF EXISTS DogOwner;

-- Create the schema.
CREATE TABLE DogOwner (
	ID integer PRIMARY KEY, 
	emailAddress varchar(50) NOT NULL,
	passwords varchar(50) NOT NULL,
	Phone_number varchar(50) NOT NULL
	);

CREATE TABLE Dog (
	ID integer PRIMARY KEY, 
	name varchar(50) NOT NULL,
	Birthdate date NOT NULL,
	Breed varchar(50) NOT NULL,
	Personality varchar(50) NOT NULL,
	Gender varchar(50) NOT NULL,
	Neutered boolean NOT NULL
	);

CREATE TABLE Activity (
	ID integer PRIMARY KEY,
	location varchar(50) NOT NULL,
	EventTime timestamp with time zone NOT NULL,
	Age integer NOT NULL,
	Breed varchar(50) NOT NULL,
	Personality varchar(50) NOT NULL,
	Gender varchar(50) NOT NULL,
	Neutered boolean NOT NULL
	);

CREATE TABLE DogActivity (
	dogID integer REFERENCES Dog(ID),
	eventID integer REFERENCES Activity(ID)
);

-- Allow users to select data from the tables.
GRANT SELECT ON DogOwner TO PUBLIC;
GRANT SELECT ON Dog TO PUBLIC;
GRANT SELECT ON Activity TO PUBLIC;
GRANT SELECT ON DogActivity TO PUBLIC;



