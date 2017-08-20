package com.icinfo.platform.student.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.icinfo.platform.student.dao.StuTableDao;
import com.icinfo.platform.student.dto.StuTableDto;
import com.icinfo.platform.student.model.StuTable;
import com.icinfo.platform.student.service.IStuTableService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/8/9.
 */
@Service
public class StuTableServiceImpl implements IStuTableService {
    @Autowired
    private StuTableDao stuTableDao;

    @Override
    public PageInfo<StuTableDto> getList(StuTable stuTable) throws Exception {
        PageHelper.startPage(stuTable.getPageNum(), stuTable.getPageSize());
        Page<StuTableDto> page = (Page<StuTableDto>) stuTableDao.selectList(stuTable);
        return page.toPageInfo();
    }

    @Override
    public StuTable getByStuId(String stuId) throws Exception {
        return stuTableDao.selectByPrimaryKey(stuId);
    }

    @Override
    public void save(StuTable stuTable) throws Exception {
        if(StringUtils.isBlank(stuTable.getStuId())){
            stuTableDao.insert(stuTable);
        }else {
            stuTableDao.updateByPrimaryKey(stuTable);
        }
    }

    @Override
    public void add(StuTable stuTable) throws Exception {
        stuTableDao.insert(stuTable);
    }

    @Override
    public void edit(StuTable stuTable) throws Exception {
        stuTableDao.updateByPrimaryKey(stuTable);
    }

    @Override
    public void remove(String stuId) throws Exception {
        stuTableDao.deleteByPrimaryKey(stuId);
    }
}
