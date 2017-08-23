package com.icinfo.platform.student.controller;

import com.github.pagehelper.PageInfo;
import com.icinfo.platform.common.bean.AjaxResponse;
import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.model.StuTable;
import com.icinfo.platform.student.service.IStuTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
     * @param stuTable 查询参数
     * @return 查询结果
     * @throws Exception 异常
     */
    @RequestMapping(value = "query", method = RequestMethod.POST)
    @ResponseBody
    public AjaxResponse<PageInfo<StuTableDto>> query(@RequestBody StuTable stuTable) throws Exception {
        return new AjaxResponse<PageInfo<StuTableDto>>(stuTableService.getList(stuTable));
    }

    /**
     * 进入新增页面
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "toadd", method = RequestMethod.GET)
    public String toAdd() throws Exception {
        return "edit";
    }

    /**
     * 进入修改页面
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "toedit", method = RequestMethod.GET)
    public String toEdit(Model model) throws Exception {
        return "edit";
    }

    /**
     * 根据stuId获取信息
     *
     * @param stuId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "get/{stuId}", method = RequestMethod.GET)
    @ResponseBody
    public AjaxResponse<StuTable> get(@PathVariable(value = "stuId") String stuId) throws Exception {
        return new AjaxResponse<>(stuTableService.getByStuId(stuId));
    }

    /**
     * 新增/修改
     *
     * @param stuTable
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "addoredit", method = RequestMethod.POST)
    @ResponseBody
    public AjaxResponse<Boolean> addOrEdit(StuTable stuTable) throws Exception {
        stuTableService.save(stuTable);
        return new AjaxResponse<>(true);
    }

    /**
     * 新增
     *
     * @param stuTable
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "add", method = RequestMethod.POST)
    @ResponseBody
    public AjaxResponse<Boolean> add(@RequestBody StuTable stuTable) throws Exception {
        if (stuTableService.getByStuId(stuTable.getStuId()) != null) {
            return new AjaxResponse<>("false", "学号已存在");
        }
        stuTableService.add(stuTable);
        return new AjaxResponse<>(true);
    }

    /**
     * 修改
     *
     * @param stuTable
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "edit", method = RequestMethod.POST)
    @ResponseBody
    public AjaxResponse<Boolean> edit(@RequestBody StuTable stuTable) throws Exception {
        stuTableService.edit(stuTable);
        return new AjaxResponse<>(true);
    }

    /**
     * 删除
     *
     * @param stuId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "delete/{stuId}", method = RequestMethod.POST)
    @ResponseBody
    public AjaxResponse<Boolean> delete(@PathVariable(value = "stuId") String stuId) throws Exception {
        stuTableService.remove(stuId);
        return new AjaxResponse<>(true);
    }
}
