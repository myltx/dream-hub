<script setup lang="ts">
import OpenAI from 'openai';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useUserStore } from '~/store/user';
import { storeToRefs } from 'pinia';
import {
  logoImg,
  description,
  introPrompt,
  aiConfigKey,
  intimate,
} from './ai.data';

const { $viewport } = useNuxtApp();

const nowIsMobile = ref(
  ['mobileWide', 'mobileMedium', 'mobile'].includes($viewport.breakpoint)
);

watch($viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  console.log('Breakpoint updated:', oldBreakpoint, '->', newBreakpoint);
  nowIsMobile.value = ['mobileWide', 'mobileMedium', 'mobile'].includes(
    newBreakpoint
  );
});
const runtimeConfig = useRuntimeConfig();
const { user, isAdmin } = storeToRefs(useUserStore());
const toast = useToast();
const isOpen = ref(false);
const password = ref('');
const apiConfig = ref({
  apiKey: '',
  baseUrl: 'https://api.openai.com',
});
const startPage = ref(true);
const inputValue = ref('');
const messages = ref<any[]>([]);
const client = ref<OpenAI>();

// 根据用户的角色来处理？如果用户登录了 且角色是管理员就可以使用系统默认的AI模型，否则只能使用自己训练的AI模型
// 这里先获取一下 本地缓存的配置，如果有就直接使用 如果没有再根据角色获取，如果还是没有那么就再提示用户去配置
const localstorageAiConfig = localStorage.getItem(aiConfigKey);
if (localstorageAiConfig) {
  const config = JSON.parse(localstorageAiConfig);
  password.value = config.password;
  apiConfig.value = {
    apiKey: config.apiConfig.apiKey || '', // 模型APIKey
    baseUrl: config.apiConfig.baseUrl || 'https://api.openai.com', // 模型API地址
  };
} else if (user.value?.userInfo.roles.includes('admin')) {
  apiConfig.value = {
    apiKey: runtimeConfig.public.aiApiKey || '', // 模型APIKey
    baseUrl: runtimeConfig.public.aiApiUrl || '', // 模型API地址
  };
}
const generateClient = () => {
  if (!apiConfig.value.apiKey || !apiConfig.value.baseUrl) {
    return;
  }
  client.value = new OpenAI({
    apiKey: apiConfig.value.apiKey, // 模型APIKey
    baseURL: apiConfig.value.baseUrl, // 模型API地址
    dangerouslyAllowBrowser: true,
  });
};
generateClient();

// Markdown-it 配置
const md = new MarkdownIt({
  highlight: (code: string, lang: string): string => {
    let highlightedCode = '';
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlightedCode = hljs.highlight(code, { language: lang }).value;
      } catch (error) {
        console.error('Highlight.js error:', error);
      }
    } else {
      highlightedCode = md.utils.escapeHtml(code);
    }
    const languageClass = lang ? `language-${lang}` : '';
    return `<pre class="hljs ${languageClass}"><code>${highlightedCode}</code></pre>`;
  },
});

// Markdown-it 插件：为代码块添加复制按钮
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const code = token.content.trim();
  const lang = token.info ? `language-${token.info.trim()}` : '';
  const highlightedCode = options.highlight
    ? options.highlight(code, token.info, 'hljs')
    : md.utils.escapeHtml(code);

  // 返回带复制按钮的 HTML
  return `
    <div class="code-block-wrapper rounded-lg my-4 b-order-2 border-2 text-3">
     <div class="flex items-center justify-between mb-2 p-2 light:bg-white dark:bg-#101726 rounded-t-lg">
      ${token.info.trim()}
       <button class="copy-icon" data-code="${encodeURIComponent(code)}" onclick="copyCode(this)">
        Copy
      </button>
     </div>
     <div class="overflow-x-auto">
       ${highlightedCode}
     </div>
    </div>
  `;
};

// 为复制按钮定义 JS 函数
if (typeof window !== 'undefined') {
  window.copyCode = (button: HTMLButtonElement) => {
    const code = decodeURIComponent(button.getAttribute('data-code') || '');
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  };
}

const newConversation = () => {
  startPage.value = true;
  messages.value = [];
};

const saveConfig = (close: () => void) => {
  localStorage.setItem(
    aiConfigKey,
    JSON.stringify({
      password: password.value,
      apiConfig: apiConfig.value,
    })
  );
  toast.add({
    title: 'Success',
    description: '配置成功',
    color: 'green',
    timeout: 1000,
  });
  generateClient();
  close && close();
};
const clearLocalStorageAiConfig = () => {
  localStorage.removeItem(aiConfigKey);
  toast.add({
    title: 'Success',
    description: '清除成功',
    color: 'green',
    timeout: 1000,
  });
  password.value = '';
  apiConfig.value = {
    apiKey: '', // 模型APIKey
    baseUrl: '', // 模型API地址
  };
  generateClient();
};
const updateSystemAiConfig = () => {
  apiConfig.value = {
    apiKey: runtimeConfig.public.aiApiKey, // 模型APIKey
    baseUrl: runtimeConfig.public.aiApiUrl, // 模型API地址
  };
};

