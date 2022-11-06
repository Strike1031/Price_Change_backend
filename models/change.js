import mongoose from "mongoose";
const changeSchema = new mongoose.Schema({
    token0Symbol: {
        type: String,
        required: true,
    },
    token1Symbol: {
        type: String,
        required: true,
    },
    price1: {
        type: String,
        required: true,
    },
    priceChange_5m: {
        type: String,
        required: true,
    },
    priceChange_1h: {
        type: String,
        required: true,
    },
    priceChange_6h: {
        type: String,
        required: true,
    },
    priceChange_24h: {
        type: String,
        required: true,
    },
    marketCap: {
        type: String,
    },
    volume: {
        type: String,
    },
    txns: {
        type: String,
    },
    liquidity: {
        type: String,
    },
    dex: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        required: true,
    },
}, {collection: 'CHANGE'});

export default mongoose.model('Change', changeSchema);