const PatientRegistration = artifacts.require("PatientRegistration");

module.exports = async function(callback) {
  try {
    const instance = await PatientRegistration.deployed();
    const accounts = await web3.eth.getAccounts();
    
    console.log("Contract Address:", instance.address);
    const pat = "123456";
    const doc = "654321";
    const patName = "Alex";

    // Register
    console.log("Registering...");
    try {
        await instance.registerPatient(accounts[0], patName, "01/01/90", "M", "O+", "Address", "x@y.com", pat, "pw", {from: accounts[0]});
    } catch(e) { console.log("Already registered"); }

    // Grant
    console.log("Granting...");
    await instance.grantPermission(pat, doc, patName, {from: accounts[0]});
    console.log("Granted!");

    // Revoke
    console.log("Revoking...");
    try {
        await instance.revokePermission(pat, doc, {from: accounts[0]});
        console.log("Revoked successfully!");
    } catch(e) {
        console.error("Revoke Failed with error:", e.message);
    }
    
    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
}
