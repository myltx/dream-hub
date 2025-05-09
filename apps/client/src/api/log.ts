import { ServicePrefixEnum } from '~/enums/commonEnum';
import { getHttp } from './http';
import { RequestEnum } from '~/enums/httpEnum';

export function createSiteAccessLog(data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.SITE_ACCESS_LOG}`, {
    method: RequestEnum.POST,
    body: data,
  });
}

export function getSiteAccessLog() {
  const http = getHttp();
  return http(`${ServicePrefixEnum.SITE_ACCESS_LOG}`, {
    method: RequestEnum.GET,
  });
}

export function getSiteAccessInterViewCount() {
  const http = getHttp();
  return http(`${ServicePrefixEnum.SITE_ACCESS_LOG}/totalVisits`, {
    method: RequestEnum.GET,
  });
}

export function getSiteAccessLogQuery(params: any) {
  const http = getHttp();
  // 构建查询字符串
  const queryString = new URLSearchParams(params).toString();

  return http(`${ServicePrefixEnum.SITE_ACCESS_LOG}/query?${queryString}`, {
    method: RequestEnum.GET,
  });
}

// 这里开始是站点访问的日志接口
export function createWebsiteAccessLog(data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.WEBSITE_ACCESS_LOG}`, {
    method: RequestEnum.POST,
    body: data,
  });
}
