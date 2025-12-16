const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAllWithServiceCount();
        res.json({ categories });
    } catch (error) {
        next(error);
    }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ category });
    } catch (error) {
        next(error);
    }
};

// Create category (admin only)
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const categoryId = await Category.create({ name, description });
        const category = await Category.findById(categoryId);

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Update category (admin only)
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await Category.update(req.params.id, { name, description });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res, next) => {
    try {
        const deleted = await Category.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};
