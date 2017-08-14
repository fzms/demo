package com.icinfo.platform.student.controller;

import com.icinfo.platform.common.bean.AjaxResponse;
import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.service.IStuTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
@Controller
@RequestMapping("/stu/info")
public class StuTableController {
    @Autowired
    private IStuTableService stuTableService;

    /**
     * 进入首页
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "page", method = RequestMethod.GET)
    public String page() throws Exception {
        return "index";
    }

    /**
     * 分页查询
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 查询结果
     * @throws Exception 异常
     */
    @RequestMapping(value = "query", method = RequestMethod.GET)
    @ResponseBody
    public AjaxResponse<List<StuTableDto>> query(@RequestParam(value = "pageNum", required = true) int pageNum,
                                                 @RequestParam(value = "pageSize", required = true) int pageSize) throws Exception {
        return new AjaxResponse<List<StuTableDto>>(stuTableService.getList(pageNum, pageSize));
    }
}
