package com.icinfo.platform.student.service.impl;

import com.icinfo.platform.student.dao.StuTableDao;
import com.icinfo.platform.student.model.StuTable;
import com.icinfo.platform.student.service.IStuTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/8/9.
 */
@Service
public class StuTableServiceImpl implements IStuTableService {
    @Autowired
    private StuTableDao stuTableDao;

    @Override
    public List<StuTable> getList() throws Exception {
        return stuTableDao.selectList();
    }
}
