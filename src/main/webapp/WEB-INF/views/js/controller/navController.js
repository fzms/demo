var navApp=angular.module("navApp",[]);
navApp.controller("navController",function($scope){
	$scope.navList=[
		{
			"name":"学生信息","url":"a"
		},
		{
			"name":"学生成绩","url":"v"
		},
		{
			"name":"成就统计","url":"c"
		},
		{
			"name":"奖惩情况","url":"d"
		}
	];
});