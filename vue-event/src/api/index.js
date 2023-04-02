import request from '@/utils/request'

/**
 * 注册接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取-用户基础资料
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取-侧边栏菜单数据
 * @returns Promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新-用户基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, user_pic: 用户头像地址, username: 用户名 }
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic,
      username
    }
  })
}
/**
 * 更新用户的头像
 * @param {*} avatar头像图片base64的字符串
 * @returns 返回一个Promise的对象
 */
export const updateUserAvatarAPI = (avatar) => {
    return request({
      url: '/my/update/avatar',
      method: 'PATCH',
      data: {
        avatar// 头像base64的字符串
      }
    })
}
/**
 * 更新用户密码
 * @param {*} 传递一个{ old_pwd, new_pwd, re_pwd }
 * @returns 返回一个Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
    return request({
        url: '/my/updatepwd',
        method: 'PATCH',
        data: {
          old_pwd,
          new_pwd,
          re_pwd
        }
    })
}
/**
 * 获取文章的分类
 * @returns 返回的是一个Promise的对象
 */
export const getArtCateListAPI = () => {
  return request({
      url: '/my/cate/list'
  })
}
/**
 * 添加文章分类的接口
 * @param {*} param0 { cate_name：分类名称, cate_alias：分类别名}
 * @returns 返回一个Promise的对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
        return request({
            url: '/my/cate/add',
            method: 'POST',
            data: {
              cate_name,
              cate_alias
            }
        })
}
/**
 * 更新文章分类
 * @param {*} param0 { id, cate_name, cate_alias }
 * @returns Promise
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
      url: '/my/cate/info',
      method: 'PUT',
      data: {
        id,
        cate_name,
        cate_alias
      }

  })
}
/**
 * 删除文章的分类
 * @param {*} id 文章的id
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
     return request({
      url: '/my/cate/del',
      method: 'DELETE',
      params: {
        id
      }

     })
}
/**
 * 发布文章
 * @param {*} fd FormData 表单数据对象
 * @returns 返回一个promise对象
 */
export const uploadArticleAPI = (fd) => {
 return request({
     url: '/my/article/add',
     method: 'POST',
     data: fd
    //  {}如果是一个普通对象，axios会将他转换JSON字符串，把他放到请求体里交给后台，如果是表单对象，传递的请求体 会设置Content-Type：form-data与后端对应
    // 这个接口文档要求请求体里是一个FormData类型（表单数据对象）携带文件给后台 （以后写接口代码时注意后台需要的文件格式）
    // 如果是文件数据对象就不再写{}，用一个变量名接收
 })
}
/**
 * 获取文章列表
 * @param {*} param0 { pagenum：当前的页码, pagesize：当前页面需要的数据条数, cate_id：文章分类的id, state：文章的状态码 }
 * @returns 返回Promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
        pagenum,
        pagesize,
        cate_id,
        state
    }
  })
}
/**
 * 获取文章的详情
 * @param {*} id 文章的id
 * @returns 返回一个Promise对象
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}
/**
 * 删除文章
 * @param {*} id 文章的id
 * @returns 返回一个Promise对象
 */
export const removeArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
// 传递参数有三种，params：{}（将值用？的方式拼接到url后面，其值是query），data：{}（将值以请求头的方式拼接到url中，其值是body）
// header：{}（就是请求头，其参数是请求头
