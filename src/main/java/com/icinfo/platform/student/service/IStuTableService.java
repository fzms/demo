package com.icinfo.platform.student.service;

import com.icinfo.platform.student.model.StuTable;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
public interface IStuTableService {
    List<StuTable> getList() throws Exception;
}
