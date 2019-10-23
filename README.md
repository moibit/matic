![MoiBit + Matic](https://raw.githubusercontent.com/moibit/logo-assets/master/partnerships/moibit%2Bmatic.png)

# @moibitjs/matic

[![Chat on Slack](https://img.shields.io/badge/Slack-MoiBit%20Slack%20community-blue)](https://join.slack.com/t/moibit/signup)
[![Chat on Telegram](https://img.shields.io/badge/Telegram-MoiBit%20Telegram%20community-blue)](https://t.me/moibit)
[![Follow us on Twitter](https://img.shields.io/badge/Twitter-MoiBit%20Twitter-blue?style=social&logo=twitter)](https://twitter.com/moibitio)

**MoiBitJS/matic** uses [MoiBitJS/core module](https://github.com/moibit/core) to perform file actions and the provenance of files will be stored in [Matic network](https://matic.network).

## Get Started

``` js
import  Matic  from  'maticjs'
import  MoiBit  from  '@moibitjs/matic'
// Initialize matic object
let _matic = new Matic({
	parentProvider : 'https://ropsten.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc',
	maticProvider : 'https://testnet2.matic.network'
});

// Initialize moibit object with matic object as parameter
let  mFiles = new  MoiBit(_matic)
await  mfiles.init('<your-url>',{
	API_KEY :  '<your-api-key>'
	API_SECRET : '<your-api-secret>'
});

//needs signing of transaction to matic network that stores multihash for provenance, before adding file to moibit
await  mfiles.add(file,'sample.txt')
```

## Functions
### new MoiBit(maticObject)
Bind your matic object to moibit
``` js
var  mFiles = new  MoiBit(maticObject)
```
### mFiles.init(url,accessToken)
Initialize your MoiBit Object with matic. Get your MoiBit account [here](https://account.moibit.io). After signing up you will be getting **_API_KEY , API_SECRET , URL_**

-  <code>url</code> you got after signing up

-  <code>accessToken</code> is a combination of _API_KEY_ and _API_SECRET_

``` js
await  mFiles.init('<your-url>',{
	API_KEY :  '<your-api-key>' ,
	API_SECRET :  '<your-api-secret>'
});
```
### mFiles.add(file,path,options)

Add file of any type which will be stored in MoiBit and the returned multi-hash will be stored in matic chain where you are expected to sign a transaction.
-  <code>file</code> can be window file object or stream
-  <code>path</code> is an absolute path in your files directory at which you want the file to be inserted.
-  <code>options</code>
-  `createFolders` is a boolean value which specifies to create a folder/not if it is not existing , that was mentioned in above path attribute (_default : true_)
-  `pinVersion` is a boolean value which tells to pin the file while adding.(_default : false_)

``` js
await  mFiles.add(fileObject,'parent1/folder2/file3.txt');
```

### mFiles.read(path,responseType)

Returns file with specified return type only if the hash stored 
**on-chain (ie., in Matic) and off-chain (ie., in MoiBit) are same**,
 if not returns negative response 
 ``` js
 {
		 validation : failed, 
		 message : 'No record matching <off-chain hash>'
}
```

- `path` is an absolute path

- `responseType` can be anything among

- _arraybuffer , document , json , text , stream_

- _blob - browser only_
``` js
await  mFiles.read('parent1/folder2/file3.txt','blob');
```
to do more actions other than `add & read` with files module visit [@moibitjs/core](https://github.com/moibit/core)
