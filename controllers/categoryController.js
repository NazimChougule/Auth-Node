const models = require('../models');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await models.categories.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: {
                categories
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await models.categories.findOne({
            where: {
                id: [id]
            }
        });
        res.status(200).json({
            status: 'success',
            data: {
                categories: category
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const category = await models.categories.create({
            name: req.body.name,
            createdBy: req.userName.toTitleCase(),
        });
        res.status(201).json({
            status: 'success',
            data: {
                category
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Bad Request',
            err: err
        });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await models.categories.update(req.body, {
            where: {
                id: [id]
            }
        });
        res.status(200).json({
            status: 'success',
            message: 'Category updated successfully'
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not found',
            err: err
        });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await models.products.destroy({
            where: {
                categoryId: [id]
            }
        });
        await models.categories.destroy({
            where: {
                id: [id]
            }
        })
        res.status(200).json({
            status: 'success',
            message: 'Category deleted successfully'
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not found'
        });
    }
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};