const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (requestAnimationFrame, res) => {
    //#swagger.tags=['Contacts']
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    }).catch((err) => {
        res.status(400).json({ message: err.message || 'Some error occurred while retrieving contacts.' });
    });
};

const getSingle = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to find a contact.');
    }
    //#swagger.tags=['Contacts']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    }).catch((err) => {
        res.status(400).json({ message: err.message || 'Some error occurred while retrieving the contact.' });
    });
};

const createContact = async (req, res) => {
    //#swagger.tags=['Contacts']
    const contact = {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        favColor: req.body.favColor,
        bday: req.body.bday,
    };
    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
};

const updateContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to find a contact.');
    }
    //#swagger.tags=['Contacts']
    const contactId = new ObjectId(req.params.id);
    const contact = {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        favColor: req.body.favColor,
        bday: req.body.bday,
    };
    const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
};

const deleteContact = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to find a contact.');
    }
    //#swagger.tags=['Contacts']
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};