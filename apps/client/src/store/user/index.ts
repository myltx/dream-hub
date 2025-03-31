import { updateUser } from '~/api/user';

export interface User {
  id: number;
  name: string;
  sub: string;
  nikeName: string;
  email: string;
  avatar: string;
  token: string;
  userInfo: {
    id: string;
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

  async function setupNewUser(info: {
    nikeName: string;
    avatar: string;
    id: string;
  }) {
    if (!user.value) return;
    const res = await updateUser(info.id, {
      nikeName: info.nikeName,
      avatar: info.avatar,
    });

    user.value.userInfo.nikeName = info.nikeName;
    user.value.userInfo.avatar = info.avatar;
    user.value.nikeName = info.nikeName;
    user.value.avatar = info.avatar;
    // 手动触发页面更新
    nextTick(() => {
      console.log('User updated and DOM should re-render');
    });
  }

  function initUser(val: any) {
    user.value = val;
    sessionStorage.setItem('token', val.token);
    sessionStorage.setItem('user', JSON.stringify(val));
  }

  const isAdmin = computed(() => {
    return user.value?.userInfo.roles.includes('admin');
  });

  return {
    user,
    isAdmin,
    setupNewUser,
    initUser,
  };
});
