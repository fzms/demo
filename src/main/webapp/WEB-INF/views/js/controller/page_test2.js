/**
 * Created by cxs on 2017/8/10. from TestMessageController.js
 */
var app = angular.module('testMessage', ['ui.grid','ui.grid.selection','ui.grid.pinning','ui.grid.pagination','ui.grid.exporter','ui.grid.autoResize','ui.grid.resizeColumns','isteven-multi-select']);
app.controller('testMessageController',function($rootScope,$scope,$controller,$http,$uibModal,$log,uiGridConstants,uiGridExporterConstants,MessageBox,UUID,i18nService,$filter) {
    $controller('listBaseController', {$scope: $scope});

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    // 国际化；
    i18nService.setCurrentLang("zh-cn");
    $scope.disableCogs = true;
    $scope.disableSearch = true;
    $scope.disableAddNew = true;
    $scope.disableDeleteAll = true;

    $scope.title = true;
    $scope.size=15;
    $scope.processs=[];


    //默认不设置排序，后台根据mainMenu.groupMenu.navMenu.sortIndex,mainMenu.groupMenu.sortIndex,mainMenu.sortIndex排序
    $scope.paginationOptions = {
        filter:'',
        page: 0,
        size: $scope.size,
        sorts: [{field:"createTime",direction:"desc"}]
    };

    //获取分页后的流程信息
    $scope.getPagedProcesses = function() {
        $http.post('messageController/getFilteredPageProcesses.do',$scope.paginationOptions).success(function(page){
            $scope.gridOptions.totalItems = page.totalElements;
            $scope.processes=page.content;
            $scope.gridOptions.data=page.content;
        });
    };
    $scope.rowsIDSelected = [];
    $scope.rowsSelected=[];

    //列表设置
    $scope.gridOptions = {
        showGroupPanel: true,
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: $scope.size,
        //使用服务端分页
        useExternalPagination: true,//是否使用分页按钮
        useExternalSorting: true,  //是否使用自定义排序规则
        enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar : 1,   //grid垂直滚动条是否显示, 0-不显示  1-显示
        exporterOlderExcelCompatibility:true,
        columnDefs: [
            {field: 'id', displayName: 'Id',visible:false},
            {field: 'readTime',displayName:'阅读时间',width: 130,cellFilter:'date: "yyyy-MM-dd HH:mm:ss"',visible:false},
            {field: 'sendUserName',displayName:'发件人',width: 80,cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.readTime == null"><b>{{row.entity.sendUserName}}</b></div><div class="ui-grid-cell-contents" ng-if="row.entity.readTime != null">{{row.entity.sendUserName}}</div>'},
            {field: 'receiveUsername',displayName:'收件人',width: 80,cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.readTime == null"><b>{{row.entity.receiveUsername}}</b></div><div class="ui-grid-cell-contents" ng-if="row.entity.readTime != null">{{row.entity.receiveUsername}}</div>'},
            {field: 'messageTypeString',displayName:'消息类型',width: 100,cellTemplate: '<div class="ui-grid-cell-contents text-center" ng-if="row.entity.readTime == null"><b>{{row.entity.messageTypeString}}</b></div><div class="ui-grid-cell-contents text-center" ng-if="row.entity.readTime != null">{{row.entity.messageTypeString}}</div>'},
            {field: 'createTime',displayName:'发送时间',width: 150,cellTemplate: '<div class="ui-grid-cell-contents text-center" ng-if="row.entity.readTime == null"><b>{{row.entity.createTime|date: "yyyy-MM-dd HH:mm:ss"}}</b></div><div class="ui-grid-cell-contents text-center" ng-if="row.entity.readTime != null">{{row.entity.createTime|date: "yyyy-MM-dd HH:mm:ss"}}</div>'},
            {field: 'params',displayName:'参数',width: 50,visible: false},
            //{field: 'readFlagString',displayName:'是否已读',width: 80,cellClass:'text-center',visible:false},
            {field: 'messageContent', displayName: '文字内容',minWidth: 100,cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.readTime == null"><b>{{row.entity.messageContent}}</b></div><div class="ui-grid-cell-contents" ng-if="row.entity.readTime != null">{{row.entity.messageContent}}</div>'},
            {name: 'edit', displayName: '操作',fixed:true,pinnedRight:false,enableColumnMenu:false,enableSorting:false,
                cellTemplate: '<div class="ui-grid-cell-contents text-center" style="padding: 3px"><a class="btn blue-madison btn-xs" ng-click="grid.appScope.read(row.entity)" ><i class="fa fa-leanpub"></i><span style="padding-left: 2px;">阅读</span></a>&nbsp;<a type="button" class="btn blue-madison btn-xs" ng-click="grid.appScope.delete(row.entity);" ><i class="fa fa-remove"></i><span style="padding-left: 2px;">删除</span></a></div>',width:120}
        ]

    };

    //注册gridApi
    $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length == 0) {
                $scope.paginationOptions.sorts = [{field:"createTime",direction:"desc"}];
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
            $scope.getPagedProcesses();
        });
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var length = $scope.rowsIDSelected.length;
            var flag=true;
            for (var i=0;i<length;i++){
                if(row.entity.id ==  $scope.rowsIDSelected[i]){
                    $scope.rowsSelected.splice(i,1);
                    $scope.rowsIDSelected.splice(i,1);
                    flag = false;
                }
            }
            if(flag == true){
                $scope.rowsSelected.push(row.entity);
                $scope.rowsIDSelected.push(row.entity.id)
            }
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.paginationOptions.page = newPage-1;
            $scope.paginationOptions.size = pageSize;
            $scope.gridApi.grid.selection.selectAll = false;
            $scope.getPagedProcesses();
        });

        $scope.getPagedProcesses();
    };

    $scope.$watch('gridApi.grid.rows[0].uid', function(newValue,oldValue) {
        // if (newValue === oldValue) { return; } // AKA first run
        for (var i=0;i< $scope.rowsIDSelected.length;i++){
            var id = $scope.rowsIDSelected[i];
            for(var j=0;j< $scope.gridApi.grid.rows.length;j++){
                if($scope.gridApi.grid.rows[j].entity.id == id){
                    $scope.gridApi.grid.rows[j].isSelected = true;
                }
            }
        }
    },true);

    $scope.$watch('gridApi.grid.selection.selectAll', function(newValue,oldValue) {
        if (newValue === oldValue) { return; } // AKA first run
        if (newValue === true){
            for (var i=0;i< $scope.gridApi.grid.rows.length;i++){
                var id = $scope.gridApi.grid.rows[i].entity.id;
                var flag = true;
                for(var j=0;j< $scope.rowsIDSelected.length;j++){
                    if($scope.rowsIDSelected[j] == id){
                        flag = false;
                    }
                }
                if(flag == true){
                    $scope.rowsSelected.push($scope.gridApi.grid.rows[i].entity);
                    $scope.rowsIDSelected.push(id);
                }
            }
        }
        if (newValue === false){
            for (var i=0;i< $scope.gridApi.grid.rows.length;i++){
                if($scope.gridApi.grid.rows[i].isSelected == false){
                    var id = $scope.gridApi.grid.rows[i].entity.id;
                    for(var j=0;j< $scope.rowsIDSelected.length;j++){
                        if($scope.rowsIDSelected[j] == id){
                            $scope.rowsSelected.splice(j,1);
                            $scope.rowsIDSelected.splice(j,1);
                            break;
                        }
                    }
                }
            }
        }
    },true);

    //条件查询流程
    $scope.filterChange=function(){
        $scope.paginationOptions.filter=$scope.filter;
        $scope.getPagedProcesses();
    };

    //搜索框的显示和隐藏
    $scope.search = function(){
        $("#searchBox").toggle();
    };
    //新增
    $scope.addNew=function(){
        $scope.edit({id:UUID.generate()},true);
    };
    //编辑
    $scope.edit=function (message,addNew) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop:'static',
            keyboard:false,
            templateUrl: 'views/modal/messageModal.html',
            controller: 'messageModalCtrl',
            size: 'md',
            resolve: {
                addNew:function(){
                    return addNew;
                },
                message: function () {
                    return message;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if(result){
                MessageBox.alert("保存成功！");
                $scope.getPagedProcesses();
            }
            else {
                MessageBox.alert("保存失败！");
            }
        });
    };
    //阅读
    $scope.read=function(message){
        $http.post("messageController/readMessage.do",message).success(function(data){
            if(data){
                MessageBox.alert("<div><b>发送人：</b>"+message.sendUserName+"</div><div><b>消息内容：</b>"+message.messageContent
                    +"</div><b>发送时间：</b>"+$filter('date')(message.createTime,'yyyy-MM-dd HH:mm:ss'));
            }
            else
                MessageBox.alert("阅读失败！");
            $scope.getPagedProcesses();
            $scope.$parent.$$childHead.findUnreadMessage();
            $scope.$parent.$$childHead.findAllMessages();
        });
    };
    //删除一个消息
    $scope.delete=function(message){
        MessageBox.confirm("确定要删除吗?").then(function(){
            $http.post("messageController/deleteOneMessage.do",message).success(function(data){
                if(data)
                    MessageBox.alert("删除成功！");
                else
                    MessageBox.alert("删除失败！");
                $scope.getPagedProcesses();
                $scope.$parent.$$childHead.findUnreadMessage();
                $scope.$parent.$$childHead.findAllMessages();
            });
        });
    };

    //批量删除
    $scope.deleteSelected=function(){
        var messages=$scope.gridApi.selection.getSelectedRows();
        if(messages.length>0) {
            MessageBox.confirm("确定要删除吗?").then(function() {
                $http.post("messageController/deleteMessages.do",messages).success(function(data) {
                    if (data) {
                        MessageBox.alert("批量删除成功！");
                        $scope.getPagedProcesses();
                        $scope.$parent.$$childHead.findUnreadMessage();
                        $scope.$parent.$$childHead.findAllMessages();
                    }
                    else {
                        MessageBox.alert("批量删除失败！");
                    }
                });
            });
        }
        else {
            MessageBox.alert("请选择要删除的内容！");
        }
    };

    $scope.deleteAll = function () {
        MessageBox.confirm("确定要清空消息吗?").then(function() {
            $http.post("messageController/deleteAllMessages.do").success(function(data) {
                if (data) {
                    MessageBox.alert("清空消息成功！");
                    $scope.getPagedProcesses();
                    $scope.$parent.$$childHead.findUnreadMessage();
                    $scope.$parent.$$childHead.findAllMessages();
                }
                else {
                    MessageBox.alert("清空消息失败！");
                }
            });
        });
    }
});

