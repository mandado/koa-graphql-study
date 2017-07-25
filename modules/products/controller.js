const Product = require('../../domain/products/model');

const Joi = require('joi');

const schemaPayload = Joi.object().keys({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
    price: Joi.number().required()
});
const schemaParams = Joi.object().keys({
    id: Joi.string().required()
});

const validate = (payload, schemaValidate) => { 
    return Joi.validate(payload, schemaValidate,  { abortEarly: false }, (error, value) => {
        if (error) return { errors: error.details.map(error => error.message) };

        return value;
    })
}

class ProductController {
	static async index(ctx) {
		const products = await Product.find({});
		ctx.body = products;
	}

	static async create(ctx) {
        const payload = ctx.request.body;

        const data = await validate(payload, schemaPayload);

        if (data.errors) {
            ctx.status = 422;
            ctx.body = data;
        } else {
            const newProduct = await Product.create(data);
            ctx.status = 201;
            ctx.body = newProduct;
        }
	}

	static async show(ctx) {
        const params = await validate(ctx.params, schemaParams);

        if (params.errors) {
            ctx.status = 422;
            ctx.body = params
        } else {
            ctx.status = 200;
            ctx.body = await Product.findById(ctx.params.id);
        }
	}
    
	static async update(ctx) {
        const payload = ctx.request.body;

        const params = await validate(ctx.params, schemaParams);
        const data = await validate(payload, schemaPayload);

        if (params.errors || data.errors) {
            ctx.status = 422;
            ctx.body = (params.hasOwnProperty('errors')) ? params : data;
        } else {
            const updatedProduct = await Product.findOneAndUpdate(ctx.params.id, { $set: data }, {new: true});

            ctx.status = (updatedProduct !== null) ? 200 : 400;
            ctx.body = (updatedProduct !== null) ? updatedProduct : { error: 'Error in try update.'};
        }
	}
    
	static async remove(ctx) {
        const params = await validate(ctx.params, schemaParams);

        if (params.errors) {
            ctx.status = 422;
            ctx.body = params;
        } else {
            const removedProduct = await Product.findOneAndRemove(ctx.params.id);

            ctx.status = (removedProduct !== null) ? 200 : 400;
            ctx.body = (removedProduct !== null) ? removedProduct : { error: 'Error in try remove.'};
        }
	}
}

module.exports = ProductController;
