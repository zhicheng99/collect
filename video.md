# video标签 自动播放问题

#### 需求一 点击项目实现全屏自动播放

#### 需求二 播放过程中 播放器界面右侧设置关闭按钮

最初使用的是vue-video-player组件  在android平台使用都没有问题 但是ios端微信即不能自动播放 关闭按钮也会被播放器覆盖（经过测试是因为ios端微信直接劫持的video标签 渲染层级是最高的）

经过进一步测试发现vue-video-player渲染生成video标签中x5-playsinline="false"标签会导致微信流览器视频一直是最高层级 无法向其覆盖元素 去掉该属性 即可实现需求二

在ios平台微信 自动播放autoplay是被忽略的 必须得有实际的交互操作才可触发播放
jssdk方式可以实现  不过也不算完全解决  首次可以自动播放 当再次点同一个视频时 就不起作用了
最终发现在可以用WeixinJSBridgeReady方式实现

android版飞书 低版本不能自动播放  升级高版本即可
ios飞书和ios微信类似 区别是需要引入飞书js-sdk 才可以实现 地址：https://s0.pstatp.com/ee/lark/js_sdk/h5-js-sdk-1.4.5.js

至于safari下不能自动播放的情况  暂时没有解决方案

附代码

```
<template>
	<div class="player box box-align-center" id="player" >
	  
		 
		 

		<video v-if="url" @click="fsPlay"
			 ref="videoPlayer"
		:id="id"
		x5-video-player-fullscreen="true" 
		x5-video-player-type="h5" 
		preload="auto"
		autoplay="autoplay"  
		:poster="cover"
		style="position: absolute;left: 0;top:0; width: 100%;height:100%;object-fit: cover;"
		webkit-playsinline playsinline :src="url">
		</video>

	</div>

</template>

<script> 

	export default{
		components:{
			// VideoPlayer
		},
		props:['videoUrl','videoId','videoCover','callBack'],
		data(){
			return {
				url:'',
				cover:'',
				id:'', 

			}
		},
		methods:{
			fsPlay:function(){
				document.getElementById(this.id).load();
				document.getElementById(this.id).play();
			},
			stop:function(){
				console.log('stop');
				this.$refs.videoPlayer.player && this.$refs.videoPlayer.player.pause();
			},
			isWeixin:function(){

				let ua = navigator.userAgent.toLocaleLowerCase();
			     console.log(ua);
			      // x5内核
			      if (ua.match(/iphone/) != null && 
			      	(ua.match(/micromessenger/) != null)) {

			      		return true

			      	}else{

			      		return false;
			      	}

			},
			weixinPlay:function(fn) {
			    if (!this.isWeixin()) {    // 非微信中直接执行，支不支持就交给浏览器本身了
			        fn();
			    } else {
			        if (window.WeixinJSBridge) {
			            WeixinJSBridge.invoke("getNetworkType", {}, fn);   // 这句话是在微信中可以自动播放的核心
			        } else {
			            document.addEventListener("WeixinJSBridgeReady",function () {
			                WeixinJSBridge.invoke("getNetworkType", {}, fn);
			            });
			        }
			    }
			},
			 
		    loadJS:function( url, callback ){

			    var script = document.createElement('script'),

			        fn = callback || function(){};

			    script.type = 'text/javascript';

			  

			    //IE

			    if(script.readyState){

			        script.onreadystatechange = function(){

			            if( script.readyState == 'loaded' || script.readyState == 'complete' ){

			                script.onreadystatechange = null;

			                fn();

			            }

			        };

			    }else{

			        //其他浏览器

			        script.onload = function(){

			            fn();

			        };

			    }

			    script.src = url;

			    document.getElementsByTagName('head')[0].appendChild(script);

			}, 

		},
		created() { 

		},
		computed: {
		    player () {
		      return this.$refs.videoPlayer.player
		    },
		    playsinline () {
		      let ua = navigator.userAgent.toLocaleLowerCase()
		      // x5内核
		      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
		        return false
		      } else {
		        // ios端
		        return true
		      }
		  }
		},
		watch:{
			videoUrl:{

				handler:function(v){
					if(v!=''){
						this.url = v;

						this.id = 'player_'+parseInt(Math.random()*100000);


						setTimeout(()=>{

							let ua = navigator.userAgent.toLocaleLowerCase();

							//ios端飞书打开后自动播放
							if(ua.match(/iphone/) != null){

								window.h5sdk && 
								window.h5sdk.device &&
								window.h5sdk.device.connection &&
								window.h5sdk.device.connection.getNetworkType({
							          onSuccess: (responseData) => { 
	 

												document.getElementById(this.id).load();
												document.getElementById(this.id).play();
					
							          }
							    })
							}
 

							//微信打开播放
							this.weixinPlay(()=>{

								document.getElementById(this.id).load();
								document.getElementById(this.id).play();
							})
 
 
							  //    let ua = navigator.userAgent.toLocaleLowerCase();
							  //    console.log(ua);
							  //     // x5内核
							  //     if (ua.match(/iphone/) != null && 
							  //     	(ua.match(/micromessenger/) != null) 
							  //     	// (ua.match(/safari/) != null)

							  //     	 ) {
								 //      	console.log('safari或微信');

								 //      	this.loadJS('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',()=>{

									// 		 wx.config({
									// 		        debug: false,
									// 		        appId: parseInt(Math.random()*10000),
									// 		        timestamp: parseInt(Math.random()*10000),
									// 		        nonceStr: parseInt(Math.random()*10000),
									// 		        signature: parseInt(Math.random()*10000),
									// 		        jsApiList: []
									// 		})
									// 		wx.ready(()=> {
									// 			console.log('ready');
									// 			var video = document.getElementById(this.id);
									// 		       video.play();
									// 		});

								 //      	}) 

									   
							  //     }else{
									// document.getElementById(this.id).load();
								 //    document.getElementById(this.id).play(); 

							  //     }



						},1000) 

					}

					 
				},
				immediate:true

			},
			videoId:function(v){
			 
			},
			videoCover:{
				handler:function(v){
					 
						this.cover = v; 
				},
				immediate:true

			}
		},
		mounted() { 

		}

	}
</script>

<style scoped>
	.player{
	    position: absolute;
	    left:0;
	    top:0;
	    height: 100%;
	    width: 100%;
	    background: #000; 
	}
	.play_ico{
		position: absolute;
		left:0;
		top:0;
		color: #fff;
	}

	.video-player {
		 /*height: 100%;
		width: auto;*/
		background: #000;
	}
	 

</style>
```