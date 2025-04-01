import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { QueryWebsiteDto } from './dto/query-website.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class WebsiteService {
  dbName = 'websites';
  userService = new UserService(this.supabase);
  constructor(
    @Inject('SupabaseClient') private readonly supabase: SupabaseClient,
  ) {}
  async create(createWebsiteDto: CreateWebsiteDto) {
    const tags = createWebsiteDto.tags;
    delete createWebsiteDto.tags;

    const { data, error } = await this.supabase
      .from(this.dbName)
      .insert([createWebsiteDto])
      .select()
      .single();

    if (data && data.id) {
      const websiteId = data.id;
      if (tags && tags.length) {
        const subTags = tags.map((tag: string) => {
          return { tag_id: tag, website_id: websiteId };
        });
        const { error: tagError } = await this.supabase
          .from('website_tags')
          .insert(subTags);
        if (tagError) {
          throw new Error(`Supabase query failed: ${tagError.message}`);
        }
      }
    }
    if (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }

    return data;
  }
  async update(id: string, updateWebsiteDto: UpdateWebsiteDto) {
    const tags = updateWebsiteDto.tags;
    delete updateWebsiteDto.tags;
    const excludeKeys = ['categories', 'website_tags', 'tags', 'id'];

    for (const key in updateWebsiteDto) {
      if (excludeKeys.includes(key)) {
        delete updateWebsiteDto[key];
      }
    }

    // 更新主表数据
    const { data: websiteData, error: websiteError } = await this.supabase
      .from(this.dbName)
      .update(updateWebsiteDto)
      .eq('id', id)
      .select()
      .single();

    if (websiteError) {
      throw new Error(`Error updating website: ${websiteError.message}`);
    }

    // 更新关联表数据（website_tags）
    if (tags && tags.length) {
      // 删除旧的关联
      const { error: deleteError } = await this.supabase
        .from('website_tags')
        .delete()
        .eq('website_id', id);

      if (deleteError) {
        throw new Error(`Error removing old tags: ${deleteError.message}`);
      }

      // 插入新的关联
      const subTags = tags.map((tag: string) => ({
        tag_id: tag,
        website_id: id,
      }));

      const { error: insertError } = await this.supabase
        .from('website_tags')
        .insert(subTags);

      if (insertError) {
        throw new Error(`Error adding new tags: ${insertError.message}`);
      }
    }

    return websiteData;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from(this.dbName)
      .select(
        `
      *,
      categories!websites_category_id_fkey(name),
      website_tags(
        tag_id,
        tags!website_tags_tag_id_fkey(name)
      )
    `,
      )
      .order('created_at', { ascending: false }); // 按创建时间降序排序
    // .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(`Error getting tafs: ${error.message}`);
    }

    return data;
  }
  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from(this.dbName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error getting taf: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    // 删除关联表中的数据
    const { error: tagsError } = await this.supabase
      .from('website_tags')
      .delete()
      .eq('website_id', id);

    if (tagsError) {
      throw new Error(`Error removing tags: ${tagsError.message}`);
    }

    // 删除主表中的数据
    const { data, error } = await this.supabase
      .from(this.dbName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error deleting website: ${error.message}`);
    }

    return data;
  }

  async findByQuery(query: QueryWebsiteDto) {
    const { page, limit, user_id, ...filters } = query;

    const offset = (page - 1) * limit;

    // 构建动态查询
    const queryBuilder = this.supabase.from(this.dbName).select(
      `*,
    categories!websites_category_id_fkey(name),
    website_tags(
      tag_id,
      tags!website_tags_tag_id_fkey(name)
    )`,
      { count: 'exact' },
    );

    const exclude = ['category_id'];
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (!exclude.includes(key)) {
          queryBuilder.ilike(key, `%${value}%`); // 假设需要模糊查询
        } else {
          queryBuilder.eq(key, value);
        }
      }
    }
    // 实现 根据用户id获取用户信息
    const { roles } = await this.userService.findOne(user_id);
    if (!roles.includes('admin')) {
      queryBuilder.eq('user_id', user_id);
    }
    const { data, error, count } = await queryBuilder.range(
      offset,
      offset + limit * 1 - 1,
    );

    if (error) {
      throw new Error(`Failed to get files: ${error.message}`);
    }
    // 计算总页数
    const totalPages = Math.ceil((count || 0) / limit);

    return {
      list: data,
      total: count,
      totalPages,
      page,
      limit,
    };
  }

  async findByQueryAll(query: any) {
    const { limit, user_id, ...filters } = query;

    // 构建动态查询
    const queryBuilder = this.supabase.from(this.dbName).select(
      `*,
      categories!websites_category_id_fkey(name),
      website_tags(
        tag_id,
        tags!website_tags_tag_id_fkey(name)
      )`,
      { count: 'exact' },
    );

    // 过滤条件
    const exclude = ['category_id'];
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (!exclude.includes(key)) {
          queryBuilder.ilike(key, `%${value}%`); // 假设需要模糊查询
        } else {
          queryBuilder.eq(key, value);
        }
      }
    }

    // 添加 `status` 和 `is_public` 的条件
    queryBuilder.eq('status', true); // 只查询 status 为 true 的记录
    if (user_id) {
      // 用户存在时，查询公共数据和用户私有数据
      queryBuilder.or(
        `is_public.eq.true,and(user_id.eq.${user_id},is_public.eq.false)`,
      );
    } else {
      // 用户不存在时，只查询公共数据
      queryBuilder.eq('is_public', true);
    }

    // 排序逻辑
    queryBuilder
      .order('is_recommended', { ascending: false }) // 推荐优先
      .order('is_top', { ascending: false }) // 置顶优先
      .order('sort_order', { ascending: true }) // 按 sort_order 排序
      .order('created_at', { ascending: false }); // 按 created_at 排序

    // 分页
    const { data, error, count } = await queryBuilder.range(
      0,
      limit * 1 - 1 || 99999,
    );

    if (error) {
      throw new Error(`查询出错: ${error.message}`);
    }

    // 获取当前用户收藏的内容（仅站点类型）
    const { data: favorites, error: favoritesError } = await this.supabase
      .from('user_favorites')
      .select('id, content_id') // 获取收藏记录的 id 和 content_id
      .eq('user_id', user_id)
      .eq('content_type', 'website'); // 仅查询收藏的站点

    if (favoritesError) {
      throw new Error(`获取收藏数据出错: ${favoritesError.message}`);
    }

    // 收藏记录的映射
    const favoriteMap = new Map(
      favorites.map((fav) => [
        fav.content_id,
        { id: fav.id, content_id: fav.content_id },
      ]),
    );

    // 标记站点是否已被收藏，并且附加 favoriteId
    const enrichedData = data.map((website) => {
      const favorite: any = favoriteMap.get(website.id.toString()); // 查找对应收藏记录
      return {
        ...website,
        is_favorited: Boolean(favorite), // 如果有对应收藏记录，则为 true
        favoriteId: favorite ? favorite?.id : '', // 收藏记录的 id，用于删除
      };
    });

    return {
      list: enrichedData,
      total: count,
    };
  }

  async findByQueryGroupAll(query: any) {
    const { limit, user_id, ...filters } = query;

    // 构建动态查询
    const queryBuilder = this.supabase.from(this.dbName).select(
      `*,
      categories!websites_category_id_fkey(name, id),
      website_tags(
        tag_id,
        tags!website_tags_tag_id_fkey(name)
      )`,
      { count: 'exact' },
    );

    // 过滤条件
    const exclude = ['category_id'];
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (!exclude.includes(key)) {
          queryBuilder.ilike(key, `%${value}%`); // 假设需要模糊查询
        } else {
          queryBuilder.eq(key, value);
        }
      }
    }

    // 添加 `status` 和 `is_public` 的条件
    queryBuilder.eq('status', true); // 只查询 status 为 true 的记录
    if (user_id) {
      // 用户存在时，查询公共数据和用户私有数据
      queryBuilder.or(
        `is_public.eq.true,and(user_id.eq.${user_id},is_public.eq.false)`,
      );
    } else {
      // 用户不存在时，只查询公共数据
      queryBuilder.eq('is_public', true);
    }

    // 排序逻辑
    queryBuilder
      .order('is_recommended', { ascending: false }) // 推荐优先
      .order('is_top', { ascending: false }) // 置顶优先
      .order('sort_order', { ascending: true }) // 按 sort_order 排序
      .order('created_at', { ascending: false }); // 按 created_at 排序

    // 分页
    const { data, error, count } = await queryBuilder.range(
      0,
      limit * 1 - 1 || 99999,
    );

    if (error) {
      throw new Error(`查询出错: ${error.message}`);
    }

    // 获取当前用户收藏的内容（仅站点类型）
    const { data: favorites, error: favoritesError } = await this.supabase
      .from('user_favorites')
      .select('id, content_id') // 获取收藏记录的 id 和 content_id
      .eq('user_id', user_id)
      .eq('content_type', 'website'); // 仅查询收藏的站点

    if (favoritesError) {
      throw new Error(`获取收藏数据出错: ${favoritesError.message}`);
    }

    // 收藏记录的映射
    const favoriteMap = new Map(
      favorites.map((fav) => [
        fav.content_id,
        { id: fav.id, content_id: fav.content_id },
      ]),
    );

    // 标记站点是否已被收藏，并且附加 favoriteId
    const enrichedData = data.map((website) => {
      const favorite: any = favoriteMap.get(website.id.toString()); // 查找对应收藏记录
      return {
        ...website,
        is_favorited: Boolean(favorite), // 如果有对应收藏记录，则为 true
        favoriteId: favorite ? favorite?.id : '', // 收藏记录的 id，用于删除
      };
    });

    // 根据分类 ID 分组数据
    const groupedByCategory = enrichedData.reduce((acc, website) => {
      const categoryId = website.categories?.id; // 假设每个站点有 categories 对象并包含 id

      if (categoryId) {
        if (!acc[categoryId]) {
          acc[categoryId] = {
            list: [],
            categories: website.categories, // 记录分类信息
          };
        }
        acc[categoryId].list.push(website); // 将站点加入该分类的 list 中
      }

      return acc;
    }, {});

    // 将分组的数据转换为一个数组
    const result = Object.values(groupedByCategory);
    // 根据 categories.sort_order 对分组进行排序
    result.sort((a: any, b: any) => {
      return a.categories.sort_order - b.categories.sort_order;
    });
    return {
      groupedData: result,
      total: count,
    };
  }

  // 实现根据 visit_count 字段获取排名逻辑 需要十条
  async getRanking() {
    const { data, error } = await this.supabase
      .from(this.dbName)
      .select('*')
      .order('visit_count', { ascending: false }) // 按访问量降序排序
      .range(0, 9); // 获取前10条数据
    if (error) {
      throw new Error(`Error getting ranking: ${error.message}`);
    }
    return data;
  }
  // async increaseVisitCount(id: string) {
  //   const { data, error } = await this.supabase
  //     .from(this.dbName)
  //     .update({ visit_count: this.supabase.rpc('increment', { count: 1 }) })
  //     .eq('id', id)
  //     .select();

  //   if (error) {
  //     throw new Error(`Error increasing visit count: ${error.message}`);
  //   }

  //   return data;
  // }
  async increaseVisitCount(id: string) {
    // 查询当前值
    const { data: currentData, error: fetchError } = await this.supabase
      .from(this.dbName)
      .select('visit_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching visit count: ${fetchError.message}`);
    }

    // 递增并更新
    const newCount = currentData.visit_count + 1;
    const { data, error } = await this.supabase
      .from(this.dbName)
      .update({ visit_count: newCount })
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Error increasing visit count: ${error.message}`);
    }

    return data;
  }
}
