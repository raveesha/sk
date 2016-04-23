/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var db = require('../../../sqldb');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode,err) {
  console.log(err)
  statusCode = statusCode || 500;
  res.status(statusCode).send(err);
}

// Gets a list of Hotels
exports.index =  function (req, res) {
  db.Hotel.findAll({
    where:{
      chain_id:req.params.chainId
    }
  })
    .then(respondWithResult(res))
    .catch(function(err){ handleError(res,500,err)});
}

// Gets a single Hotel from the DB
exports.show = function(req, res) {
  db.Hotel.find({
    attributes:['id','name'],
    where: {
      id: req.params.id,
      chain_id:req.params.chainId
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(function(err){ handleError(res,500,err)});
}

// Creates a new Hotel in the DB
exports.create =function(req, res) {
  db.Hotel.build(req.body)
    .set("chain_id",req.params.chainId)
    .save()
    .then(function(hotel){ return res.status(201).json(hotel)})
    .catch(function(err){ handleError(res,500,err)});
}

// Updates an existing Hotel in the DB
exports.update =function(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  db.Hotel.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(function(err){ handleError(res,500,err)});
}

// Deletes a Hotel from the DB
exports.destroy= function (req, res) {
 db.Hotel.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(function(err){ handleError(res,500,err)});
}