const onSubmit = (evt: string) => {
  if (!apiConfig.value.apiKey || !apiConfig.value.baseUrl) {
    toast.add({
      title: 'Error',
      description: '请先配置AI模型APIKey和API地址',
      color: 'red',
    });
    return;
  }
  inputValue.value = '';
  startPage.value = false;
  // 用户发送消息
  messages.value.push({
    from: 'user',
    content: evt,
    avatarConfig: { name: 'user' },
  });

  fetchData(evt);
};

const fetchData = async (ques) => {
  messages.value.push({
    from: 'model',
    content: '',
    avatarConfig: { name: 'model' },
    id: '',
    loading: true,
  });
  const completion = await client.value!.chat.completions.create({
    model: 'gpt-3.5-turbo', // 替换为自己的model名称
    messages: [{ role: 'user', content: ques }],
    stream: true, // 为 true 则开启接口的流式返回
  });
  messages.value[messages.value.length - 1].loading = false;
  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content || '';
    const chatId = chunk.id;
    messages.value[messages.value.length - 1].content += content;
    messages.value[messages.value.length - 1].id = chatId;
  }
};
defineExpose({
  showModal: () => {
    isOpen.value = true;
  },
});
</script>

<template>
  <USlideover
    v-model="isOpen"
    :ui="{
      width: 'w-300 max-w-2xl',
      base: 'w-300',
    }"
  >
    <McLayout
      class="container w-full"
      :class="[nowIsMobile ? 'mobile-layout' : 'desktop-layout']"
    >
      <McHeader :title="'Dream-hub'" :logoImg="logoImg">
        <template #operationArea>
          <div class="operations flex items-center">
            <UPopover class="flex items-center">
              <Icon
                name="hugeicons:settings-02"
                class="text-5 cursor-pointer"
              />
              <template #panel="{ close }">
                <div class="p-4">
                  <div>
                    <div class="text-3 color-gray-500 flex items-center">
                      <Icon
                        name="mdi-light:alert-circle"
                        class="text-4 cursor-pointer"
                      />
                      密码和配置输入一项即可
                    </div>
                    <UDivider
                      label="密码配置"
                      size="2xs"
                      :ui="{
                        label:
                          'text-green-500 dark:text-green-400 text-2 font-400 my-1',
                      }"
                    />
                    <div class="flex items-center">
                      <div class="text-3">密码：</div>
                      <UInput
                        v-model="password"
                        size="2xs"
                        disabled
                        placeholder="密码功能正在开发中..."
                      />
                    </div>
                    <UDivider
                      label="API配置"
                      size="2xs"
                      :ui="{
                        label:
                          'text-primary-500 dark:text-primary-400 text-2 font-400 my-1',
                      }"
                    />
                    <div class="flex items-center">
                      <div class="text-3">秘钥：</div>
                      <UInput
                        v-model="apiConfig.apiKey"
                        size="2xs"
                        type="password"
                        placeholder="请输入秘钥"
                      />
                    </div>
                    <div class="flex items-center mt-4">
                      <div class="text-3">域名：</div>
                      <UInput
                        v-model="apiConfig.baseUrl"
                        size="2xs"
                        placeholder="请输入域名"
                      />
                    </div>
                  </div>
                  <!-- 操作区 -->
                  <div>
                    <UTooltip
                      text="使用系统默认模型"
                      class="w-full"
                      v-if="isAdmin"
                    >
                      <UButton
                        block
                        square
                        size="2xs"
                        class="mt-4"
                        color="gray"
                        @click="updateSystemAiConfig"
                      >
                        获取系统配置
                      </UButton>
                    </UTooltip>
                    <UButton
                      block
                      square
                      size="2xs"
                      class="mt-4"
                      color="gray"
                      @click="clearLocalStorageAiConfig"
                    >
                      清空缓存配置
                    </UButton>
                    <UButton
                      block
                      size="2xs"
                      class="mt-4"
                      color="primary"
                      @click="saveConfig(close)"
                    >
                      保存
                    </UButton>
                  </div>
                </div>
              </template>
            </UPopover>
            <Icon
              v-if="nowIsMobile"
              name="line-md:close"
              class="text-5 cursor-pointer ml-2"
              @click="() => (isOpen = false)"
            />
          </div>
        </template>
      </McHeader>
      <McLayoutContent
        v-if="startPage"
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        "
      >
        <McIntroduction
          :logoImg="logoImg"
          :title="'Dream-hub 助手'"
          :subTitle="'Hi，我是 Dream-hub 助手'"
          :description="description"
        ></McIntroduction>
        <McPrompt
          :list="introPrompt.list"
          :direction="introPrompt.direction"
          class="intro-prompt"
          @itemClick="onSubmit($event.label)"
        ></McPrompt>
      </McLayoutContent>
      <McLayoutContent class="content-container" v-else>
        <template v-for="(msg, idx) in messages" :key="idx">
          <McBubble
            v-if="msg.from === 'user'"
            :content="msg.content"
            :align="'right'"
            :avatarConfig="{
              imgSrc: 'https://matechat.gitcode.com/png/demo/userAvatar.svg',
            }"
          >
            <div class="text-3" v-html="md.render(msg.content)"></div>
          </McBubble>
          <McBubble
            v-else
            :content="msg.content"
            :avatarConfig="{
              imgSrc: logoImg,
            }"
          >
            <div class="text-3" v-html="md.render(msg.content)"></div>
          </McBubble>
        </template>
      </McLayoutContent>
      <div
        class="shortcut"
        style="display: flex; align-items: center; gap: 8px"
      >
        <!-- <McPrompt
          v-if="!startPage"
          :list="simplePrompt"
          :direction="'horizontal'"
          style="flex: 1"
          @itemClick="onSubmit($event.label)"
        ></McPrompt> -->
        <UPopover>
          <div
            class="flex items-center text-3 font-500 color-gray-500 cursor-pointer"
          >
            <Icon
              name="streamline-emojis:wrench"
              class="text-4 color-gray-500 mr-1"
            />
            我的搭档
          </div>
          <template #panel>
            <div
              class="p-4 grid gap-4 w-100"
              style="
                grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
              "
            >
              <div
                class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer b-1 b-gray-200"
                v-for="(item, index) in intimate"
                :key="index"
                @click="onSubmit(item.prompt)"
              >
                <Icon
                  :name="item.icon || 'streamline-emojis:seedling'"
                  class="text-4"
                />
                {{ item.label }}
              </div>
            </div>
          </template>
        </UPopover>
        <UTooltip
          text="新建对话，此操作会清除当前所有的会话内容"
          class="ml-auto"
        >
          <UButton
            shape="circle"
            size="2xs"
            icon="radix-icons:chat-bubble"
            :ui="{ rounded: 'rounded-full' }"
            @click="newConversation"
          >
          </UButton>
        </UTooltip>
      </div>
      <McLayoutSender>
        <McInput
          :value="inputValue"
          :maxLength="2000"
          @change="(e: any) => (inputValue = e)"
          @submit="onSubmit"
        >
          <template #extra>
            <div class="input-foot-wrapper text-3">
              <div class="input-foot-left text-3">
                <span class="input-foot-dividing-line"></span>
                <span class="input-foot-maxlength"
                  >{{ inputValue.length }}/2000</span
                >
              </div>
              <div class="input-foot-right">
                <UButton
                  icon="icon-park-outline:clear"
                  color="gray"
                  shape="round"
                  size="xs"
                  :ui="{ rounded: 'rounded-full' }"
                  :disabled="!inputValue"
                  @click="inputValue = ''"
                >
                  清空输入
                </UButton>
              </div>
            </div>
          </template>
        </McInput>
      </McLayoutSender>
    </McLayout>
  </USlideover>
