pragma solidity ^0.5.5;
contract ProvenanceContract {
    
    mapping (string => string) public file2Hashes; 

    // File Event Log structure
    event FileEvent (
        string appID, 
        uint256 instant, 
        string fileName, 
        string fileHash, 
        address indexed owner,
        string UDF
    );

    // Trigger File Event when any CRUD operation
    function triggerFileEvent(string memory _appID, string memory _path, string memory _fileHash, string memory _udf) public returns (bool eventLogged) {
        emit FileEvent(_appID, block.timestamp, _path, _fileHash, msg.sender, _udf);
        string memory _absolutePath = getAbsoluteFilePath(_appID,_path);
        file2Hashes[_absolutePath] = _fileHash;
        return true;
    }
    
    // Generating Actual file path
    function getAbsoluteFilePath(string memory _appID, string memory _path) internal pure returns (string memory _absolutePath) {
        return string(abi.encodePacked(_appID,"/", _path));
    }
    
    // Get Hash of the file by name
    function getHashByName(string memory _path) public view returns (string memory _fileHash) {
        return file2Hashes[_path];
    }
}
