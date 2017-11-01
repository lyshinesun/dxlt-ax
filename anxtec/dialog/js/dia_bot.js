new Vue({
    el: '#dia_bot',
    data: {
        stationId:vlm.parseUrlPara(location.href).stationId.toLowerCase(),
        fdDevCode:vlm.parseUrlPara(location.href).fdDevCode,
        resList:[],
        msg: 'msg',
        robotDtu: 0,
        port:0,
        devid:0,
        addr:0
    },
    methods: {
        /*获取url中的查询字符串的值*/
        getSearchString: function (key) {
          var str = location.search
          str = str.substring(1,str.length)
          var arr = str.split("&")
          var obj = new Object()
          for(var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=")
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1])
          }
            return obj[key]
        },
        getRbtParames: function () {
          this.port = Number(this.getSearchString('port')) 
          this.addr = Number(this.getSearchString('rbtDtu')) 
        },
        //获取厂房信息
        getDevrelation:function () {
            var _this = this;
            $.ajax({
                url:vlm.serverAddr+'devrelation/query',
                type:'get',
                dataType:'json',
                traditional: true,
                data:{
                    id:this.fdDevCode, //厂房列表传电站id 查机器人列表传fdDevCode
                    type:"1"   //1 查两层 不是1只查一层
                },
                success:function(res){
                    $('#preloader').hide();
                    if(res.code ==0){
                        _this.resList=res.page;
                        setTimeout(function(){
                            $('.bot_imte_head').off().click(function () {
                                $(this).find('.right_arr').toggleClass('down');
                                $(this).parents('.bot_item').find('.bot_imte_cont').stop().slideToggle();
                            });
                        },1000);
                    }
                },
                error:function(){},
            });
        },

        drawHumidity: function (pr) {
            option = {
                color: ['#5ce9fc', '#010810'],
                series: [
                    {
                        hoverAnimation: false,
                        type: 'pie',
                        radius: ['73%', '90%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: [
                            {
                                value: pr,
                                itemStyle: {
                                    normal: {
                                        color: "#5ce9fc"
                                    }
                                }
                            },
                            {
                                value: 100 - pr,
                                itemStyle: {
                                    normal: {
                                        color: "#010810"
                                    }
                                }
                            }
                        ],
                        clockWise: false  //是否顺时针
                    }
                ]
            };

            var prChart = echarts.init(document.getElementById('humidity'));
            prChart.setOption(option);

            $(window).resize(function () {
                prChart.resize();
            });
        },
        // 关闭机器人
        turnOff (e) {
            $(e.target).addClass('turn_off_down')
        },
        turnOffEnd(e,item) {
            $(e.target).removeClass('turn_off_down')
            var _this =this
            _this.devid = Number(item.fdDevAddr)
            $.ajax({
                url:vlm.serverAddr+'stationInfo/robot',
                type:'post',
                dataType:'json',
                traditional: true,
                data:{
                    devid: _this.devid, //机器人地址
                    type: 0, //1 操作码，0 停，1 启动 2 反转
                    port: _this.port,
                    addr: _this.addr
                },
                success:function(res){
                    // if (res.code === 0 ) {
                        console.log('停')
                    // }
                },
                error:function(){},
            })
        },
        // 启动机器人
        turnOn (e) {
            $(e.target).addClass('turn_on_down')
        },
        turnOnEnd (e,item) {
            $(e.target).removeClass('turn_on_down')
            var _this =this
            _this.devid = Number(item.fdDevAddr)
            $.ajax({
                url:vlm.serverAddr+'stationInfo/robot',
                type:'post',
                dataType:'json',
                traditional: true,
                data:{
                    devid: _this.devid, //机器人地址
                    type: 1,  //1 操作码，0 停，1 启动 2 反转
                    port: _this.port,
                    addr: _this.addr
                },
                success:function(res){
                    // if (res.code === 0 ) {
                        console.log('启')
                    // }
                },
                error:function(){},
            })
        },
        // 反转机器人
        turnOver: function (e) {
            $(e.target).addClass('turn_over_down')
        },
        turnOverEnd (e,item) {
            $(e.target).removeClass('turn_over_down')
            var _this =this
            _this.devid = Number(item.fdDevAddr)
            $.ajax({
                url:vlm.serverAddr+'stationInfo/robot',
                type:'post',
                dataType:'json',
                traditional: true,
                data:{
                    devid: _this.devid, //机器人地址
                    type: 2,  //1 操作码，0 停，1 启动 2 反转
                    port: _this.port,
                    addr: _this.addr
                },
                success:function(res){
                    // if (res.code === 0 ) {
                        console.log('反转')
                    // }
                },
                error:function(){},
            })
        }
    },
    mounted: function () {
        this.getDevrelation(); //获取机器人信息
        this.drawHumidity(80);
        this.getRbtParames()
    }

});
// $('#turn_on').on('touchstart',function(){
//     console.log("touchstart")
// })