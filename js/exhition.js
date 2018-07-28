//顶部折线图
var line=echarts.init(document.getElementById("line"));
    var option1 = {
    xAxis: {
        // type: 'category',
        data:['-','-','-','-','-','-','-','-','-','-',
              '-','-','-','-','-','-','-','-','-','-',
              '-','-','-','-','-','-','-','-','-','-',
                ],
        axisTick: {
                alignWithLabel: true
           },
        nameTextStyle:{
            color:'#fff',
            fontSize:14
        },
        axisLabel : {
            formatter: '{value}',
            textStyle: {
                color: '#fff',
                fontSize:14
            }
        },
        axisLine:{
            lineStyle:{
                color:'#21507B',
             }
        }
    },
    yAxis: {
        // type:'value',
        min:0,
        max:100,
        axisLabel : {
            textStyle: {
                color: '#fff',
                fontSize:14
            }
        },
		axisTick: {
                    show: false
                },
        axisLine:{
            lineStyle:{
                color:'#21507B',
             }
        },
        splitLine:{ //设置坐标轴在grid中的分割线的样式
            show:true,
            interval:2,
            lineStyle:{ //设置y轴线颜色和样式
                color:'#21507B',  
                type:'dotted'
            }
        }
    },
    series: [{
        name:'抄表率',
        data:[],
        type: 'line',
        lineStyle:{
            color:'#ccc'
        }
    }],
    grid:{
        top:'6%',
        bottom:'22%',
        left:'30%,',
        right:'0%'
    },
    tooltip: {
        formatter:'{a}<br/>{b}: {c}%'
    },
};
line.setOption(option1)
$(function(){
    //截止统计时间
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    if(month<10){
        month="0"+month;
    }
    if(day<10){
        day="0"+day;
    }
$("#newtime").html(year+"-"+month+"-"+day+" "+"00:00:00");

//顶部请求 抄表率数据

$.ajax({
    url:ajax_url+"/nbiot/display/v1/totalReadInfo",
    type:"get",
    async:false,
    data:{},
    dataType:"json",
    success:function(data){
        if(data){
            $("#company_count").html(data.data.companyCount);
            $("#deliver_count").html(data.data.deliverNumber);
            $("#sleep_count").html(data.data.sleepMeter);
            $("#open_count").html(data.data.openArchives);
            $("#real_count").html(data.data.realRead);
        }
    }
})
//顶部请求30日抄表率折线图数据
var xvalue=[];
var yvalue=[];
	$.ajax({
            url:ajax_url+"/nbiot/display/v1/thirtyDailyReadRate",
            async:false,
            type:"get",
            data:{},
            dataType:"json",
			success:function(data){
				if(data){
					for(var i=0;i<data.data.length;i++){
                        xvalue.unshift(data.data[i].readDate);
                        yvalue.unshift(data.data[i].readRate);
					}
                }
                line.setOption({
                    xAxis:{
                        data:xvalue
                    },
                    series:[{
                        data:yvalue
                    }]
                })
			}
        })
//初始化顶部扇形数据
var gauge=echarts.init(document.getElementById("gauge"));
        var option = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series : [
                {
                name:'业务指标',
                type:'gauge',
                startAngle: 180,
                endAngle: 0,
                min:0,
                max:100,
                center : ['50%', '95%'],    // 默认全局居中
                radius : 90,
                min:0, //最小刻度值
                max:100,
                splitNumber:1, //刻度线分段
                axisLine: { 
                    show:false,           // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width:20,
                        color:[[0.2, '#ff6c31'],[0.3, '#ff6c31'],[0.3, '#ffa332'],[0.5, '#ffa332'], [0.9, '#ffda33'],[1, '#fff232']]
                    } 
                },
                pointer:{ //不显示指针
                    show:false
                },
                axisTick: { 
                    show:false,           // 坐标轴小标记
                    splitNumber:0,   // 每份split细分多少段
                    length :0,        // 属性length控制线长
                },
               axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                   textStyle: { 
                       show:false,      // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                       color: '#fff',
                       fontSize: 0,
                        fontWeight: 'bolder'
                   }
               },
                detail : {
                    show : true,
                    borderWidth: 0,
                    width: 100,
                    height: 40,
                    color:'#ff6c31',
                    offsetCenter: [-5, -20],       // x, y，单位px
                    formatter:'{value}%',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize :20,
                        color: '#fff232'
                    }
                },
                data:[{value:yvalue[29]}]
            }
        ]
        };
