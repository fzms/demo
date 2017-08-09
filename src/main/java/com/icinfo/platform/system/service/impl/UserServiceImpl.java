package com.icinfo.platform.system.service.impl;

import com.icinfo.platform.system.service.IUserService;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/8/7.
 */
@Service
public class UserServiceImpl implements IUserService {
    /**
     * 用户登录
     *
     * @param username 用户名
     * @param password 密码
     * @return 结果
     * @throws Exception 异常
     */
    @Override
    public String login(String username, String password) throws Exception {
        if (username.equals("admin") && password.equals("88888888")) {
            return "success";
        }
        return "fail";
    }
}
