const getCurrentTimeStamp = () =>
  new Date().toISOString().slice(0, 19).replace("T", " ");

export default getCurrentTimeStamp;
