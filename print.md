
```
let iframe = document.querySelector("iframe");
				    iframe.contentDocument.open();
				    iframe.contentDocument.write(`
				    	<style media="print">
				    	body{
				    		padding:0;
				    		margin:0;
				    	}
							// .printTable{
							// 	width: 100%;
							// 	color: #000;
							// 	background: #eee;
							// 	border-spacing: 1px;
							// 	border-collapse: inherit;
							// 	line-height: 32px;

					  // 		}
					  // 		.printTable tr td{
					  // 			background: #fff;
					  // 			padding-left:5px;
					  // 			line-height: 30px;
					  // 		}


					  		.printTable{
								// font-size:12px;
								width: 100%;
								color: #000;
								border-spacing: 1px;
								border-collapse: inherit;
								line-height: 32px;
								border-top:solid #000 1px;
								border-left:solid #000 1px;
					  		}
					  		.printTable tr td{
								border-bottom:solid #000 1px;
								border-right:solid #000 1px;
					  			background: #fff;
					  			padding-left:5px;

					  		}


					  		.printTable_title{
					  			font-size:30px;
					  			padding:10px 0;
					  		}
					  		.printTable tr.yellow_bg td{
					  			 background-color: #ffff00 !important;
						        -webkit-print-color-adjust: exact;
					  		}
					  		.lineInput{
					  			display: inline-block;
					  			width: 150px;
					  			border-bottom: solid #000 1px;
					  			margin-right: 10px
					  		}
					  		.tel{
					  			font-size: 14px;
					  			text-align: right;
					  			padding-right: 10px;
					  		}
						</style>
				    	<div id="preview"></div>
						<script>
						window.addEventListener("message", (e) => {
						  if(!e.data) {
						    return;
						  }

						
							document.getElementById('preview').innerHTML = e.data;

						   setTimeout(()=>{
							   window.print();
						   },200)
						  
						}, false);
						
						// window.parent.postMessage('ready', '*');

						<\/script>`);
				    iframe.contentDocument.close();
				    setTimeout(() => { 
				        iframe.contentWindow.postMessage(document.getElementById('preview').innerHTML, "*");
				    }, 200);
```