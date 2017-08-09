package com.icinfo.platform.student.controller;

import com.icinfo.platform.common.bean.AjaxResponse;
import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.service.IStuTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
@Controller
@RequestMapping("/stu/info")
public class StuTableController {
    @Autowired
    private IStuTableService stuTableService;

    @RequestMapping(value = "page", method = RequestMethod.GET)
    public String page() throws Exception {
        return "index";
    }

    @RequestMapping(value = "query", method = RequestMethod.GET)
    @ResponseBody
    public AjaxResponse<List<StuTableDto>> query(HttpServletRequest request) throws Exception {
        return new AjaxResponse<List<StuTableDto>>(stuTableService.getList());
    }
}
