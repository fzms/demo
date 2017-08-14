package com.icinfo.platform.student.service;

import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.model.StuTable;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
public interface IStuTableService {
    List<StuTableDto> getList(int pageNum, int pageSize) throws Exception;

    StuTable getByStuId(String stuId) throws Exception;

    void save(StuTable stuTable) throws Exception;

    void remove(String stuId) throws Exception;
}
