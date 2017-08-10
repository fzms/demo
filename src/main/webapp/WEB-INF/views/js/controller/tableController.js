        var app = angular.module('myApp', ['ui.grid','ui.grid.selection','ui.grid.edit',
            'ui.grid.exporter','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.autoResize']);
        
        app.controller('MyCtrl', function($scope,i18nService,$http) {
            // 国际化；
            i18nService.setCurrentLang("zh-cn");

            $scope.findAll = function(){
                $http.get(" /stu/info/query").success(function (data) {
                    $scope.mydefalutData = data.data;
                    console.log( $scope.mydefalutData);
                    getPage(1, $scope.gridOptions.paginationPageSize);
                }).error(function(data){
                    console.log("查询失败");
                });
            };
            $scope.findAll();
            console.log($scope.mydefalutData);

            $scope.gridOptions = {
                data:$scope.mydefalutData,
                columnDefs: [{ field: 'stuId',
                                 displayName: '学号',
                                 width: '15%',
                                 enableColumnMenu: false,// 是否显示列头部菜单按钮
                                 enableHiding: false,
                                 suppressRemoveSort: true,
                                 enableCellEdit: false // 是否可编辑
                             },
                             { field: "name",displayName: '名字',enableCellEdit: false},
                             { field: "sex",displayName: '性别',enableCellEdit: false},
                             { field: "address",displayName: '地址',enableCellEdit: false},
                             { field: "phone",displayName: '电话',enableCellEdit: false},
                             { field: 'edit', displayName: '操 作',width:'150',enableCellEdit: false,fixed:true,pinnedRight:false,enableColumnMenu:false,enableSorting:false,
                                  cellTemplate: '<div class="ui-grid-cell-contents text-center"><button type="button" class="btn blue-madison btn-xs" ng-click="grid.appScope.edit(row.entity)" ><i class="fa fa-edit"></i><span style="padding-left: 2px;">编辑</span></button>&nbsp;<button type="button" class="btn blue-madison btn-xs" ng-click="grid.appScope.delete(row.entity)" ><i class="fa fa-remove"></i><span style="padding-left: 2px;">删除</span></button></div> '}
                            ],

                enableSorting: true, //是否排序
                useExternalSorting: false, //是否使用自定义排序规则
                enableGridMenu: true, //是否显示grid 菜单
                showGridFooter: true, //是否显示grid footer
                enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
                enableVerticalScrollbar : 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

                //-------- 分页属性 ----------------
                enablePagination: true, //是否分页，默认为true
                enablePaginationControls: true, //使用默认的底部分页
                paginationPageSizes: [10, 15, 20], //每页显示个数可选项
                paginationCurrentPage:1, //当前页码
                paginationPageSize: 10, //每页显示个数
                //paginationTemplate:"<div></div>", //自定义底部分页代码
                totalItems : 0, // 总数量
                useExternalPagination: true,//是否使用分页按钮


                //----------- 选中 ----------------------
                enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
                enableFullRowSelection : true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
                enableRowSelection : false, // 行选择是否可用，默认为true;
                enableSelectAll : true, // 选择所有checkbox是否可用，默认为true;
                enableSelectionBatchEvent : true, //默认true
                   isRowSelectable: function(row){ //GridRow
                   if(row.entity.age > 45){
                       row.grid.api.selection.selectRow(row.entity); // 选中行
                   }
                },
                modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                multiSelect: true ,// 是否可以选择多个,默认为true;
                noUnselect: false,//默认false,选中后是否可以取消选中
                selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；

                //--------------导出----------------------------------
                exporterAllDataFn: function(){
                       return getPage(1,$scope.gridOptions.totalItems);
                },
                exporterCsvColumnSeparator: ',',
                exporterCsvFilename:'download.csv',
                // exporterFieldCallback : function ( grid, row, col, value ){
                //  if ( value == 50 ){
                //    value = "可以退休";
                //  }
                //  return value;
                // },
                // exporterHeaderFilter :function( displayName ){
                //    return 'col: ' + name;
                // },
                exporterHeaderFilterUseName : true,
                exporterMenuCsv : true,
                exporterMenuLabel : "Export",
                exporterMenuPdf : true,
                exporterOlderExcelCompatibility : false,
                exporterPdfCustomFormatter : function ( docDefinition ) {
                 docDefinition.styles.footerStyle = { bold: true, fontSize: 10 };
                 return docDefinition;
                },
                exporterPdfFooter :{
                                     text: 'My footer',
                                     style: 'footerStyle'
                                   },
                exporterPdfDefaultStyle : {
                  fontSize: 11,font:'simblack' //font 设置自定义字体
                },
                exporterPdfFilename:'download.pdf',
                /* exporterPdfFooter : {
                 columns: [
                   'Left part',
                   { text: 'Right part', alignment: 'right' }
                 ]
                },
                或 */
                exporterPdfFooter: function(currentPage, pageCount) {
                       return currentPage.toString() + ' of ' + pageCount;
                },
                exporterPdfHeader : function(currentPage, pageCount) {
                   return currentPage.toString() + ' of ' + pageCount;
                },
                exporterPdfMaxGridWidth : 720,
                exporterPdfOrientation : 'landscape',//  'landscape' 或 'portrait' pdf横向或纵向
                exporterPdfPageSize : 'A4',// 'A4' or 'LETTER'
                exporterPdfTableHeaderStyle : {
                 bold: true,
                 fontSize: 12,
                 color: 'black'
                },
                exporterPdfTableLayout : null,
                exporterPdfTableStyle: {
                 margin: [0, 5, 0, 15]
                },
                exporterSuppressColumns : ['buttons'],
                exporterSuppressMenu: false,

                //---------------api---------------------
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    //分页按钮事件
                    gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                          if(getPage) {
                              getPage(newPage, pageSize);
                           }
                    });
                    //行选中事件
                    $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row,event){
                        if(row){
                            $scope.testRow = row.entity;
                        }
                     });
                }
            };

            var getPage = function(curPage, pageSize) {
                    var firstRow = (curPage - 1) * pageSize;
                    $scope.gridOptions.totalItems = $scope.mydefalutData.length;
                    $scope.gridOptions.data = $scope.mydefalutData.slice(firstRow, firstRow + pageSize);
                    //或者像下面这种写法
                    //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
            };

            // var mydefalutData = [{ stu_id:"31202210",name: "Moroni", sex: "男", birthday: "Oct 28, 1970", address: "莆田",phone:"13357536844" },
            //                 { stu_id:"31202210",name: "Tiancum", sex: "男", birthday: "Feb 12, 1985", address: "四川" ,phone:"13346567872"  },
            //                 { stu_id:"31202211",name: "Jacob", sex: "女", birthday: "Aug 23, 1983", address: "上海" ,phone:"17526853478"  },
            //                 { stu_id:"31202212",name: "Nephi", sex: "男", birthday: "May 31, 2010", address: "北京" ,phone:"17346854379"  },
            //                 { stu_id:"31202213",name: "Enos", sex: "女", birthday: "Aug 3, 2008",  address: "重庆" ,phone:"12537943689"  },
            //                 { stu_id:"31202214",name: "Moroni", sex: "男", birthday: "Oct 28, 1970", address: "厦门"  ,phone:"" },
            //                 { stu_id:"31202215",name: "Tiancum", sex: "男", birthday: "Feb 12, 1985", address: "深圳" ,phone:""  },
            //                 { stu_id:"31202216",name: "Jacob", sex: "女", birthday: "Aug 23, 1983", address: "广州"  ,phone:"" },
            //                 { stu_id:"31202217",name: "Nephi", sex: "男", birthday: "May 31, 2010", address: "日本" ,phone:""  },
            //                 { stu_id:"31202218",name: "Enos", sex: "男", birthday: "Aug 3, 2008", address: "杭州" ,phone:""  },
            //                 { stu_id:"31202219",name: "Moroni", sex: "女", birthday: "Oct 28, 1970", address: "" ,phone:""  },
            //                 { stu_id:"31202220",name: "Tiancum", sex: "男", birthday: "Feb 12, 1985", address: "杭州" ,phone:""  },
            //                 { stu_id:"31202221",name: "Jacob", sex: "男", birthday: "Aug 23, 1983", address: "杭州",phone:""   },
            //                 { stu_id:"31202222",name: "Nephi", sex: "女", birthday: "May 31, 2010", address: "",phone:""   },
            //                 { stu_id:"31202223",name: "Enos", sex: "男", birthday: "Aug 3, 2008", address: "杭州" ,phone:""  }];



        });
        angular.bootstrap(document.getElementById("tableBox"), ['myApp']);