package com.icinfo.platform.student.service;

import com.github.pagehelper.PageInfo;
import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.model.StuTable;

/**
 * Created by Administrator on 2017/8/9.
 */
public interface IStuTableService {
    PageInfo<StuTableDto> getList(StuTable stuTable) throws Exception;

    StuTable getByStuId(String stuId) throws Exception;

    void save(StuTable stuTable) throws Exception;

    void add(StuTable stuTable) throws Exception;

    void edit(StuTable stuTable) throws Exception;

    void remove(String stuId) throws Exception;
}
