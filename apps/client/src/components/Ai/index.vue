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
watch($viewport.breakpoint, (newBp: string) => {
  nowIsMobile.value = ['mobileWide', 'mobileMedium', 'mobile'].includes(newBp);
});

const runtimeConfig = useRuntimeConfig();
const { user, isAdmin } = storeToRefs(useUserStore());
const toast = useToast();

const isOpen = ref(false);
const password = ref('');
const apiConfig = ref({ apiKey: '', baseUrl: 'https://api.moleapi.com' });
const startPage = ref(true);
const inputValue = ref('');
const messages = ref<any[]>([]);
const isLoading = ref(false);
const client = ref<OpenAI>();

// 初始化 API 配置
const localConfig = localStorage.getItem(aiConfigKey);
if (localConfig) {
  const cfg = JSON.parse(localConfig);
  password.value = cfg.password;
  apiConfig.value = cfg.apiConfig;
} else if (user.value?.userInfo.roles.includes('admin')) {
  apiConfig.value = {
    apiKey: runtimeConfig.public.aiApiKey,
    baseUrl: runtimeConfig.public.aiApiUrl,
  };
}

const generateClient = () => {
  if (!apiConfig.value.apiKey || !apiConfig.value.baseUrl) return;
  client.value = new OpenAI({
    apiKey: apiConfig.value.apiKey,
    baseURL: apiConfig.value.baseUrl,
    dangerouslyAllowBrowser: true,
  });
};
generateClient();

// Markdown-it 配置
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (code, lang) => {
    let highlighted = '';
    if (lang && hljs.getLanguage(lang))
      highlighted = hljs.highlight(code, { language: lang }).value;
    else highlighted = md.utils.escapeHtml(code);
    return `<pre class="hljs language-${lang}"><code>${highlighted}</code></pre>`;
  },
});

// 代码块渲染器
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const code = token.content.trim();
  const lang = token.info ? `language-${token.info.trim()}` : '';
  const highlightedCode = options.highlight
    ? options.highlight(code, token.info, 'hljs')
    : md.utils.escapeHtml(code);
  return `
    <div class="code-block-wrapper rounded-lg my-4 border-2 text-3">
      <div class="flex items-center justify-between mb-2 p-2 light:bg-white dark:bg-#101726 rounded-t-lg">
        ${token.info.trim()}
        <button class="copy-icon" data-code="${encodeURIComponent(code)}" onclick="copyCode(this)">Copy</button>
      </div>
      <div class="overflow-x-auto">${highlightedCode}</div>
    </div>
  `;
};

// 复制代码功能
if (typeof window !== 'undefined') {
  window.copyCode = (btn: HTMLButtonElement) => {
    const code = decodeURIComponent(btn.getAttribute('data-code') || '');
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = 'Copied';
      setTimeout(() => (btn.textContent = 'Copy'), 2000);
    });
  };
}

