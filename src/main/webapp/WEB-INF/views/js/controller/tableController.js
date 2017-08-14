var app = angular.module('myApp', ['ui.grid', 'ui.grid.selection', 'ui.grid.edit',
    'ui.grid.exporter', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize']);

app.controller('MyCtrl', function ($scope, i18nService, $http) {
    // 国际化；
    i18nService.setCurrentLang("zh-cn");


    $scope.size=10; //cxs 每页的默认条数

    $scope.params = {"pageNum":1,"pageSize":$scope.size}; //分页需要传进去的值

    $scope.findAll = function () {
        $http.get("/stu/info/query",$scope).success(function (data) {
            $scope.mydefalutData = data.data;
            console.log($scope.mydefalutData);
            getPage($scope.params.pageNum, $scope.gridOptions.paginationPageSize);

            // $scope.getPagedRoundSortIndexes();
        }).error(function (data) {
            console.log("查询失败");
        });
    };

    // $http.get(URL,{params: {"id":id}}).success(function(response, status, headers, config){})

    $scope.findAll();
    console.log($scope.mydefalutData);

    $scope.gridOptions = {
        data: $scope.mydefalutData,
        columnDefs: [{
            field: 'stuId',
            displayName: '学号',
            width: '15%',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: false,
            suppressRemoveSort: true,
            enableCellEdit: false // 是否可编辑
        },
            {field: "name", displayName: '名字', enableCellEdit: false},
            {field: "sex", displayName: '性别', enableCellEdit: false},
            {field: "address", displayName: '地址', enableCellEdit: false},
            {field: "phone", displayName: '电话', enableCellEdit: false},
            {
                field: 'edit',
                displayName: '操 作',
                width: '150',
                enableCellEdit: false,
                fixed: true,
                pinnedRight: false,
                enableColumnMenu: false,
                enableSorting: false,
                cellTemplate: '<div class="ui-grid-cell-contents text-center"><button type="button" class="btn blue-madison btn-xs" ng-click="grid.appScope.edit(row.entity)" ><i class="fa fa-edit"></i><span style="padding-left: 2px;">编辑</span></button>&nbsp;<button type="button" class="btn blue-madison btn-xs" ng-click="grid.appScope.delete(row.entity)" ><i class="fa fa-remove"></i><span style="padding-left: 2px;">删除</span></button></div> '
            }
        ],


        showGroupPanel: true,
        paginationPageSizes: [1, 2, 3],
        paginationPageSize: $scope.size,
        //使用服务端分页
        useExternalPagination: true,//是否使用分页按钮
        useExternalSorting: true,  //是否使用自定义排序规则
        enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar: 1,   //grid垂直滚动条是否显示, 0-不显示  1-显示
        exporterOlderExcelCompatibility: true,
        enableFullRowSelection: true,
        enableSelectAll: false,
        multiSelect: false,


        //----------- 选中 ----------------------
        enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
        enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
        enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
        enableRowSelection: false, // 行选择是否可用，默认为true;
        enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
        enableSelectionBatchEvent: true, //默认true
        isRowSelectable: function (row) { //GridRow
            if (row.entity.age > 45) {
                row.grid.api.selection.selectRow(row.entity); // 选中行
            }
        },
        modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
        multiSelect: true,// 是否可以选择多个,默认为true;
        noUnselect: false,//默认false,选中后是否可以取消选中
        selectionRowHeaderWidth: 30,//默认30 ，设置选择列的宽度；

        //--------------导出----------------------------------
        exporterAllDataFn: function () {
            return getPage(1, $scope.gridOptions.totalItems);
        },
        exporterCsvColumnSeparator: ',',
        exporterCsvFilename: 'download.csv',
        exporterHeaderFilterUseName: true,
        exporterMenuCsv: true,
        exporterMenuLabel: "Export",
        exporterMenuPdf: true,
        exporterOlderExcelCompatibility: false,
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.footerStyle = {bold: true, fontSize: 10};
            return docDefinition;
        },
        exporterPdfFooter: {
            text: 'My footer',
            style: 'footerStyle'
        },
        exporterPdfDefaultStyle: {
            fontSize: 11, font: 'simblack' //font 设置自定义字体
        },
        exporterPdfFilename: 'download.pdf',

        exporterPdfFooter: function (currentPage, pageCount) {
            return currentPage.toString() + ' of ' + pageCount;
        },
        exporterPdfHeader: function (currentPage, pageCount) {
            return currentPage.toString() + ' of ' + pageCount;
        },
        exporterPdfMaxGridWidth: 720,
        exporterPdfOrientation: 'landscape',//  'landscape' 或 'portrait' pdf横向或纵向
        exporterPdfPageSize: 'A4',// 'A4' or 'LETTER'
        exporterPdfTableHeaderStyle: {
            bold: true,
            fontSize: 12,
            color: 'black'
        },
        exporterPdfTableLayout: null,
        exporterPdfTableStyle: {
            margin: [0, 5, 0, 15]
        },
        exporterSuppressColumns: ['buttons'],
        exporterSuppressMenu: false,

        //---------------api---------------------
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //分页按钮事件
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                if (getPage) {
                    getPage(newPage, pageSize);
                }
            });
            //行选中事件
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                if (row) {
                    $scope.testRow = row.entity;
                }
            });
        }
    };


    var getPage = function (curPage, pageSize) {
        var firstRow = (curPage - 1) * pageSize;
        $scope.gridOptions.totalItems = $scope.mydefalutData.length;
        $scope.gridOptions.data = $scope.mydefalutData.slice(firstRow, firstRow + pageSize);
        //或者像下面这种写法
        //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
    };

    //分页
    $scope.size = 15;
    $scope.paginationOptions = {
        filter: '',
        page: 0,
        size: $scope.size,
        sorts: [{field: "stuId", direction: "asc"}, {field: "name", direction: "asc"}]
    };
    $scope.getPagedRoundSortIndexes = function () {
        $http.get('/stu/info/query', $scope.paginationOptions).success(function (page) {
            $scope.gridOptions.totalItems = page.totalElements;
            $scope.roundSortIndexes = page.content;
            $scope.gridOptions.data = page.content;
            console.log($scope.gridOptions.totalItems);
        });
    };
});
angular.bootstrap(document.getElementById("tableBox"), ['myApp']);