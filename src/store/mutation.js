const saveClassRoom = (state, obj) => {
  state.classroom = obj;
};
const login = (state, obj = {}) => {
  state.userInfo = obj;
};
export {
  saveClassRoom,
  login
};