// MCP 工具调用
async function callMcp(functionName: string, args: Record<string, any> = {}) {
  try {
    console.log('Calling MCP tool:', functionName, 'with args:', args);

    const res = await fetch('https://mcp-tool.myltx.top/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'tools/execute',
        params: { name: functionName, arguments: args },
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log('MCP tool result:', result);

    if (result.error) {
      throw new Error(result.error);
    }

    // 验证返回的数据结构
    if (result.result && result.result.data && result.result.data.data) {
      console.log('Valid MCP data structure found:', result.result.data.data);
      return result.result.data.data; // 返回实际的数据数组
    } else if (result.data && result.data.data) {
      console.log('Alternative MCP data structure found:', result.data.data);
      return result.data.data; // 返回实际的数据数组
    } else {
      console.warn('Unexpected MCP data structure:', result);
      return result; // 返回原始结果
    }
  } catch (error: any) {
    console.error('MCP tool call failed:', error);
    throw new Error(`MCP工具调用失败: ${error.message}`);
  }
}

// 智能 Agent 类
class SmartAgent {
  private messages: any[] = [];
  private tools: any[];
  private client: OpenAI;

  constructor(client: OpenAI, tools: any[]) {
    this.client = client;
    this.tools = tools;
  }

  // 添加消息到对话历史
  addMessage(
    role: 'user' | 'assistant' | 'tool',
    content: string,
    toolCalls?: any[],
    toolCallId?: string
  ) {
    this.messages.push({
      role,
      content,
      ...(toolCalls && { tool_calls: toolCalls }),
      ...(toolCallId && { tool_call_id: toolCallId }),
    });
  }

  // 获取对话历史
  getMessages() {
    return this.messages;
  }

  // 清空对话历史
  clearMessages() {
    this.messages = [];
  }

  // 处理用户问题
  async processQuestion(question: string): Promise<string> {
    try {
      // 清空之前的工具调用结果，确保每次查询都是独立的
      this.messages = this.messages.filter((m) => m.role !== 'tool');

      // 添加用户消息
      this.addMessage('user', question);

      // 第一步：让AI分析用户意图并决定是否使用工具
      const intentResponse = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: question,
          },
          {
            role: 'system',
            content:
              '你是一个智能助手，需要分析用户的查询意图。请仔细判断用户是否需要搜索网站或工具。\n\n**使用搜索工具的情况**：\n- 用户明确要求"推荐网站"、"搜索工具"、"找一些网站"等\n- 用户询问"有哪些图表库"、"推荐开发工具"、"搜索框架"等\n- 用户想要发现新的资源或工具\n\n**直接回答的情况**：\n- 用户询问技术问题（如"vue3最新更新"、"如何学习React"）\n- 用户询问概念解释（如"什么是TypeScript"、"解释闭包"）\n- 用户询问编程技巧（如"如何优化性能"、"最佳实践"）\n- 用户询问版本信息、更新日志等\n\n请根据用户的具体问题，准确判断是否需要使用搜索工具。如果用户只是询问技术问题或概念，请直接回答，不要使用工具。',
          },
        ],
        tools: this.tools.map((t) => ({
          type: 'function',
          function: t.function,
        })),
        tool_choice: 'auto', // 让AI自动决定是否使用工具
      });

      const intentMessage = intentResponse.choices[0].message;
      console.log('AI intent response:', intentMessage);

      // 如果AI决定使用工具
      if (intentMessage.tool_calls && intentMessage.tool_calls.length > 0) {
        console.log('AI decided to use tools:', intentMessage.tool_calls);

        // 执行每个工具调用
        for (const toolCall of intentMessage.tool_calls) {
          console.log('Processing tool call:', toolCall);
          try {
            // 找到对应的工具
            const tool = this.tools.find(
              (t) => t.function.name === toolCall.function.name
            );
            if (!tool) {
              throw new Error(`工具未找到: ${toolCall.function.name}`);
            }

            // 解析参数
            const args = JSON.parse(toolCall.function.arguments || '{}');
            console.log('工具调用参数:', args);

            // 调用工具
            const toolResult = await tool.call(toolCall.function.name, args);
            console.log('Tool execution result:', toolResult);
            console.log('Tool result type:', typeof toolResult);
            console.log('Tool result keys:', Object.keys(toolResult || {}));
            console.log(
              'Tool result stringified:',
              JSON.stringify(toolResult, null, 2)
            );

            // 添加工具执行结果
            this.addMessage(
              'tool',
              JSON.stringify(toolResult),
              undefined,
              toolCall.id
            );

            console.log('Added tool message with ID:', toolCall.id);
            console.log('Tool message content:', JSON.stringify(toolResult));
          } catch (error: any) {
            console.error('工具执行失败:', error);
            // 即使工具失败，也要添加错误结果
            this.addMessage(
              'tool',
              JSON.stringify({ error: error.message }),
              undefined,
              toolCall.id
            );
          }
        }

        // 第二步：让AI基于工具结果生成最终答案
        // 简化消息传递，直接传递工具结果内容
        const toolResults = this.messages
          .filter((m) => m.role === 'tool')
          .map((m) => m.content);

        console.log('Tool results to pass to AI:', toolResults);

        const finalResponse = await this.client.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: question,
            },
            {
              role: 'assistant',
              content: '我已经搜索了相关信息，现在为您提供推荐。',
            },
            {
              role: 'user',
              content: `请基于以下搜索结果为我提供网站推荐：${JSON.stringify(toolResults)}`,
            },
            {
              role: 'system',
              content:
                '你是一个专业的网站推荐助手。请基于用户提供的搜索结果数据，生成结构化的网站推荐。请按照以下格式回答：\n\n## 📊 搜索结果总结\n- 简要总结找到的网站数量和类型\n\n## 🌟 推荐网站\n### 1. [网站名称](网站链接)\n- **描述**: 网站的主要功能和特点\n- **推荐理由**: 为什么推荐这个网站\n\n### 2. [网站名称](网站链接)\n- **描述**: 网站的主要功能和特点\n- **推荐理由**: 为什么推荐这个网站\n\n## 💡 使用建议\n- 提供具体的使用建议和注意事项\n\n## 🔍 补充说明\n- 如果结果不够理想，建议尝试其他关键词\n- 其他相关建议\n\n请用中文回答，保持友好和专业的语调。重要提示：搜索结果数据通常是一个数组，每个元素包含title（标题）、url（链接）、description（描述）等字段。请仔细分析数组中的每个网站信息，不要遗漏任何有用的内容。如果数据是JSON字符串，请先解析JSON再分析内容。',
            },
          ],
        });

        const finalAnswer =
          finalResponse.choices[0].message.content || '抱歉，我无法生成答案。';
        this.addMessage('assistant', finalAnswer);

        return finalAnswer;
      } else {
        // 没有工具调用，直接返回AI答案
        const answer = intentMessage.content || '抱歉，我无法理解您的问题。';
        this.addMessage('assistant', answer);
        return answer;
      }
    } catch (error: any) {
      console.error('Agent处理失败:', error);
      const errorMessage = `抱歉，处理您的问题时出现了错误：${error.message}`;
      this.addMessage('assistant', errorMessage);
      return errorMessage;
    }
  }
}

