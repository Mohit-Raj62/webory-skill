import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        unique: true,
    },
    slug: {
        type: 'string',
        lowercase: true,
    }
});

export default mongoose.model('Category', CategorySchema)