gauge.setOption(option)
//抄表率TOP排名
$.ajax({
    url:ajax_url+"/nbiot/display/v1/topCompany/readRate",
    async:false,
    type:"get",
    dataType:"json",
    data:{},
    success:function(data){
        if(data){
            var cbltop=$("#cbltop").children();
            for(var i=0;i<data.data.length;i++){
                // cbltop.eq(i).children("ul").children("li").eq(1).html(data.data[i].companyName)
                cbltop.eq(i).find(".cbl_Top").html(data.data[i].companyName)

                // cbltop.eq(i).children("ul").children("li").eq(2).children("span").eq(0).html(data.data[i].value)
                cbltop.eq(i).find(".cbl_Value").html(data.data[i].value)
            }
            $('#cbl').liMarquee({
                direction: 'up',
                scrollamount: 10
            });
         }
    }
})
//定货总量TOP排名
$.ajax({
    url:ajax_url+"/nbiot/display/v1/topCompany/deliverNumber",
    async:false,
    type:"get",
    dataType:"json",
    data:{},
    success:function(data){
            var cbltop=$("#dhzltop").children();
            for(var i=0;i<data.data.length;i++){
                // cbltop.eq(i).children("ul").children("li").eq(1).html(data.data[i].companyName)
                cbltop.eq(i).find(".dhzl_Top").html(data.data[i].companyName)
                // cbltop.eq(i).children("ul").children("li").eq(2).children("span").eq(0).html(data.data[i].value)
                cbltop.eq(i).find(".dhzl_Value").html(data.data[i].value)
            }
            $('#fhl').liMarquee({
                direction: 'up',
                scrollamount: 10
            });
         }
    // }
})
//发货总量TOP排名
$.ajax({
    url:ajax_url+"/nbiot/display/v1/topCompany/openArchives",
    async:false,
    type:"get",
    dataType:"json",
    data:{},
    success:function(data){
        if(data){
            var cbltop=$("#fhzltop").children();
            for(var i=0;i<data.data.length;i++){
                // cbltop.eq(i).children("ul").children("li").eq(1).html(data.data[i].companyName)
                cbltop.eq(i).find(".fhzl_Top").html(data.data[i].companyName)
                
                // cbltop.eq(i).children("ul").children("li").eq(2).children("span").eq(0).html(data.data[i].value)
                cbltop.eq(i).find(".fhzl_Value").html(data.data[i].value)
            
            }
            $('#khl').liMarquee({
                direction: 'up',
                scrollamount: 10
            }); 
         }
    }
})
//集团客户名单
var code=[]; //所有集团公司的code字段
var jt_name=[]; //集团客户下公司名单
var jt_ycbscode=[]; //存放对应code字段公司的已抄表数量
var jt_wcbscode=[]; //存放对应code字段公司的未抄表数量
var jt_zkhscode=[]; //存放对应code字段公司的总开户数量
var jt_xmbzcode=[]; //存放对应code字段公司的休眠表数量
var jt_zfhlcode=[];  //存放对应code字段公司的总发货数量
var jt_thirtycbl=[]; //存放对应code字段公司的30日抄表率
// var jt_cblxvalue=[]; //存放对应code字段公司的30日抄表率x轴数据
// var jt_cbldatavalue=[]; //存放对应code字段公司的30日抄表率series数据
$.ajax({
    url:ajax_url+"/nbiot/display/v1/companyList/1",
    type:"get",
    async:false,
    dataType:"json",
    data:{},
    success:function(data){
        // console.log(data);
        if(data){
            // var jdkh_acount=$("#jtkh").children();
            for(var i=0;i<data.data.length;i++){
								code[i]=data.data[i].code;
								jt_name[i]=data.data[i].name;
                $(".f_dz_m_n_u").append("<li class='f_dz_m_n_li jt_name'><ul class='u'><li class='f_dz_m_n_u_li'><a href='javascript:;' class='jt_list'><span class='f_dz_m_n_u_li_f1'>"+data.data[i].name+"</span></a></li><li class='f_dz_m_n_u_li02'><span class='f_dz_m_n_u_li02_f'>"+'昨日抄表率'+"</span><span class='f_dz_m_n_u_li02_f02'></span></li></ul></li>")
            }
         }
    }
});
//集团客户详情
for(var i=0;i<code.length;i++){
$.ajax({
    url:ajax_url+"/nbiot/display/v1/companyInfo/"+code[i],
    type:"get",
    async:false,
    dataType:"json",
    data:{},
    success:function(data){
        if(data){
            $("#jtkh").children().eq(i).children("ul").children("li:last-child").children("span:last-child").html(data.data.readRateList[0].readRate+"%")
            jt_ycbscode[i]=data.data.realRead;
			jt_wcbscode[i] = parseInt(data.data.shouldRead)- parseInt(data.data.realRead);
            jt_zkhscode[i]=data.data.openArchives;
            jt_xmbzcode[i]=data.data.sleepMeter;
            jt_zfhlcode[i]=data.data.deliverNumber;
            jt_thirtycbl[i]=data.data.readRateList;
        }
     }
    });
}
//初始化集团客户名单NB表数据
$("#ycbs").html(jt_ycbscode[0]);
$("#zkhs").html(jt_zkhscode[0]);
$("#xmbs").html(jt_xmbzcode[0]);
//省会客户名单
var shcode=[]; //存放省会客户code
var sh_name=[]; //省会客户下公司名单
$.ajax({
    url:ajax_url+"/nbiot/display/v1/companyList/2",
    type:"get",
    async:false,
    dataType:"json",
    data:{},
    success:function(data){
        // console.log(data);
        if(data){
            for(var i=0;i<data.data.length;i++){
                shcode[i]=data.data[i].code;
                sh_name=data.data[i].name;
                $(".f_dz_m_n_u02").append("<li class='f_dz_m_n_li sh_name'><ul class='u'><li class='f_dz_m_n_u_li'><a href='javascript:;' class='jt_list'><span class='f_dz_m_n_u_li_f1'>"+data.data[i].name+"</span></a></li><li class='f_dz_m_n_u_li02'><span class='f_dz_m_n_u_li02_f'>"+'昨日抄表率'+"</span><span class='f_dz_m_n_u_li02_f02'></span></li></ul></li>")

            }
         }
    }
});
//省会公司详情
var sh_ycbscode=[]; //存放对应code字段公司的已抄表数量
var sh_wcbscode=[]; //存放对应code字段公司的未抄表数量
var sh_zkhscode=[]; //存放对应code字段公司的总开户数量
var sh_xmbzcode=[]; //存放对应code字段公司的休眠表数量
var sh_zfhlcode=[];  //存放对应code字段公司的总发货数量
var sh_thirtycbl=[]; //存放对应code字段公司的30日抄表率
// var sh_cblxvalue=[]; //存放对应code字段公司的30日抄表率x轴数据
// var sh_cbldatavalue=[]; //存放对应code字段公司的30日抄表率series数据
for(var i=0;i<shcode.length;i++){
    $.ajax({
        url:ajax_url+"/nbiot/display/v1/companyInfo/"+shcode[i],
        type:"get",
        async:false,
        dataType:"json",
        data:{},
        success:function(data){
            if(data){
                $("#shkh").children().eq(i).children("ul").children("li:last-child").children("span:last-child").html(data.data.readRateList[0].readRate+"%")
                sh_ycbscode[i]=data.data.realRead;
				sh_wcbscode[i]=parseInt(data.data.shouldRead) - parseInt(data.data.realRead);
                sh_zkhscode[i]=data.data.openArchives;
                sh_xmbzcode[i]=data.data.sleepMeter;
                sh_zfhlcode[i]=data.data.deliverNumber;
                sh_thirtycbl[i]=data.data.readRateList;
            }
         }
        });
    }
