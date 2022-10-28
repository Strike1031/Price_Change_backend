import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
    uniquePoint: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    pairAddress: {
        type: String,
        required: true,
    },
    token0: {
        type: String,
        required: true,
    },
    token1: {
        type: String,
        required: true,
    },
    symbol0: {
        type: String,
        required: true,
        index: true,
    },
    symbol1: {
        type: String,
        required: true,
        index: true,
    },
    reserves0: {
        type: String,
        required: true,
    },
    reserves1: {
        type: String,
        required: true,
    },
    token0Amount: {
        type: String,
        required: true,
    },
    token1Amount: {
        type: String,
        required: true,
    },
    transactionhash: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    amount0In: {
        type: String,
        required: true,
    },
    amount1In: {
        type: String,
        required: true,
    },
    amount0Out: {
        type: String,
        required: true,
    },
    amount1Out: {
        type: String,
        required: true,
    },
    DEX: {
        type: String,
    },
    network: {
    },
    createdAt: {
        type: Date,
        required: true,
    },
}, {collection: 'PCS'});

export default mongoose.model('tx', txSchema);