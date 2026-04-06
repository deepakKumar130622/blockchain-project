// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistration {
    struct Patient {
        address walletAddress;
        string name;
        string dateOfBirth;
        string gender;
        string bloodGroup;
        string homeAddress;
        string email;
        string hhNumber;
        string password;
    }

    struct PatientList{
        string patient_number;
        string patient_name;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) public patients;
    mapping(string => PatientList[]) private Dpermission;
    mapping(string => string[]) private Ppermission;
    mapping(string => mapping(string => bool)) public doctorPermissions;

    event PatientRegistered(string hhNumber, string name, address walletAddress);

    function registerPatient(
        address _walletAddress,
        string memory _name,
        string memory _dateOfBirth,
        string memory _gender,
        string memory _bloodGroup,
        string memory _homeAddress,
        string memory _email,
        string memory _hhNumber,
        string memory _password

    ) external {
        require(!isPatientRegistered[_hhNumber], "Patient already registered");

        Patient memory newPatient = Patient({
            walletAddress: _walletAddress,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            bloodGroup: _bloodGroup,
            homeAddress: _homeAddress,
            email: _email,    
            hhNumber: _hhNumber,        
            password: _password // Store password in the struct
        });

        patients[_hhNumber] = newPatient;
        isPatientRegistered[_hhNumber] = true;
        emit PatientRegistered(_hhNumber, _name, _walletAddress);
    }

    function isRegisteredPatient(string memory _hhNumber) external view returns (bool) {
        return isPatientRegistered[_hhNumber];
    }
    
    // Add a function to validate patient's password
    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_hhNumber].password));
    }

    function getPatientDetails(string memory _hhNumber) external view returns (
    address walletAddress,
    string memory name,
    string memory dateOfBirth,
    string memory gender,
    string memory bloodGroup,
    string memory homeAddress,
    string memory email
    ) {
        require(isPatientRegistered[_hhNumber], "Patient not registered");
        Patient memory patient = patients[_hhNumber];
        return (patient.walletAddress, patient.name, patient.dateOfBirth, patient.gender, patient.bloodGroup, patient.homeAddress, patient.email);
    }

    function grantPermission(
        string memory _patientNumber,
        string memory _doctorNumber,
        string memory _patientName
    ) external {
        require(!doctorPermissions[_patientNumber][_doctorNumber], "View Access already given to the Doctor!");
        // Check if the patient number already exists in the doctor's list
        bool exists = false;
        for (uint i = 0; i < Dpermission[_doctorNumber].length; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                exists = true;
                break;
            }
        }

        // If the patient number does not exist, add it to the doctor's list
        if (!exists) {
            PatientList memory newRecord = PatientList(
                _patientNumber,
                _patientName
            );
            Dpermission[_doctorNumber].push(newRecord);
        }

        // Add doctor to patient's list
        Ppermission[_patientNumber].push(_doctorNumber);

        doctorPermissions[_patientNumber][_doctorNumber] = true;
    }

    function revokePermission(
        string memory _patientNumber,
        string memory _doctorNumber
    ) external {
        if (!doctorPermissions[_patientNumber][_doctorNumber]) {
            return; // Access already not given
        }
        
        doctorPermissions[_patientNumber][_doctorNumber] = false;

        // Remove the patient from the doctor's list (Swap-and-Pop method)
        uint256 docLen = Dpermission[_doctorNumber].length;
        for (uint i = 0; i < docLen; i++) {
            if (keccak256(abi.encodePacked(Dpermission[_doctorNumber][i].patient_number)) == keccak256(abi.encodePacked(_patientNumber))) {
                if (i != docLen - 1) {
                    Dpermission[_doctorNumber][i].patient_number = Dpermission[_doctorNumber][docLen - 1].patient_number;
                    Dpermission[_doctorNumber][i].patient_name = Dpermission[_doctorNumber][docLen - 1].patient_name;
                }
                Dpermission[_doctorNumber].pop();
                break;
            }
        }

        // Remove the doctor from the patient's list (Swap-and-Pop method)
        uint256 patLen = Ppermission[_patientNumber].length;
        for (uint i = 0; i < patLen; i++) {
            if (keccak256(abi.encodePacked(Ppermission[_patientNumber][i])) == keccak256(abi.encodePacked(_doctorNumber))) {
                if (i != patLen - 1) {
                    Ppermission[_patientNumber][i] = Ppermission[_patientNumber][patLen - 1];
                }
                Ppermission[_patientNumber].pop();
                break;
            }
        }
    }

    function isPermissionGranted(string memory _patientNumber,string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_patientNumber][_doctorNumber];
    }

    function getPatientList(string memory _doctorNumber) public view returns (PatientList[] memory) {
        return Dpermission[_doctorNumber];
    }

    function getDoctorList(string memory _patientNumber) public view returns (string[] memory) {
        return Ppermission[_patientNumber];
    }
}
