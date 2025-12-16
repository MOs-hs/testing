const db = require('../config/database');

class Category {
    // Get all categories
    static async findAll() {
        const [categories] = await db.query(
            'SELECT CategoryID, Name, Description FROM category ORDER BY Name'
        );
        return categories;
    }

    // Get category by ID
    static async findById(categoryId) {
        const [categories] = await db.query(
            'SELECT CategoryID, Name, Description FROM category WHERE CategoryID = ?',
            [categoryId]
        );
        return categories[0];
    }

    // Create category
    static async create(categoryData) {
        const { name, description } = categoryData;

        const [result] = await db.query(
            'INSERT INTO category (Name, Description) VALUES (?, ?)',
            [name, description]
        );

        return result.insertId;
    }

    // Update category
    static async update(categoryId, categoryData) {
        const { name, description } = categoryData;

        await db.query(
            'UPDATE category SET Name = ?, Description = ? WHERE CategoryID = ?',
            [name, description, categoryId]
        );

        return this.findById(categoryId);
    }

    // Delete category
    static async delete(categoryId) {
        const [result] = await db.query(
            'DELETE FROM category WHERE CategoryID = ?',
            [categoryId]
        );
        return result.affectedRows > 0;
    }

    // Get category with service count
    static async findAllWithServiceCount() {
        const [categories] = await db.query(`
      SELECT 
        c.CategoryID, 
        c.Name, 
        c.Description,
        COUNT(s.ServiceID) as ServiceCount
      FROM category c
      LEFT JOIN service s ON c.CategoryID = s.CategoryID
      GROUP BY c.CategoryID
      ORDER BY c.Name
    `);
        return categories;
    }
}

module.exports = Category;
