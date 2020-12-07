import MoiBit from '@moibitjs/core';
import FilesArtifact from './FilesProvenance.json';
export default class {
    /**
     * @contructor takes matic object as a parameter
     * initialising contract config to make calls
    */
    constructor(_m) {
        this._app = {}
        this._matic = _m
        this._provenanceContract = new _m._web3.eth.Contract(
            FilesArtifact,
            '0xce1Bd5d5FF81bA407aAaEc8Fd915a3C25Bbf391c'
        )
    }

    // Bind your moibit account to matic object.
    async init(network, _aT) {
        try {
            if (network !== undefined && _aT !== undefined) {
                const aT = {
                    api_key: _aT['API_KEY'],
                    api_secret: _aT['API_SECRET']
                }
                let App = new MoiBit(network, aT);
                this._app = App
            }
            else {
                throw new Error('Either access token or network cannot be undefined')
            }
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    // Getting the moibit address from public key
    getMoibitAddress(str) {
        const keccak256 = require('keccak256')
        const bArray = keccak256(str);
        const inDirectedAddress = bArray.slice(Math.max(bArray.length - 20, 0));
        return '0x'+inDirectedAddress.toString('hex');
    }

    //Add file of any type which is stored in MoiBit and the returned multi-hash will be stored in matic chain to which you were connected.
    async add(file, filePath, options={}) {
        try {
            options['fileName'] = filePath;
            let response = await this._app.addFile(file, options);
            const currentAccount = (await this._matic._web3.eth.getAccounts())[0];
            let moibitAddress = this.getMoibitAddress(this._app._fileApi.accessToken.api_key);
            let result = await this._provenanceContract.methods.triggerFileEvent(moibitAddress, options.fileName, response.data.data.Hash,'Added '+options.fileName).send({ from: currentAccount })
            if(result) {
                return response
            }
        }
        catch (error) {
            throw new Error(error.message)
        }
    }
    
    // This function returns file added with mentioned return type if the hash stored on-chain (ie., in Matic) and off-chain (ie., in MoiBit) are same, if not same returns File modified off-chain
    async read(fileName,responseType) {
        try {
            let offChainFileHash = (await this.fileDetail(fileName)).data.data.Hash;
            let moibitAddress = this.getMoibitAddress(this._app._fileApi.accessToken.api_key)
            let onChainFileHash = await this._provenanceContract.methods.getHashByName(moibitAddress + '/' + fileName).call();
            if (offChainFileHash == onChainFileHash) {
                let response = await this._app.read(fileName,responseType)
                return response
            }
            else {
                return {
                    validation : 'failed',
                    message : 'No record matching '+offChainFileHash
                }
            }
        }
        catch (error) {
            throw new Error(error)
        }
    }

    //This function returns file added with mentioned return type.
    async readFromHash(hash,responseType) { await this._app.readFileByHash(hash,responseType) }

    // This function returns array of files within the folder mentioned.
    async list(folderpath) { return await this._app.list(folderpath) }

    //Removes the file from MoiBit and returns back the acknowledgement
    async remove(absoluteFilePath) { return await this._app.remove(absoluteFilePath) }
    
    //Pins the file in MoiBit , so that garbage Collector won't collect the file even though the file was not accessed for a long time.
    async pin(data) { return await this._app.addPin(data) }

    //Unpins the pinned file in MoiBit , so that garbage Collector got the access to collect the file which was not accessed for a long time.
    async unPin(data) { return await this._app.removePin(data) }

    //Returns complete detail about the file
    async fileDetail(filePath) { return await this._app.fileStats(filePath) }

    //Returns all the storage details of the particular account (you did init with) in specific Unit.
    async storageDetails(unit) { return await this._app.storageUsed(unit) }
}
