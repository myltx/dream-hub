import { ServicePrefixEnum } from '~/enums/commonEnum';
import { getHttp } from './http';
import { RequestEnum } from '~/enums/httpEnum';

export function createWebsite(data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}`, {
    method: RequestEnum.POST,
    body: data,
  });
}

export function websiteVisit(id: string) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/visit/${id}`, {
    method: RequestEnum.GET,
  });
}

export function getWebsite() {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}`, {
    method: RequestEnum.GET,
  });
}

export function updateWebsite(id: string, data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/${id}`, {
    method: RequestEnum.PATCH,
    body: data,
  });
}
export function delWebSite(id: string) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/${id}`, {
    method: RequestEnum.DELETE,
  });
}

export function getWebsiteList(data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/public`, {
    method: RequestEnum.GET,
  });
}

export function getWebsiteQuery(params: any) {
  const http = getHttp();
  // 构建查询字符串
  const queryString = new URLSearchParams(params).toString();

  return http(`${ServicePrefixEnum.WEBSITE}/query?${queryString}`, {
    method: RequestEnum.GET,
  });
}

export function getWebsiteQueryAll(params: any) {
  const http = getHttp();
  // 构建查询字符串
  const queryString = new URLSearchParams(params).toString();

  return http(`${ServicePrefixEnum.WEBSITE}/queryAll?${queryString}`, {
    method: RequestEnum.GET,
  });
}

export function getWebsiteQueryAllGroup(userId: string) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/queryAllGroup?userId=${userId}`, {
    method: RequestEnum.GET,
  });
}

export function getRanking() {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE}/ranking`, {
    method: RequestEnum.GET,
  });
}
