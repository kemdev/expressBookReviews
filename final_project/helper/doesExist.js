const doesExist = (arr, value) => {
  // Filter the users array for any user with the same username
  let userswithsamename = arr.filter((user) => {
    return user.username === value;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports.doesExist = doesExist;
