const validateStatus = (status) => {
    if (notEmpty(status) && (status !== "active" || status !== "inactive")) {
        return true;
    }else{
        return false;
    }
}

const validateGender = (gender) => {
    if (notEmpty(gender) && (gender !== "male" || gender !== "female")) {
        return true;
    }else{
        return false;
    }
}

const notEmpty = (value) => {
    if(value !== undefined && value !== "" && value !== null){
        return true;
    }else{
        return false;
    }
}
module.exports = {validateStatus, validateGender, notEmpty}