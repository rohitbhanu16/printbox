const Stationary = require('../models/Stationary');

//create a new stationary shop
exports.createStationary = async (req, res) => {
    const{name, location, contact, status = "open"} = req.body;

    try {
        const newStationary = new Stationary({name, location, contact, status});
        await newStationary.save();
        res.status(201).json({ message: 'Stationary shop created successfully', stationary: newStationary });
    } catch (error) {
        console.error('Error creating stationary shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// Delete a stationary shop
exports.deleteStationary = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStationary = await Stationary.findByIdAndDelete(id);
        if (!deletedStationary) {
            return res.status(404).json({ message: 'Stationary shop not found' });
        }
        res.status(200).json({ message: 'Stationary shop deleted successfully' });
    } catch (error) {
        console.error('Error deleting stationary shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all stationary shops
exports.getAllStationary = async (req, res) => {
    try {
        const stationaries = await Stationary.find();
        res.status(200).json(stationaries);
    } catch (error) {
        console.error('Error fetching stationary shops:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single stationary shop by ID
exports.getStationaryById = async (req, res) => {
    const { id } = req.params;

    try {
        const stationary = await Stationary.findById(id);
        if (!stationary) {
            return res.status(404).json({ message: 'Stationary shop not found' });
        }
        res.status(200).json(stationary);
    } catch (error) {
        console.error('Error fetching stationary shop:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
