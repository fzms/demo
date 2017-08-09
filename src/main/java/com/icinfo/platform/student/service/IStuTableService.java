package com.icinfo.platform.student.service;

import com.icinfo.platform.student.dto.StuTableDto;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
public interface IStuTableService {
    List<StuTableDto> getList() throws Exception;
}
