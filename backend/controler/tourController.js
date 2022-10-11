const express = require('express');
const  TourModel = require ('../models/tour');
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.createTour = async (req, res) => {
    const tour = req.body;
    const newTour = new TourModel({
        ...tour,createdAt: new Date().toISOString()
    })

    try {
        await newTour.save();
        res.status(201).json({newTour})
    } catch (error) {
        res.status(404).json({message:'Sommething went wrong'})
    }
}

module.exports.getTours = async (req, res) => {
    try {
        const tours = await TourModel.find();
        res.status(200).json(tours)
    } catch (error) {
        res.status(404).json({ message: "Sommething went wrong" });
    }
}
