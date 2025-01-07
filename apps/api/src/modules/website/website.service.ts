import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';

@Injectable()
export class WebsiteService {
  dbName = 'websites';
  constructor(
    @Inject('SupabaseClient') private readonly supabase: SupabaseClient,
  ) {}
  async create(createWebsiteDto: CreateWebsiteDto) {
    const { data, error } = await this.supabase
      .from(this.dbName)
      .insert([createWebsiteDto]);

    if (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }

    return data;
  }
  async update(id: string, updateWebsiteDto: UpdateWebsiteDto) {
    const { data, error } = await this.supabase
      .from(this.dbName)
      .update(updateWebsiteDto)
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating taf: ${error.message}`);
    }

    return data;
  }
  async findAll() {
    const { data, error } = await this.supabase.from(this.dbName).select('*');

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
    const { data, error } = await this.supabase
      .from(this.dbName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting taf: ${error.message}`);
    }

    return data;
  }
  async findByQuery(query: Record<string, any>) {
    let queryBuilder = this.supabase.from(this.dbName).select('*');

    // 动态构建查询条件
    for (const [key, value] of Object.entries(query)) {
      queryBuilder = queryBuilder.eq(key, value);
    }
    // const limit = query.limit || 10;
    // const offset = query.offset || 0;
    // queryBuilder = queryBuilder.range(offset, offset + limit - 1);
    // if (query.sortBy) {
    //   queryBuilder = queryBuilder.order(query.sortBy, {
    //     ascending: query.order !== 'desc',
    //   });
    // }
    const { data, error } = await queryBuilder;
    if (error) {
      throw new Error(`查询失败: ${error.message}`);
    }
    return data;
  }
}