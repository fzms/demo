package com.icinfo.platform.student.dao;

import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.mapper.StuTableMapper;
import com.icinfo.platform.student.model.StuTable;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
public interface StuTableDao extends StuTableMapper {
    List<StuTableDto> selectList(StuTable stuTable) throws Exception;
}