//初始化底部圆环
var jtkh_pie_legend=jt_thirtycbl[0][0].readRate;
var jtkh_pie_ycbs=jt_ycbscode[0];
var jkkh_pir_wcbs=jt_wcbscode[0];
var jtkh_pie_zkhs=jt_zkhscode[0];

var yuanhuan=echarts.init(document.getElementById("f_dn_d_left"));
var option2 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic:{  //定义圆环副标题文本样式
        type:'text',
        left:'27%',
        top:'30%',
        style:{
            // text:jtkh_pie_legend+'\n抄表率',
            text:'100'+'\n抄表率',
            textAlign:'center',
            fill:'#fff',
            width:30,
            height:30,
            font: '1em "STHeiti"'
        }
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['70%', '100%'],
            avoidLabelOverlap: false,
            silent:true,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '14',
                        color:'#ccc'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            center:['30%','50%'],
            data:[
                {value:jtkh_pie_ycbs, name:'已抄表数量',itemStyle:{color:"#7ae45d"}},
                {value:jkkh_pir_wcbs, name:'未抄表数量',itemStyle:{color:"#08f8d3"}},
            ]
        }
    ]
};
yuanhuan.setOption(option2);

//初始化底部折线图
var jtkh_piex_xAxis=[]; //x轴
var jtkh_piex_series=[]; //data数据
for(var i=0;i<jt_thirtycbl[0].length;i++){
    jtkh_piex_xAxis.unshift(jt_thirtycbl[0][i].readDate);
    jtkh_piex_series.unshift(jt_thirtycbl[0][i].readRate);
}
var piex=echarts.init(document.getElementById("piex"));
var zhexian_option= {
    xAxis: {
        data:jtkh_piex_xAxis,
        axisTick: {
                alignWithLabel: true
           },
        axisLabel : {
            formatter: '{value}',
            textStyle: {
                color: '#fff',
                fontSize:12
            }
        },
        axisLine:{
            lineStyle:{
                color:'#21507B',
             }
        }
    },
    yAxis: {
        type:"value",
        axisLabel : {
            formatter: '{value}',
            textStyle: {
                color: '#fff',
                fontSize:12
            }
        },
		axisTick: {
                    show: false
                },
        axisLine:{
            lineStyle:{
                color:'#21507B',
             }
        },
        splitLine:{ //设置坐标轴在grid中的分割线的样式
            show:true,
            interval:2,
            lineStyle:{ //设置y轴线颜色和样式
			    color:'#21507B',
                type:'dotted'
            }
        }
    },
    series: [{
        name:'抄表率',
        data:jtkh_piex_series,
        type: 'line',
        lineStyle:{
            color:'#ccc'
        }
    }],
    grid:{
        top:'8%',
        bottom:'32%',
        right:'0%',
        left:'5%'
    },
};
piex.setOption(zhexian_option);
//echarts图表随窗口变化
    window.onresize=function(){
        piex.resize(zhexian_option);
        yuanhuan.resize(option2);
    }  
    $(window).on("load",function(){
        // 初始化集团客户滚动条
        $("#jt_scroll").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"rounded"
        });
        // 初始化省会客户滚动条
        $("#sh_scroll").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"rounded"
        });
        // 初始化集团客户样式
       $("#jt_click").children("a").addClass("back_change");
       $("#jtkh").children("li:first").find("a").children("span").addClass("font_Color");
       $("#shkh").children("li:first").find("a").children("span").addClass("font_Color");
    })
    // 集团客户点击事件
    $("#jt_click").on("click", function ()  {
        $(this).children("a").addClass("back_change");
        $("#jt_scroll").css({display:"block"});
        $("#sh_click").children("a").removeClass("back_change");
        $("#sh_scroll").css({display:"none"});
    })
    // 省会客户点击事件
    $("#sh_click").on("click", function ()  {
        $(this).children("a").addClass("back_change");
        $("#sh_scroll").css({display:"block"});
        $("#jt_click").children("a").removeClass("back_change");
        $("#jt_scroll").css({display:"none"});
    }) 
    // 集团客户下公司详情点击事件
    $(".jt_name").on('click', function () {
        // var hastyle=$(this).chidren("li").hasClass("font_Color");
        // console.log(hastyle);
        // console.log("hell");
        var fontColor=$(this).find("a").children("span").hasClass("font_Color");
        if(!fontColor){
            $(this).find("a").children("span").addClass("font_Color");
            $(this).siblings().find("a").children("span").removeClass("font_Color");;
        }
        var i=$(this).index();
         //集团客户-公司向上滚动-右侧echart图表重新渲染
         $("#ycbs").html(jt_ycbscode[i]); //动态渲染集团客户-对应公司相关数据
         $("#zkhs").html(jt_zkhscode[i]);
         $("#xmbs").html(jt_xmbzcode[i]);
         $("#zfhl").html(jt_zfhlcode[i]);
         var jtkh_pie_legend_f=jt_thirtycbl[i][0].readRate;
         var jtkh_pie_ycbs_f=jt_ycbscode[i];
          var jtkh_pie_wcbs_f=jt_wcbscode[i];
         var jtkh_pie_zkhs_f=jt_zkhscode[i];
         //清空原echarts图表数据
         yuanhuan.clear();
         //重新渲染echarts图表
         yuanhuan.setOption({
             tooltip: {
                 trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)"
             },
             graphic:{  //定义圆环副标题文本样式
                 type:'text',
                 left:'27%',
                 top:'30%',
                 style:{
                     text:jtkh_pie_legend_f+'\n抄表率',
                     textAlign:'center',
                     fill:'#fff',
                     width:30,
                     height:30,
                     font: '1em "STHeiti"'
                 }
             },
             series: [
                 {
                     name:'',
                     type:'pie',
                     radius: ['70%', '100%'],
                     avoidLabelOverlap: false,
                     silent:true,
                     label: {
                         normal: {
                             show: false,
                             position: 'center'
                         },
                         emphasis: {
                             show: true,
                             textStyle: {
                                 fontSize: '14',
                                 // fontWeight: 'bold',
                                 color:'#ccc'
                             }
                         }
                     },
                     labelLine: {
                         normal: {
                             show: false
                         }
                     },
                     center:['30%','50%'],
                     data:[
                         {value:jtkh_pie_ycbs_f, name:'已抄表数量',itemStyle:{color:"#7ae45d"}},
                         {value:jtkh_pie_wcbs_f, name:'未抄表数量',itemStyle:{color:"#08f8d3"}},
                     ]
                 }
             ]
         });
         var jtkh_piex_xAxis_f=[]; //x轴
         var jtkh_piex_series_f=[]; //data数据
         for(var x=0;x<jt_thirtycbl[0].length;x++){
             jtkh_piex_xAxis_f.unshift(jt_thirtycbl[i][x].readDate);
             jtkh_piex_series_f.unshift(jt_thirtycbl[i][x].readRate);
         }
        //  console.log()
         //清空echarts折线图表数据
         piex.clear();
         piex.setOption({
             xAxis: {
                 data:jtkh_piex_xAxis_f,
                 axisTick: {
                         alignWithLabel: true
                    },
                 axisLabel : {
                     formatter: '{value}',
                     textStyle: {
                         color: '#fff',
                         fontSize:12
                     }
                 },
                 axisLine:{
                     lineStyle:{
                        color:'#21507B',
                      }
                 }
             },
             yAxis: {
                 type:"value",
                 axisLabel : {
                     formatter: '{value}',
                     textStyle: {
                         color: '#fff',
                         fontSize:12
                     }
                 },
                 axisLine:{
                     lineStyle:{
                        color:'#21507B',
                      }
                 },
                 splitLine:{ //设置坐标轴在grid中的分割线的样式
                     show:true,
                     interval:2,
                     lineStyle:{ //设置y轴线颜色和样式
                         color:'#21507B',
                         // type:'dashed',
                         type:'dotted'
                     }
                 }
             },
             series: [{
                 data:jtkh_piex_series_f,
                 type: 'line',
                 lineStyle:{
                     color:'#ccc'
                 }
             }],
             grid:{
                 top:'8%',
                 bottom:'32%',
                 right:'0%',
                 left:'5%'
             }
         })
    })  
    // 省会客户下公司详情点击事件
    $(".sh_name").on('click', function () {
        // var hastyle=$(this).chidren("li").hasClass("font_Color");
        // console.log(hastyle);
        // console.log("hell");
        var fontColor=$(this).find("a").children("span").hasClass("font_Color");
        if(!fontColor){
            $(this).find("a").children("span").addClass("font_Color");
            $(this).siblings().find("a").children("span").removeClass("font_Color");;
        }
        var i=$(this).index();
         //集团客户-公司向上滚动-右侧echart图表重新渲染
         $("#ycbs").html(sh_ycbscode[i]); //动态渲染集团客户-对应公司相关数据
         $("#zkhs").html(sh_zkhscode[i]);
         $("#xmbs").html(sh_xmbzcode[i]);
         $("#zfhl").html(sh_zfhlcode[i]);
         var shkh_pie_legend_f=sh_thirtycbl[i][0].readRate;
         var shkh_pie_ycbs_f=sh_ycbscode[i];
         var shkh_pie_wcbs_f=sh_wcbscode[i];
         var shkh_pie_zkhs_f=sh_zkhscode[i];
         //清空原echarts图表数据
         yuanhuan.clear();
         //重新渲染echarts图表
         yuanhuan.setOption({
             tooltip: {
                 trigger: 'item',
                 formatter: "{a} <br/>{b}: {c} ({d}%)"
             },
             graphic:{  //定义圆环副标题文本样式
                 type:'text',
                 left:'27%',
                 top:'30%',
                 style:{
                     text:shkh_pie_legend_f+'\n抄表率',
                     textAlign:'center',
                     fill:'#fff',
                     width:30,
                     height:30,
                     font: '1em "STHeiti"'
                 }
             },
             series: [
                 {
                     name:'',
                     type:'pie',
                     radius: ['70%', '100%'],
                     avoidLabelOverlap: false,
                     silent:true,
                     label: {
                         normal: {
                             show: false,
                             position: 'center'
                         },
                         emphasis: {
                             show: true,
                             textStyle: {
                                 fontSize: '14',
                                 // fontWeight: 'bold',
                                 color:'#ccc'
                             }
                         }
                     },
                     labelLine: {
                         normal: {
                             show: false
                         }
                     },
                     center:['30%','50%'],
                     data:[
                         {value:shkh_pie_ycbs_f, name:'已抄表数量',itemStyle:{color:"#7ae45d"}},
                         {value:shkh_pie_wcbs_f, name:'未抄表数量',itemStyle:{color:"#08f8d3"}},
                     ]
                 }
             ]
         });
         var shkh_piex_xAxis_f=[]; //x轴
         var shkh_piex_series_f=[]; //data数据
         for(var x=0;x<sh_thirtycbl[0].length;x++){
             shkh_piex_xAxis_f.unshift(sh_thirtycbl[i][x].readDate);
             shkh_piex_series_f.unshift(sh_thirtycbl[i][x].readRate);
         }
         // console.log()
         //清空echarts折线图表数据
         piex.clear();
         piex.setOption({
             xAxis: {
                 data:shkh_piex_xAxis_f,
                 axisTick: {
                         alignWithLabel: true
                    },
                 axisLabel : {
                     formatter: '{value}',
                     textStyle: {
                         color: '#fff',
                         fontSize:12
                     }
                 },
                 axisLine:{
                     lineStyle:{
                        color:'#21507B',
                      }
                 }
             },
             yAxis: {
                 type:"value",
                 axisLabel : {
                     formatter: '{value}',
                     textStyle: {
                         color: '#fff',
                         fontSize:12
                     }
                 },
                 axisLine:{
                     lineStyle:{
                        color:'#21507B',
                      }
                 },
                 splitLine:{ //设置坐标轴在grid中的分割线的样式
                     show:true,
                     interval:2,
                     lineStyle:{ //设置y轴线颜色和样式
                         color:'#21507B',
                         // type:'dashed',
                         type:'dotted'
                     }
                 }
             },
             series: [{
                 data:shkh_piex_series_f,
                 type: 'line',
                 lineStyle:{
                     color:'#ccc'
                 }
             }],
             grid:{
                 top:'8%',
                 bottom:'32%',
                 right:'0%',
                 left:'5%'
             }
         })
    })
});