</template>

<style scoped>
.container {
  margin: 10px auto;
  height: calc(100vh - 40px);
  padding: 10px;
  gap: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
}

.input-foot-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-right: 8px;

  .input-foot-left {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      font-size: 12px;
      color: #252b3a;
      cursor: pointer;
    }

    .input-foot-dividing-line {
      width: 1px;
      height: 14px;
      background-color: #d7d8da;
    }

    .input-foot-maxlength {
      font-size: 12px;
      color: #71757f;
    }
  }

  .input-foot-right {
    & > *:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
<style>
.mc-textarea {
  font-size: 14px !important;
}

/* 暗黑模式 */
.dark .container {
  background: var(--background-color);
  border: 1px solid #333;
  color: #fff;
}

.dark .input-foot-wrapper {
  color: #fff;
}

.dark .mc-introduction {
  color: #fff;
}

.dark .mc-list .filled {
  background: rgba(0, 0, 0, 0.5) !important;
  color: #fff;
}

.dark .devui-textarea {
  background: rgba(0, 0, 0, 0.5) !important;
  color: #fff;
}

.dark .mc-prompt-item-content:hover {
  color: rgba(255, 255, 255, 0.5);
}

.dark .mc-bubble .filled {
  background: rgba(0, 0, 0, 0.5) !important;
  color: #fff;
}

.devui-button--outline--secondary:disabled {
  /* background: rgba(200, 200, 200, 0.5) !important; */
}

.devui-button {
  /* background: rgba(0, 0, 0, 0.5) !important; */
  color: #fff;
}

.dark .hljs {
  background: rgba(200, 200, 200, 0.3) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.hljs {
  padding: 10px;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.mobile-layout {
  flex: 0.9 !important;
}
</style>