//编辑窗口控制器
app.controller('messageModalCtrl', function ($scope, $uibModalInstance,$http, message,addNew,MessageBox) {

    $scope.message = message;

    //需要绑定的$scope.modernBrowsers
    //需要绑定的modal
    $scope.text = function(){
        $http.post("messageController/getUsers.do", null).success(function(data){
            $scope.modernBrowsers = data;
        });
    };
    $scope.text();

    $scope.ok = function () {
        var idList = "";
        for(var i=0; i<$scope.outputBrowsers.length;i++){
            idList += $scope.outputBrowsers[i].id+",";
        }
        $http.post("messageController/saveMessage.do?flag="+addNew+"&&idList="+idList,$scope.message).success(function(data){
            if(data){
                $uibModalInstance.close(true);
            }
            else
            {
                MessageBox.alert("保存失败！");
            }
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.roleOptions = {
        columnDefs: [
            {field: 'id', displayName: 'Id',visible:false},
            {field: 'name', displayName: '名称'},
            {field: 'sortIndex', displayName: '排序',visible:false}
        ],
        data:$scope.roles
    };
    //注册gridApi
    $scope.roleOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
    };
});

//用户列表控制器
app.controller('messageUserListCtrl', function ($scope, $uibModalInstance,$http,MessageBox) {
    function FileStyle($scope) {
        $scope.treedata=[
            {label: "Documents", type: "folder", children: [
                {label: "a picture", type: "pic"},
                {label: "another picture", type: "pic"},
                {label: "a doc", type: "doc"},
                {label: "a file", type: "file"},
                {label: "a movie", type: "movie"}
            ]},
            {label: "My Computer", type: "folder", children: [
                {label: "email", type: "email"},
                {label: "home", type: "home"}
            ]},
            {label: "trash", type: "trash"}
        ];
        $scope.showSelected = function(sel) {
            $scope.selectedNode = sel;
        };
    }
});