/**
 * Created by cxs on 2017/8/10.  from BusinessClaimController.js
 */
var app = angular.module('BusinessClaim', [ 'ui.grid', 'ui.grid.edit','ui.grid.selection','ui.grid.pinning','ui.grid.pagination','ui.grid.exporter','ui.grid.autoResize','ui.grid.resizeColumns']);
app.controller('BusinessClaimController',function($rootScope,$scope,$compile,$controller,$http,$uibModal,$log,$state,uiGridConstants,uiGridExporterConstants,MessageBox,UUID,i18nService,$stateParams) {
    $controller('listBaseController', {$scope: $scope});
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;


    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.disableCogs = true;
    $scope.size=15;
    $scope.rowSelected = null;


    //默认不设置排序，后台根据mainMenu.groupMenu.navMenu.sortIndex,mainMenu.groupMenu.sortIndex,mainMenu.sortIndex排序
    $scope.paginationOptions = {
        filter:'',
        page: 0,
        size: $scope.size,
        sorts: [{field:"registerTime",direction:"desc"}]
    };

    //清空搜索框
    $scope.clearSearchBox= function(){
        $("#name").val("");
        $("#startTime").val("");
        $("#endTime").val("");
        $("#location").val("");
        $("#contact").val("");
        $("#contactTel").val("");
    };

    $scope.search = function(){
        $("#searchBox").toggle();
    };

    /**
     * 查询多条件模糊查询
     */
    $scope.findByProjectPage = function(){
        if($stateParams.projectPage != null){
            $scope.projectPage = {
                jpaPageRequest:$scope.paginationOptions,
                name : $stateParams.projectPage.name,
                startTime : "",
                endTime:"",
                location :"",
                contact:"",
                contactTel: ""
            };
            $stateParams.projectPage = null;
            $scope.paramsFlag = true;
        }else{
            $scope.projectPage = {
                jpaPageRequest: $scope.paginationOptions,
                name: $("#name").val(),
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                location: $("#location").val(),
                contact: $("#contact").val(),
                contactTel: $("#contactTel").val()
            }
            $scope.paramsFlag = false;
        };
        $http.post("projectController/findByProjectPage.do?status=myClaimableTasks",$scope.projectPage).success(function (page) {
            if(page != ""){
                $scope.gridOptions.totalItems = page.totalElements;
                $scope.projects=page.content;
                $scope.gridOptions.data=page.content;
            }else{
                $scope.gridOptions.totalItems = 0;
                $scope.projects= [];
                $scope.gridOptions.data= [];
            }
            $scope.rowSelected = null;
        }).error(function(data){
            MessageBox.alert("查询失败");
        });
    };



    //列表设置
    $scope.gridOptions = {
        showGroupPanel: true,
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: $scope.size,
        //使用服务端分页
        useExternalPagination: true,//是否使用分页按钮
        useExternalSorting: true,  //是否使用自定义排序规则
        enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar : 1,   //grid垂直滚动条是否显示, 0-不显示  1-显示
        exporterOlderExcelCompatibility:true,
        //enableFullRowSelection:true,
        enableSelectAll : false,
        multiSelect:false,
        columnDefs: [
            {field: 'id', displayName: 'Id',visible:false},
            {name: 'name',displayName:'项目名称',cellTemplate: "<div class='ui-grid-cell-contents'>" +
            "<span style='width: 14px;display: inline-block;' title=\"剩余{{row.entity.leftHours<0?0:row.entity.leftHours}}小时\">" +
            "<i class='text-danger fa fa-exclamation-triangle {{row.entity.emergencyDegree!=\"紧急件\"?\"ng-hide\":\" \"}}'></i>" +
            "</span>{{row.entity.name}}</div>",minWidth:'140',fit:true},
            {field: 'reportType',displayName:'报告类型',width:80},
            {field: 'department.dname',displayName:'业务部门',width:80},
            {field: 'status',displayName:'状态',width:100},
            {field: 'registerTime', displayName: '登记时间',width:'130',cellClass:'text-right'},
            {field: 'reviewReportSN', displayName:'预估函编号', width:100},
            {field: 'reportSN', displayName:'报告编号', width:100},
            {field: 'firstRoundUser.name',displayName:'估价师1',width:80},
            {field: 'secondRoundUser.name',displayName:'估价师2',width:80},
            {field: 'appraisalPerson',displayName:'估价人员',width:80}
            //{field: 'id', displayName: 'Id',visible:false},
            //{field: 'name',displayName:'估价对象名称',minWidth:100,fit:true},
            //{field: 'currentStatus',displayName:'任务状态',width:100},
            //{field: 'name',displayName:'当前执行人',width:100},
            //{field: 'status',displayName:'估价对象状态',width:100},
            //{field: 'registerNo',displayName:'登记编号',width:100},
            //{field: 'registerTime',displayName:'登记日期',width:100},
            //{field: 'registerPerson',displayName:'登记人',width:100},
            //{field: 'department.dname',displayName:'业务部门',width:100},
            //{field: 'reportSN', displayName:'报告编号', width:100},
            //{field: 'user.name',displayName:'负责人',width:100},
            //{field: 'businessSource',displayName:'业务来源',width:100},
            //{field: 'contact',displayName:'委托人',width:100},
            //{field: 'businessType',displayName:'业务类型',width:100},
            //{field: 'name',displayName:'项目名称',width:100},
            //{field: 'objectType',displayName:'估价对象类型',width:100},
            //{field: 'name',displayName:'交易类型',width:100},
            //{field: 'aim',displayName:'估价目的',width:100},
            //{field: 'emergencyDegree',displayName:'紧急程度',width:100},
            //{field: 'name',displayName:'价值类型',width:100},
            //{field: 'name',displayName:'价值时点',width:100},
            //{field: 'status',displayName:'委托状态',width:100}
        ]

    };
    //注册gridApi
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;

        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length == 0) {
                $scope.paginationOptions.sorts = [{direction:'desc',field:'registerTime'}];
            } else {
                sortColumns.sort(function(col1,col2){
                    return col1.sort.priority-col2.sort.priority;
                });
                var sorts=[];
                for(var i=0;i<sortColumns.length;i++)
                {
                    sorts.push({direction:sortColumns[i].sort.direction,field:sortColumns[i].name});
                }
                $scope.paginationOptions.sorts = sorts;
            }
            $scope.findByProjectPage();
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.paginationOptions.page = newPage-1;
            $scope.paginationOptions.size = pageSize;
            $scope.findByProjectPage();
        });
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            if($scope.gridApi.grid.selection.selectedCount == 0){
                $scope.rowSelected = null;
            }else{
                $scope.rowSelected = row.entity;
            }
        });
    };
    $scope.filterChange=function(){
        $scope.paginationOptions.filter=$scope.filter;
        $scope.findByProjectPage();
    };

    $scope.anyRowSelected = function () {
        if($scope.rowSelected == null){
            MessageBox.alert("请先选择业务");
        }
    };

    $scope.action_ClaimTask = function () {
        MessageBox.confirm("确定要认领该任务吗?").then(function() {
            $http.post("projectController/claimTask.do", $scope.rowSelected).success(function (data) {
                if (data) {
                    MessageBox.alert("认领成功！");
                    $scope.findByProjectPage();
                } else {
                    MessageBox.alert("认领失败！");
                }
            });
        });
    };

    $scope.action_ViewFlowRecords = function () {
        var templateUrl, controller,size;
        templateUrl = 'views/modal/ProjectFlowRecordsModal.html';
        controller  ='flowRecordsController';
        size = 'lg';

        var modalInstance = $uibModal.open({
            backdrop:'static',
            animation: true,
            templateUrl: templateUrl,
            controller: controller,
            size: size,
            keyboard: false,
            resolve: {
                project: function () {
                    return $scope.rowSelected;
                }
            }
        });
        modalInstance.result.then(function (result) {
            // $scope.findByProjectPage();
        });
    };

    $scope.findByProjectPage();

});


