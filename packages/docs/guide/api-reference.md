---
title: 后端文档-开发说明
---

# 🚀 后端文档说明

本说明文档将帮助你了解如何配置、运行和使用 **Dream Hub** 后端服务。后端使用 [**NestJS**](https://nestjs.com/) 开发，并与 **Supabase** 和 **Logto** 进行集成。
接口采用 **REST API**，支持跨域请求。[源码地址](https://github.com/myltx/drema-hub-api)

## 📌 1. 后端架构

Dream Hub 后端采用 **NestJS** 框架，结构清晰，分层明确，包含以下模块：

- **Auth Module**：处理用户认证，集成 **Logto** 实现 JWT 身份验证。
- **Website Module**：管理网站数据，包括添加、编辑、删除、查询网站。
- **Category Module**：管理网站分类，支持多级分类结构。
- **Tag Module**：管理网站标签，支持站点与标签的关联。
- **Favorite Module**：处理用户的收藏功能，支持网站、文章等内容的收藏。
- **AI Module**：集成 AI 服务，提供网站推荐、内容分类等功能。
- **Logging Module**：记录访问日志，支持用户行为追踪。

后端服务通过 **REST API** 提供数据访问和操作。

## 🛠️ 2. 安装和配置

### 2.1 安装依赖

克隆项目后，首先进入后端目录并安装所需的依赖：

```sh

cd /apps/api
pnpm install

```

### 2.2 配置环境变量

在 `.env` 文件中配置以下环境变量：

```sh
# supabase 配置
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_JWT_SECRET=

# redis 配置
REDIS_URL=

# server 配置
PORT=8081

# logto 配置
LOGTO_ENDPOINT=
LOGTO_APP_ID=
# LOGTO_ENDPOINT=
# LOGTO_APP_ID=
BACKEND_ENDPOINT=
LOGTO_CLIENT_ID=
LOGTO_CLIENT_SECRET=
```

::: warning **注意**
确保你已经正确配置了 **Supabase** 和 **Logto** 的环境变量。
:::

## 🔥 3. 启动后端

启动后端服务，运行以下命令：

```sh
pnpm dev:server
```

后端服务默认运行在 http://localhost:8081，你可以在浏览器中访问该地址进行调试。

## 🎯 4. API 使用

后端提供了多个 API 端点用于数据操作。具体使用参考 [Swagger](#-4-swagger-api-文档) 文档。

## 📌 4. Swagger API 文档

Dream Hub 后端提供了基于 Swagger 自动生成的接口文档，帮助开发人员快速了解和调用所有的 API。

### 4.1 访问 Swagger 文档

你可以通过访问以下链接来查看后端 API 的 Swagger 文档

```sh
http://localhost:8081/api-docs
```

::: info 💡 说明
确保后端服务正在运行，并且访问的是正确的端口（默认为 8081）。
:::

### 4.2 Swagger 文档功能

Swagger 提供了以下功能：

- 接口查看：列出了所有的 API 端点，支持按模块进行筛选。
- 参数说明：每个 API 的请求和响应参数都有详细的说明，包括参数类型、是否必填、默认值等。
- 接口测试：你可以直接在 Swagger UI 中调用 API，测试接口的响应。

::: info 💡 说明
你可以通过访问该文档并进行测试，来确保 API 正常工作，并根据接口文档进行开发。
:::

## 🔒 5. 安全性

后端所有的 API 都使用 JWT 进行身份验证。在请求中，必须在 Authorization 头中提供有效的 JWT Token。

请求示例：

```sh
GET http://localhost:8081/websites
Authorization: Bearer <your_jwt_token>
```

确保在生产环境中使用 HTTPS，并通过环境变量配置生产环境的 JWT 密钥和认证参数。

## 🛠️ 6. 数据库设计

后端数据库采用 Supabase，包含以下核心表格：

1. **用户表 (users)**：存储用户的基本信息。

2. **网站表 (websites)**：存储所有网站的数据，包括 URL、标题、分类等。

3. **标签表 (tags)**：存储标签数据。

4. **网站标签关联表 (website_tags)**：用于关联网站和标签。

5. **收藏表 (user_favorites)**：存储用户的收藏信息，支持收藏不同类型的内容（如网站、文章等）。

::: tip 💡 **提示**
你可以根据需求自定义数据库模型，并通过 Supabase 控制台进行管理。
:::

可以执行以下 **sql** 语句在 **Supabase** 中创建表：

**Supabase** 在本项目中的使用指南可以[**跳转查看**](./supabase-reference.md)

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : dream-hub
 Source Server Type    : PostgreSQL
 Source Server Version : 150008 (150008)
 Source Host           : db.xcwhdikndfrizmrtxyiy.supabase.co:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150008 (150008)
 File Encoding         : 65001

 Date: 08/02/2025 10:30:23
*/

-- ----------------------------
-- Sequences
-- ----------------------------

-- Sequence for categories
CREATE SEQUENCE "public"."categories_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."categories_id_seq"', 30, true);

ALTER SEQUENCE "public"."categories_id_seq" OWNER TO "postgres";

-- Sequence for files
CREATE SEQUENCE "public"."files_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."files_id_seq"', 26, true);

ALTER SEQUENCE "public"."files_id_seq" OWNER TO "postgres";

-- Sequence for tags
CREATE SEQUENCE "public"."tags_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."tags_id_seq"', 12, true);

ALTER SEQUENCE "public"."tags_id_seq" OWNER TO "postgres";

-- Sequence for users
CREATE SEQUENCE "public"."users_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."users_id_seq"', 26, true);

ALTER SEQUENCE "public"."users_id_seq" OWNER TO "postgres";

-- Sequence for website_access_logs
CREATE SEQUENCE "public"."website_access_logs_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."website_access_logs_id_seq"', 48, true);

ALTER SEQUENCE "public"."website_access_logs_id_seq" OWNER TO "postgres";

-- Sequence for websites
CREATE SEQUENCE "public"."websites_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."websites_id_seq"', 90, true);

ALTER SEQUENCE "public"."websites_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."categories";
CREATE TABLE "public"."categories" (
  "id" int4 NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "user_id" varchar COLLATE "pg_catalog"."default",
  "sort_order" int4 DEFAULT 0
)
;
ALTER TABLE "public"."categories" OWNER TO "postgres";
ALTER SEQUENCE "public"."categories_id_seq"
OWNED BY "public"."categories"."id";
-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS "public"."files";
CREATE TABLE "public"."files" (
  "id" int4 NOT NULL DEFAULT nextval('files_id_seq'::regclass),
  "user_id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "bucket" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "path" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "public_url" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now(),
  "file_name" text COLLATE "pg_catalog"."default",
  "file_type" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."files" OWNER TO "postgres";
ALTER SEQUENCE "public"."files_id_seq"
OWNED BY "public"."files"."id";
-- ----------------------------
-- Table structure for site_access_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."site_access_logs";
CREATE TABLE "public"."site_access_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" varchar(255) COLLATE "pg_catalog"."default",
  "access_time" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "ip_address" varchar(45) COLLATE "pg_catalog"."default",
  "user_agent" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "platform" text COLLATE "pg_catalog"."default",
  "geolocation" text COLLATE "pg_catalog"."default",
  "browser_name" text COLLATE "pg_catalog"."default",
  "device_type" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."site_access_logs" OWNER TO "postgres";

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS "public"."tags";
CREATE TABLE "public"."tags" (
  "id" int4 NOT NULL DEFAULT nextval('tags_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" varchar COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."tags" OWNER TO "postgres";
ALTER SEQUENCE "public"."tags_id_seq"
OWNED BY "public"."tags"."id";
-- ----------------------------
-- Table structure for user_favorites
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_favorites";
CREATE TABLE "public"."user_favorites" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "content_type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'website'::character varying,
  "content_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."user_favorites" OWNER TO "postgres";

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "user_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL UNIQUE,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "nike_name" varchar COLLATE "pg_catalog"."default",
  "avatar" varchar COLLATE "pg_catalog"."default",
  "roles" text[] COLLATE "pg_catalog"."default" DEFAULT '{}'::text[]
)
;
ALTER TABLE "public"."users" OWNER TO "postgres";
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
-- ----------------------------
-- Table structure for website_access_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_access_logs";
CREATE TABLE "public"."website_access_logs" (
  "id" int4 NOT NULL DEFAULT nextval('website_access_logs_id_seq'::regclass),
  "user_id" varchar(255) COLLATE "pg_catalog"."default",
  "website_id" int4,
  "access_time" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."website_access_logs" OWNER TO "postgres";


-- ----------------------------
-- Table structure for website_categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_categories";
CREATE TABLE "public"."website_categories" (
  "website_id" int4 NOT NULL,
  "category_id" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."website_categories" OWNER TO "postgres";

-- ----------------------------
-- Table structure for website_tags
-- ----------------------------
DROP TABLE IF EXISTS "public"."website_tags";
CREATE TABLE "public"."website_tags" (
  "website_id" int4 NOT NULL,
  "tag_id" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."website_tags" OWNER TO "postgres";

-- ----------------------------
-- Table structure for websites
-- ----------------------------
DROP TABLE IF EXISTS "public"."websites";
CREATE TABLE "public"."websites" (
  "id" int4 NOT NULL DEFAULT nextval('websites_id_seq'::regclass),
  "user_id" varchar(255) COLLATE "pg_catalog"."default",
  "url" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "detailed_description" text COLLATE "pg_catalog"."default",
  "usage_scenario" text COLLATE "pg_catalog"."default",
  "rating" int4,
  "review" text COLLATE "pg_catalog"."default",
  "is_public" bool DEFAULT false,
  "is_recommended" bool DEFAULT false,
  "sort_order" int4 DEFAULT 0,
  "visit_count" int4 DEFAULT 0,
  "logo" varchar(255) COLLATE "pg_catalog"."default",
  "image" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "category_id" int4,
  "status" bool DEFAULT true,
  "is_top" bool DEFAULT false
)
;
ALTER TABLE "public"."websites" OWNER TO "postgres";
ALTER SEQUENCE "public"."websites_id_seq"
OWNED BY "public"."websites"."id";
-- ----------------------------
-- Uniques structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS
$$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------
-- Triggers structure for table files
-- ----------------------------
CREATE TRIGGER "set_updated_at_on_files" BEFORE UPDATE ON "public"."files"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table files
-- ----------------------------
ALTER TABLE "public"."files" ADD CONSTRAINT "files_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table site_access_logs
-- ----------------------------
CREATE TRIGGER "update_site_access_logs_updated_at" BEFORE UPDATE ON "public"."site_access_logs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Primary Key structure for table site_access_logs
-- ----------------------------
ALTER TABLE "public"."site_access_logs" ADD CONSTRAINT "site_access_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table tags
-- ----------------------------
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table tags
-- ----------------------------
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Triggers structure for table user_favorites
-- ----------------------------
CREATE TRIGGER "update_user_favorites_updated_at" BEFORE UPDATE ON "public"."user_favorites"
FOR EACH ROW
EXECUTE PROCEDURE "public"."update_updated_at_column"();

-- ----------------------------
-- Uniques structure for table user_favorites
-- ----------------------------
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_unique" UNIQUE ("user_id", "content_type", "content_id");

-- ----------------------------
-- Primary Key structure for table user_favorites
-- ----------------------------
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
-- ALTER TABLE "public"."users" ADD CONSTRAINT "users_user_id_key" UNIQUE ("user_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table website_access_logs
-- ----------------------------
ALTER TABLE "public"."website_access_logs" ADD CONSTRAINT "website_access_logs_user_id_website_id_access_time_key" UNIQUE ("user_id", "website_id", "access_time");

-- ----------------------------
-- Primary Key structure for table website_access_logs
-- ----------------------------
ALTER TABLE "public"."website_access_logs" ADD CONSTRAINT "website_access_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table website_categories
-- ----------------------------
ALTER TABLE "public"."website_categories" ADD CONSTRAINT "website_categories_pkey" PRIMARY KEY ("website_id", "category_id");

-- ----------------------------
-- Primary Key structure for table website_tags
-- ----------------------------
ALTER TABLE "public"."website_tags" ADD CONSTRAINT "website_tags_pkey" PRIMARY KEY ("website_id", "tag_id");

-- ----------------------------
-- Primary Key structure for table websites
-- ----------------------------
ALTER TABLE "public"."websites" ADD CONSTRAINT "websites_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table files
-- ----------------------------
ALTER TABLE "public"."files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table site_access_logs
-- ----------------------------
ALTER TABLE "public"."site_access_logs" ADD CONSTRAINT "site_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table tags
-- ----------------------------
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_favorites
-- ----------------------------
ALTER TABLE "public"."user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table website_access_logs
-- ----------------------------
ALTER TABLE "public"."website_access_logs" ADD CONSTRAINT "website_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table website_categories
-- ----------------------------
ALTER TABLE "public"."website_categories" ADD CONSTRAINT "website_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."website_categories" ADD CONSTRAINT "website_categories_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."websites" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table website_tags
-- ----------------------------
ALTER TABLE "public"."website_tags" ADD CONSTRAINT "fk_website_tags_tag_id" FOREIGN KEY ("tag_id") REFERENCES "public"."tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."website_tags" ADD CONSTRAINT "fk_website_tags_website_id" FOREIGN KEY ("website_id") REFERENCES "public"."websites" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."website_tags" ADD CONSTRAINT "website_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table websites
-- ----------------------------
ALTER TABLE "public"."websites" ADD CONSTRAINT "fk_category_id" FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."websites" ADD CONSTRAINT "websites_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "public"."websites" ADD CONSTRAINT "websites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
```

## ⚙️ 7. 常见问题与解决方案

### Q1: 如何解决 CORS 问题？

A1: 在开发过程中，确保前端和后端都在正确的地址运行。如果遇到 CORS 问题，可以在后端中通过配置 CORS 中间件来解决。

### Q2: 如何修改数据库表结构？

A2: 你可以通过 Supabase 控制台修改数据库表结构，也可以编写迁移脚本来进行结构更新。

---

📌 **了解更多**：

- [简介](/guide/)
- [快速开始](/guide/getting-started)
- [前端文档](/guide/front-end-reference)
- [项目 GitHub 仓库](https://github.com/myltx/dream-hub)
