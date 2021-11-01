
// 修改token，并将token存入localStorage
export const CHANGE_LOGIN = (token)=>{
    this.$store.state.Authorization = token;//user.Authorization;
    localStorage.setItem('Authorization', token);
};