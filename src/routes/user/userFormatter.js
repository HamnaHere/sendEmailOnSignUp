
const FormateUserObj = (userObj) => {
    const obj = {};
    obj.id = userObj.id;
    obj.username = userObj.username;
    obj.email = userObj.email;
   

    return obj;
};

module.exports = {
    FormateUserObj
};