app.controller('flowRecordsController', function ($scope,$uibModalInstance,$http,project,$window) {

    $scope.gridOptions = {
        showGroupPanel: true,
        exporterOlderExcelCompatibility:true,
        enableCellEdit : false,
        enableRowHeaderSelection: false,
        enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
        // enableVerticalScrollbar : 0,   //grid垂直滚动条是否显示, 0-不显示  1-显示
        columnDefs: [
            {field: 'id', name:'id',displayName: 'Id',type:'Date',visible:false},
            {field: 'createTimeString', name:'createTimeString',displayName: '操作时间',width:150, sort:{direction:'asc'}},
            {field: 'operateName', name:'operateName',displayName: '操作名称',width:150},
            {field: 'creator', name:'creator',displayName: '操作用户',width:150},
            {field: 'memo', name:'memo',displayName: '备注信息',minWidth:150, cellClass: 'text-left'}
        ]
    };




    //注册gridApi
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length == 0) {
                $scope.gridApi.grid.columns[1].sort = {direction:'asc'};
            }
        });
        $scope.findTaskRecords();
    };

    $scope.findTaskRecords = function() {
        $http.post("projectController/findFlowRecords.do?id=" +project.id).success(function(data){
            $scope.gridOptions.data=data;
        }).error(function(data){
            $window.alert("查询失败");
        });
    };


    $scope.cancel = function(){
        $uibModalInstance.close(true);
    };
});

