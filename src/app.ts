import request from 'umi-request';
import type { MenuDataItem } from '@ant-design/pro-layout';
import arrayUtils from '@/utils/array';
import { LOGIN_CONFIG } from './constant';

/** 初始化数据 */
export async function getInitialState() {
  let menus: MenuDataItem[] = [];
  const privileges: string[] = [];
  const userInfo = {};

  const accessToken = localStorage.getItem('accessToken');
  if (LOGIN_CONFIG.isSSO || accessToken) {
    try {
      const result = await request.get('/resource');
      const { code, success, data = [] } = result;
      if (code === 20000 && success) {
        const routes: PrivilegeResource[] = arrayUtils.deepOrder({
          data,
          childKey: 'children',
          orderKey: 'orderValue',
          type: 'asc',
        });
        const flatRoutes = arrayUtils.deepFlatten(routes);
        flatRoutes.forEach((route) => {
          if (route.privilegeList) {
            privileges.push(...route.privilegeList);
          }
        });
        menus = convertResourceToMenu(routes);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return {
    menus,
    privileges,
    userInfo,
  };
}

/**
 * 将后台返回的权限资源，转换成应用的菜单
 * @param resources
 */
function convertResourceToMenu(list: PrivilegeResource[]): MenuDataItem[] {
  return list.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        name: item.description,
        key: `${item.apiUrl}`,
        customIcon: item.icon,
        path: item.apiUrl,
        children: convertResourceToMenu(item.children),
      };
    }
    return {
      name: item.description,
      key: `${item.apiUrl}`,
      customIcon: item.icon,
      path: item.apiUrl,
    };
  });
}
