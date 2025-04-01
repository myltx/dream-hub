# Logto 使用指南

## Logto 简介

[**Logto**](https://logto.io/zh-CN) 是一个开源的 Auth0、Cognito 和 Firebase Auth 替代方案，适用于现代应用和 SaaS 产品，支持 OIDC、OAuth 2.0 和 SAML 等身份验证和授权的开放标准。

# 如何配置 Logto？

本项目的配置流程是在 [**earthworm**](https://github.com/cuixueshe/earthworm) 项目的logto配置教程中取出了项目需要用到的配置，如果需要完整教程可以访问 [**earthworm-config-logto**](https://github.com/cuixueshe/earthworm/blob/main/packages/docs/contribution/config-logto.md) 项目的配置教程

## 1. 点击 Create account 按钮创建账号

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/1.png)

## 2. 注册或者登录帐号

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/2.png)
:::tip
我这里使用的是 Github 账号登录
:::

## 3. 配置页面

:::tip
可以按照配置切换语言为中文（如果英文看不懂的话）
:::
![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/3.png)

## 4. 创建 API 资源

#### 创建 API

点击左侧 **`API资源`** 创建

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/4.png)

选择 **`Express`** 立即开始

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/5.png)

#### 配置 `Logto API Identifier`

将 后端代码 `apps/api/.env` 文件中

- BACKEND_ENDPOINT → API Identifier

```bash
BACKEND_ENDPOINT= API Identifier
```

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/6.png)

配置 apps/api/.env 文件

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/7.png)

- Logto Management API → LOGTO_M2M_API

```bash
LOGTO_M2M_API= Logto Management API
```

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/8.png)

至此 `API` 资源部分配置完成 🎉

## 5. 创建 Logto 前端应用

:::tip
这里创建一个`Vue`应用
:::

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/9.png)

点击 **`完成`**

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/10.png)

#### 配置前端代码 `apps/client/.env` 文件

- 点击左侧 **`全部应用`** 会看到多了一个应用，复制 App ID

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/11.png)

- App ID → LOGTO_APP_ID

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/12.png)

### 配置 Logto URI

#### 将 apps/client/.env 中

- LOGTO_SIGN_IN_REDIRECT_URI → 重定向 URIs
- LOGTO_SIGN_OUT_REDIRECT_URI → 退出登录后重定向 URIs

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/13.png)

:::warning
注意：更改内容最后要记得点击 保存更改 哈！
:::

至此前端部分配置完成 🎉

## 6. 创建 Logto 后端应用

构建应用
找 MACHINE-TO-MACHINE 开始构建

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/14.png)

和前端应用创建差不多，输入内容后点击完成就好了

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/15.png)

#### 配置 apps/api/.env 文件

点击刚刚创建的后端应用，来到应用详情页，复制下面参数值

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/16.png)

- 应用 ID → LOGTO_CLIENT_ID
- 应用密钥 → LOGTO_CLIENT_SECRET

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/17.png)

至此后端应用部分配置完成 🎉

## 7. 创建管理员

:::warning
创建管理员并设置权限（步骤点击稍多，别遗漏步骤哦）
:::

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/18.png)

#### 给 admin 角色分配刚刚创建的 后端应用

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/19.png)

## 8. 重新启动后端 + 前端服务

```bash
# 起动后端服务
pnpm run dev:api

# 起动前端服务
pnpm run dev:client
```

#### 来到首页，点击导航栏右上角的 登录 按钮后

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/20.png)

#### 看到下面的页面则视为配置成功 🎉

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/21.png)

#### 可以点击 create account 创建一下帐号然后登录查看下

![](https://xcwhdikndfrizmrtxyiy.supabase.co/storage/v1/object/public/doc-img/md-img/22.png)

## 9. 最后

:::tip
如果还有其他问题，也欢迎一起交流学习哦！

点击下方链接在评论区提出你的沟通建议吧！

[开发者日记✏️：技术选型完成！](https://www.xiaohongshu.com/discovery/item/67ad9005000000001800bae3?source=webshare&xhsshare=pc_web&xsec_token=ABI9LJfTmSVoFMyxyRO4p_11fZQYBVa8VEGreeaPtUBr4=&xsec_source=pc_share)
:::
