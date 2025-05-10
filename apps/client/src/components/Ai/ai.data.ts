export const aiConfigKey = 'aiConfig';
import LogoImage from '@/assets/images/logo-32x32.png';

export const simplePrompt = [
  //   {
  //     value: 'quickSort',
  //     iconConfig: { name: 'icon-info-o', color: '#5e7ce0' },
  //     label: '帮我写一个快速排序',
  //   },
  {
    value: 'helpMd',
    iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
    label: '你可以帮我做些什么？',
  },
];

export const logoImg = LogoImage;

export const description = [
  'Dream Hub 支持智能对话交互，可以回答您的问题、提供建议，并与您进行实时的交流和互动。',
  '作为AI模型，Dream-hub 提供的答案可能不总是确定或准确的，但您的反馈可以帮助 Dream-hub 做的更好。',
];
export const introPrompt = {
  direction: 'horizontal',
  list: [
    //     {
    //       value: 'quickSort',
    //       label: '帮我写一个快速排序',
    //       iconConfig: { name: 'streamline-emojis:airplane' },
    //       desc: '使用 js 实现一个快速排序',
    //     },
    {
      value: 'helpMd',
      label: '你可以帮我做些什么？',
      iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
      desc: '了解当前大模型可以帮你做的事',
    },
  ],
};
export const intimate = [
  {
    icon: 'logos:vue',
    label: 'Vue3',
    desc: 'Vue3开发代码提示',
    prompt: `我是一位资深前端开发者，习惯使用 Vue 3 作为开发语言，并且习惯使用script setup语法糖、组合式 API、Axios请求、Vitest测试、用ES6语法和Typescript编码，
      你的回复请遵循我的个人习惯。接下来我会提出一些实际问题，需要你给出一些可用的代码建议和参考。在回答过程中请你尽可能参考 Vue 3 的官方文档，并以 Vue 3.3 的写法进行回复，
      尤其是与 Vue 2 的写法区分开。 在回复给我的每一句话前面加上“[开发建议] ”。 如果你能够理解，请回复“[开发建议] 我理解了”，然后从我的下一个问题开始认真回答`,
  },
  {
    icon: 'logos:typescript-icon',
    label: 'TypeScript',
    desc: 'TypeScript开发代码提示',
    prompt: `我是一位资深前端开发者，习惯使用 TypeScript 作为开发语言，并且习惯使用ES6语法和Typescript编码，`,
  },
  {
    icon: 'logos:react',
    label: 'React',
    desc: 'React开发代码提示',
    prompt: `我是一位资深前端开发者，习惯使用 React 作为开发语言，并且习惯使用ES6语法和Typescript编码，`,
  },
  {
    icon: 'logos:unocss',
    label: 'Unocss',
    desc: 'Unocss开发代码提示',
    prompt: `我正在使用 unocss，它是一个类似 Tailwind CSS 的库，可以通过行内 class 来定义样式，我需要你根据我提供的信息帮我提供样式,
     unocss 的地址是 https://unocss.dev/interactive/?s=border-rd`,
  },
  {
    icon: '',
    label: '熟悉项目小助手',
    desc: '熟悉项目代码提示',
    prompt: `你作为一个资深前端开发者，我会发给你package.json 中 dependencies信息/
	你把项目使用到的库根据功能进行分类，并且用言简意赅的描述来介绍每一个库的作用，如果你的背景信息中无法识别某个库，不要自己捏造，只需要标注：查不到此库信息。
	最后检查你输出的库的数量和我给你的数据中的库的数量是否一致，如果不一致，自我检查一下漏掉了什么内容。`,
  },
];
