<script setup lang="ts">
import type { FormError } from '#ui/types';
import {
  signOut,
  isAuthenticated,
  signIn,
  getToken,
  isTokenExpired,
} from '~/services/auth';
import { uploadFile } from '~/api/file';
import { useUserStore } from '~/store/user';
import { storeToRefs } from 'pinia';

const props = defineProps({
  type: {
    type: String,
    default: 'frontend',
  },
});

type DropdownItem = {
  label: string;
  icon?: string;
  disabled?: boolean;
  key?: string;
  show?: boolean;
};
const router = useRouter();
const { user } = storeToRefs(useUserStore());
const { setupNewUser } = useUserStore();
const isOpen = ref(false);
const showItems = ref<DropdownItem[][]>([]);
const token = ref(false);

const form = ref();
const formData = ref<{
  file: File;
  type: string;
  nikeName: string;
  id: string;
  avatar: string;
}>({
  file: new File([], ''),
  type: 'image',
  nikeName: '',
  avatar: '',
  id: '',
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (
    !formData.value.avatar &&
    (!formData.value.file || !formData.value.file.name)
  )
    errors.push({ path: 'file', message: '请选择文件' });
  // if (!state.nikeName) errors.push({ path: 'nickName', message: '请输入昵称' });
  return errors;
};

const items = [
  [
    {
      label: '',
      slot: 'account',
      disabled: true,
      show: true,
    },
  ],
  [
    {
      label: '后台管理',
      key: 'admin',
      icon: 'i-heroicons-book-open',
      show: isAuthenticated() && props.type === 'frontend',
    },
    {
      label: '文档说明',
      key: 'document',
      icon: 'line-md:file-document-minus',
      show: true,
    },
    {
      label: '看看效果',
      key: 'frontend',
      icon: 'i-heroicons-book-open',
      show: props.type === 'admin',
    },
  ],
  [
    {
      label: '退出登录',
      key: 'signOut',
      show: isAuthenticated(),
      icon: 'i-heroicons-arrow-left-on-rectangle',
    },
    {
      label: '登录',
      key: 'signIn',
      show: !isAuthenticated(),
      icon: 'i-heroicons-arrow-right-on-rectangle',
    },
  ],
] as DropdownItem[][];
props.type !== 'admin' && items[0].shift();
watchEffect(async () => {
  showItems.value = items
    .map((subArr) =>
      subArr.filter((item) => {
        if (item.key === 'admin' && item.show) {
          return user.value?.roles?.includes('管理员');
        } else {
          return item.show;
        }
      })
    )
    .filter((item) => item.length);
});
onMounted(async () => {
  token.value = await isTokenExpired();
});

const handleDropdownItemClick = (item: DropdownItem) => {
  switch (item.key) {
    case 'admin':
      if (!isAuthenticated()) {
        signIn();
        return;
      }

      router.push('/admin');
      return;
    case 'signOut':
      signOut();
      return;
    case 'signIn':
      signIn();
      return;
    case 'frontend':
      router.push('/');
      return;
    case 'document':
      window.open('https://dream-hub.docs.myltx.top/guide/');
      return;
    default:
      return;
  }
};
const editUserInfo = () => {
  isOpen.value = true;
  formData.value.nikeName = user.value?.userInfo?.nikeName || '';
  formData.value.id = user.value?.userInfo?.id || '';
  formData.value.avatar = user.value?.userInfo?.avatar || '';
};
const onSubmit = async () => {
  await form.value.validate();
  // 先上传图片到服务器 然后将获取到的url 再传递给 修改用户信息的接口
  if (!formData.value.avatar) {
    const { data } = await uploadFile({
      type: 'image',
      file: formData.value?.file,
    });
    formData.value.avatar = data.url;
  }
  // 修改用户信息
  await setupNewUser(formData.value);
  // 关闭弹窗
  closeEditModalFn();
};
const closeEditModalFn = () => {
  isOpen.value = false;
};
const onFileChange = (e: any) => {
  if (!e?.length) return;
  formData.value.avatar = '';
  formData.value.file = e[0];
};
</script>

<template>
  <UDropdown
    :items="showItems"
    :ui="{
      item: { disabled: 'cursor-text select-text', base: 'group z-90' },
      background: 'bg-white dark:bg-gray-800',
      container: 'group',
    }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :src="user?.userInfo?.avatar" alt="Dream-hub" />
    <template #account="{ item }">
      <div class="text-left z-90">
        <p v-if="!isAuthenticated()">请先登录</p>
        <p class="truncate font-medium flex items-center">
          {{ user?.userInfo?.nikeName }}
          <UTooltip text="修改用户信息">
            <Icon
              name="hugeicons:quill-write-02"
              class="text-sm ml-1 cursor-pointer"
              @click="editUserInfo"
            />
          </UTooltip>
        </p>
        <p>
          {{ user?.email }}
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <div
        class="w-[100%] flex items-center justify-between z-90"
        @click="handleDropdownItemClick(item)"
      >
        <span class="truncate">{{ item.label }}</span>

        <UIcon
          :name="item.icon"
          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
        />
      </div>
    </template>
  </UDropdown>
  <USlideover v-model="isOpen">
    <div class="flex items-center justify-between mb-4">
      <h3
        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
      >
        编辑
      </h3>
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="-my-1"
        @click="closeEditModalFn"
      />
    </div>

    <div class="h-[90%]">
      <UForm
        ref="form"
        :validate="validate"
        :state="formData"
        class="space-y-4"
      >
        <UFormGroup label="昵称" name="nikeName">
          <UInput v-model="formData.nikeName" placeholder="请输入昵称" />
        </UFormGroup>
        <UFormGroup label="头像" name="file">
          <UInput
            type="file"
            size="sm"
            icon="i-heroicons-folder"
            accept="image/*"
            @change="onFileChange"
          />
          <Avatar :src="formData?.file" alt="Dream-hub" />
        </UFormGroup>
      </UForm>
    </div>
    <div class="flex items-center justify-end mt-4 b-t-1 b-gray/50 p-t-2">
      <UButton class="mr-2" color="gray" @click="closeEditModalFn">
        取消
      </UButton>
      <UButton @click="onSubmit"> 提交 </UButton>
    </div>
  </USlideover>
</template>
<style scoped></style>
