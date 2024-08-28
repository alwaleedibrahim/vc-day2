import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// //////////////////////////////////////////////////////////////////////////////////////// //
// Create an Admin
export const createAdmin = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            userName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Login Admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Find an Admin by ID
export const findAdminById = async (req, res) => {
    const { id } = req.user;

    try {
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Update an Admin
export const updateAdmin = async (req, res) => {
    const { id } = req.user;
    const updateData = req.body;

    console.log(req.user, id);
    
    try {
        const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.status(200).json({ message: "Admin updated successfully", admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Delete an Admin
export const deleteAdmin = async (req, res) => {
    const { id } = req.user;

    try {
        const adminDeleted = await Admin.findByIdAndDelete(id);
        if (!adminDeleted) return res.status(404).json({ message: "Admin not found" });

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
