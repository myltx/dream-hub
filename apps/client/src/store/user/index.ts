export interface User {
  id: number;
  name: string;
  sub: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
  userInfo: {
    id: number;
    avatar: string;
    roles: string[];
    updatedAt: string;
    userId: string;
    nikeName: string;
    email: string;
    createdAt: string;
  };
}
export const useUserStore = defineStore('user', () => {
  const user = ref<User>();

  function setupNewUser(info: { uesrName: string; avatar: string }) {
    if (!user.value) return;
    //     TODO: 缺少更新用户信息的接口

    //     const res = await fetchSetupNewUser({
    //       username: info.username,
    //       avatar: info.avatar,
    //     })

    //     user.value.username = res.username
    //     user.value.avatar = res.avatar
  }

  function initUser(val: any) {
    user.value = val;
    sessionStorage.setItem('token', val.token);
    sessionStorage.setItem('user', JSON.stringify(val));
  }
  function getUserInfo() {
    return user.value;
  }
  return {
    user,
    setupNewUser,
    initUser,
  };
});