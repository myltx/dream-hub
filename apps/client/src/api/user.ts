import { ServicePrefixEnum } from '~/enums/commonEnum';
import { getHttp } from './http';
import { RequestEnum } from '~/enums/httpEnum';

export function createUser(data: any) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.USER}/create`, {
    method: RequestEnum.POST,
    body: data,
  });
}

export function getUserInfo() {
  const http = getHttp();
  return http(`${ServicePrefixEnum.USER}`, {
    method: RequestEnum.GET,
  });
}

export function getUserInfoByUserId(data: { userId: string }) {
  const http = getHttp();
  return http(`${ServicePrefixEnum.USER}/detail`, {
    method: RequestEnum.POST,
    body: data,
  });
}