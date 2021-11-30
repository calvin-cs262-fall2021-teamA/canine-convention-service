/**
 * This module implements a REST-inspired webservice for the Monopoly DB.
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the player table only.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-monopoly-service.herokuapp.com/players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 *
 * TODO: Consider using Prepared Statements.
 *      https://vitaly-t.github.io/pg-promise/PreparedStatement.html
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.
const pgp = require("pg-promise")();
const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Configure the server and its routes.

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

// Routes for SQL calls
router.get("/", readHelloMessage);
router.get("/allPersons", readPersons);

/* Sample Routes

router.delete('/persons/:id', deletePerson);

*/

// Profile routes
router.post("/persons", createPerson);
router.get("/person/:id", readPerson);
router.get("/person/:id/dogs", readPersonDogs);
router.put("/persons/name/:id", updatePersonFirstName);
router.put("/persons/surname/:id", updatePersonLastName);
router.put("/persons/email/:id", updatePersonEmail);
router.put("/persons/phone/:id", updatePersonPhone);
router.put("/persons/image/:id", updatePersonImage);
router.get("/dog/:id", readDog);
router.post("/dog", createDog);
router.delete("/dog/:id", deleteDog);
router.put("/dog/name/:id", updateDogName);
router.put("/dog/birthdate/:id", updateDogBirthdate);
router.put("/dog/personality/:id", updateDogPersonality);
router.put("/dog/gender/:id", updateDogGender);
router.put("/dog/neutered/:id", updateDogNeutered);
router.put("/dog/image/:id", updateDogImage);
router.put("/dog/size/:id", updateDogSize);

// Event finding routes
router.post("/event", createEvent);
router.get("/events", readEvents);
router.put("/event/:id", updateEvent);
router.post("/event/join/:id", joinEvent);


app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function errorHandler(err, req, res) {
  if (app.get("env") === "development") {
    console.log(err);
  }
  res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send("Canine Convention coming through!");
}

function readPersons(req, res, next) {
    db.many("SELECT * FROM Person")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

// Create new person
function createPerson(req, res, next) {
  db.one(
    "INSERT INTO Person(firstName, lastName, email, phone) VALUES (${firstName}, ${lastName}, ${email}, ${phone}) RETURNING id",
    req.body
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// Read individual person info
function readPerson(req, res, next) {
  db.oneOrNone("SELECT * FROM Person WHERE id=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Read person's dogs
function readPersonDogs(req, res, next) {
  db.many("SELECT * FROM Dog WHERE personID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Read individual dog info
function readDog(req, res, next) {
  db.oneOrNone("SELECT * FROM Dog WHERE ID=${id}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update person firstName
function updatePersonFirstName(req, res, next) {
  db.oneOrNone(
    "UPDATE Person SET firstName=${body.firstName} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update person lastName
function updatePersonLastName(req, res, next) {
  db.oneOrNone(
    "UPDATE Person SET lastName=${body.lastName} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update person email
function updatePersonEmail(req, res, next) {
  db.oneOrNone(
    "UPDATE Person SET email=${body.email} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update person phone number
function updatePersonPhone(req, res, next) {
  db.oneOrNone(
    "UPDATE Person SET phone=${body.phone} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update person image
function updatePersonImage(req, res, next) {
  db.oneOrNone(
    "UPDATE Person SET image=${body.image} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Create Dog
function createDog(req, res, next) {
  db.one(
    "INSERT INTO Dog(personID, dogName, Birthdate, Personality, Gender, Neutered, Size, image) VALUES (${personID}, ${dogName}, ${Birthdate}, ${Personality}, ${Gender}, ${Neutered}, ${Size}, ${image}) RETURNING id",
    req.body
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// Delete dog
function deleteDog(req, res, next) {
    db.oneOrNone('DELETE FROM Dog WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

// Update dog name
function updateDogName(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET dogName=${body.dogName} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update dog birthday
function updateDogBirthdate(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET Birthdate=${body.Birthdate} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update dog personality
function updateDogPersonality(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET Personality=${body.Personality} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update dog gender
function updateDogGender(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET Gender=${body.Gender} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update dog neutered status
function updateDogNeutered(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET Neutered=${body.Neutered} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update dog image
function updateDogImage(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET image=${body.image} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}


// Update dog size
function updateDogSize(req, res, next) {
  db.oneOrNone(
    "UPDATE Dog SET Size=${body.Size} WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Find Events
function readEvents(req, res, next) {
  db.many("SELECT id FROM Activity WHERE Attendees < 2", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Create Event
function createEvent(req, res, next) {
  db.one(
    "INSERT INTO Activity(location) VALUES (${location}) RETURNING id",
    req.body
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// Update Event
function updateEvent(req, res, next) {
  db.oneOrNone(
    "UPDATE Activity SET Attendees = Attendees + 1 WHERE id=${params.id} RETURNING id",
    req
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Join Event
function joinEvent(req, res, next) {
  db.oneOrNone(
    "INSERT INTO DogActivity VALUES (${dogID}, ${activityID} ) RETURNING id",
    req.body
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