// 工具定义
const mcpTool = {
  function: {
    name: 'mcpWebsiteSearch',
    description:
      '专门用于搜索和发现网站、工具、库、框架等在线资源的工具。当用户需要推荐网站、查找工具、发现新资源时使用。不适用于回答技术问题、概念解释或编程技巧。',
    parameters: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '搜索关键词，用于查找相关的网站、工具、库等资源',
        },
        limit: {
          type: 'number',
          description: '限制返回数量，建议设置为5-10',
          default: 5,
        },
      },
      required: ['keyword'],
    },
  },
  call: callMcp,
};

// 初始化 Agent
let agent: SmartAgent | null = null;

const initializeAgent = () => {
  if (client.value) {
    agent = new SmartAgent(client.value, [mcpTool]);
  }
};

// 监听API配置变化
watch(
  apiConfig,
  () => {
    generateClient();
    if (client.value) {
      initializeAgent();
    }
  },
  { deep: true }
);

// 初始化
onMounted(() => {
  if (client.value) {
    initializeAgent();
  }
});

// 提交问题
const onSubmit = async (input: string) => {
  if (!client.value || !agent) {
    toast.add({ title: '错误', description: '请先配置AI API', color: 'red' });
    return;
  }

  if (!input.trim()) {
    toast.add({
      title: '提示',
      description: '请输入您的问题',
      color: 'yellow',
    });
    return;
  }

  try {
    isLoading.value = true;
    inputValue.value = '';
    startPage.value = false;

    // 添加用户消息到UI
    const userMessageId = Date.now();
    messages.value.push({
      id: userMessageId,
      from: 'user',
      content: input,
      timestamp: new Date(),
    });

    // 处理问题
    const answer = await agent.processQuestion(input);

    // 添加AI回答到UI
    messages.value.push({
      id: Date.now() + 1,
      from: 'assistant',
      content: answer,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error('处理问题失败:', error);
    toast.add({
      title: '错误',
      description: `处理失败: ${error.message}`,
      color: 'red',
    });
  } finally {
    isLoading.value = false;
  }
};

// 新建对话
const newConversation = () => {
  messages.value = [];
  startPage.value = true;
  if (agent) {
    agent.clearMessages();
  }
};

// 保存配置
const saveConfig = (close: () => void) => {
  try {
    const config = {
      password: password.value,
      apiConfig: apiConfig.value,
    };
    localStorage.setItem(aiConfigKey, JSON.stringify(config));

    if (client.value) {
      initializeAgent();
    }

    toast.add({ title: '成功', description: '配置已保存', color: 'green' });
    close();
  } catch (error) {
    toast.add({ title: '错误', description: '保存配置失败', color: 'red' });
  }
};

// 获取系统配置
const updateSystemAiConfig = () => {
  if (runtimeConfig.public.aiApiKey && runtimeConfig.public.aiApiUrl) {
    apiConfig.value = {
      apiKey: runtimeConfig.public.aiApiKey,
      baseUrl: runtimeConfig.public.aiApiUrl,
    };
    toast.add({ title: '成功', description: '已获取系统配置', color: 'green' });
  } else {
    toast.add({ title: '错误', description: '系统配置不可用', color: 'red' });
  }
};

// 清空本地配置
const clearLocalStorageAiConfig = () => {
  localStorage.removeItem(aiConfigKey);
  password.value = '';
  apiConfig.value = { apiKey: '', baseUrl: 'https://api.moleapi.com' };
  toast.add({ title: '成功', description: '本地配置已清空', color: 'green' });
};

// 暴露弹框方法
defineExpose({ showModal: () => (isOpen.value = true) });
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
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div class="flex items-center gap-2">
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"
            ></div>
            <span class="text-gray-500">AI正在思考中...</span>
          </div>
        </div>

        <template v-for="(msg, idx) in messages" :key="msg.id || idx">
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
            class="flex items-center text-3 font-medium color-gray-500 cursor-pointer"
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
                class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer border b-gray-200"
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

/* Markdown 样式优化 */
.mc-bubble .filled {
  line-height: 1.6;
}

.mc-bubble .filled h1,
.mc-bubble .filled h2,
.mc-bubble .filled h3,
.mc-bubble .filled h4,
.mc-bubble .filled h5,
.mc-bubble .filled h6 {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: #1f2937;
}

.dark .mc-bubble .filled h1,
.dark .mc-bubble .filled h2,
.dark .mc-bubble .filled h3,
.dark .mc-bubble .filled h4,
.dark .mc-bubble .filled h5,
.dark .mc-bubble .filled h6 {
  color: #f9fafb;
}

.mc-bubble .filled h1 {
  font-size: 1.5em;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.mc-bubble .filled h2 {
  font-size: 1.3em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
}

.mc-bubble .filled h3 {
  font-size: 1.1em;
  color: #374151;
}

.dark .mc-bubble .filled h3 {
  color: #d1d5db;
}

.mc-bubble .filled ul,
.mc-bubble .filled ol {
  margin: 8px 0;
  padding-left: 24px;
}

.mc-bubble .filled li {
  margin: 4px 0;
}

.mc-bubble .filled a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.mc-bubble .filled a:hover {
  border-bottom-color: #3b82f6;
}

.dark .mc-bubble .filled a {
  color: #60a5fa;
}

.dark .mc-bubble .filled a:hover {
  border-bottom-color: #60a5fa;
}

.mc-bubble .filled strong {
  font-weight: 600;
  color: #111827;
}

.dark .mc-bubble .filled strong {
  color: #f9fafb;
}

.mc-bubble .filled em {
  font-style: italic;
  color: #6b7280;
}

.dark .mc-bubble .filled em {
  color: #9ca3af;
}

.mc-bubble .filled blockquote {
  border-left: 4px solid #e5e7eb;
  margin: 16px 0;
  padding: 8px 16px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.dark .mc-bubble .filled blockquote {
  border-left-color: #4b5563;
  background-color: #1f2937;
}
</style>
