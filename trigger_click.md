```
<button id="test" type="button"  >测试</button>

<script>


var trigger = function(element,event,data){
        element.dispatchEvent(new CustomEvent(event, {detail: data,bubbles: true,cancelable: true}));
    }
    document.getElementById("test").addEventListener("click",function (e) {
        console.log("测试触发");
        console.log(e.detail)
    });
    trigger(document.getElementById("test"),"click",{id:1,title:"哈哈"});
</script>

```