import factoryABI from './components/ABI/factoryABI.js';
import tokenABI from './components/ABI/tokenABI.js';
import pairABI from './components/ABI/pairABI.js';
import routerABI from './components/ABI/routerABI.js';

const data = {
    // mainDB: 'mongodb://admin:MasterDBDEXNodeAdm1n2022@51.195.60.1:27017/BSC?authSource=admin&readPreference=primary&directConnection=true&ssl=false',
    mainDB: 'mongodb://admin:DMCScr4perAdm1nDBase@146.190.208.102:27017/BSC?authSource=admin&readPreference=primary&directConnection=true&ssl=false',
    localDB: 'mongodb://127.0.0.1:27017/Dexmarketcap',
    rpc_BSC: 'http://51.77.68.21:8545',
    rpc_ETH: 'http://135.125.188.224:8545',
    socket: 'ws://localhost:8546',
    tokenABI: tokenABI(),
    pairABI: pairABI(),
    factoryABI: factoryABI(),
    routerABI: routerABI(),
};

export default function Config() {
    return data;
}
