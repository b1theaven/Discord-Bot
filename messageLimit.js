function messageLimit(str) {
    if (str.length > 1000) {
        return str.substring(0, 1001) + '...';
    } else {
        return str;
    }
  }
  
  module.exports = { messageLimit }