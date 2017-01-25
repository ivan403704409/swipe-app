window.Page = (function (argument) {
	var Page = {
		$pages: [],	//页面dom
		len: 0,		//页面数量
		curIndex: 0,//当前页面index
		startX: 0,	//
		startY: 0,
		startTime: 0,
		type: 'vertical',

		// 指定某一页
		go: function (page) {
			if(typeof page!=='number' || page!==page)return
			Page.curIndex = page - 1
			Page._switchPage()
		},

		// 下一页
		next: function () {
			if(Page.len-1===Page.curIndex)return
			Page.curIndex += 1
			Page._switchPage()
		},

		// 上一页
		prev: function () {
			if(Page.curIndex===0)return
			Page.curIndex -= 1
			Page._switchPage()	
		},

		// 切换动画
		_switchPage: function (){
			var $pages = Page.$pages
			$pages.forEach(($page, index) => {
				let curIndex = Page.curIndex
				if(curIndex===index){
					$page.className = 'page curPage'
				}else if(index+1==curIndex){
					$page.className = 'page prevPage'
				}else if(index-1==curIndex){
					$page.className = 'page nextPage'
				}else{
					$page.className = 'page'
				}
			})
		},
		_fnStart: function (e){
			if('ontouchstart' in window)e = e.touches[0]
			var clientX = e.clientX
			var clientY = e.clientY
			Page.startX = clientX
			Page.startY = clientY
			Page.startTime = new Date()
		},
		_fnEnd: function (e){
			if('ontouchstart' in window)e = e.changedTouches[0]
			var clientX = e.clientX
			var clientY = e.clientY
			var disTb = Math.abs(clientY-Page.startY)	//上下距离
			var disLr = Math.abs(clientX-Page.startX)	//左右距离
			if(!disTb && !disLr)return

			var time = new Date()-Page.startTime
			var dir = Page._getSwipeDirection(Page.startX, Page.startY, clientX, clientY)
			// 左右
			if(Page.type === 'horizon'){
				// 距离大于100 或 小于300毫秒才继续
				if(!(disLr>100 || time < 300))return
				if(dir==='left'){
					Page.next()
				}else if(dir==='right'){
					Page.prev()
				}
			// 上下
			}else{
				// 距离大于100 或 小于300毫秒才继续
				if(!(disTb>100 || time < 300))return
				if(dir==='up'){
					Page.next()
				}else if(dir==='down'){
					Page.prev()
				}	
			}

			
		},

		_getSwipeDirection(x1,y1,x2,y2){
			return Math.abs(x2-x1)>Math.abs(y2-y1) 
					? (x2>x1 ? 'right' : 'left')
					: (y2>y1 ? 'down' : 'up')
		},


		// 事件绑定
		_bind: function () {
			var evStart = 'touchstart'
			var end = 'touchend'
			if(!('ontouchstart' in window)){
				evStart = 'mousedown'
				end = 'mouseup'
			}
			document.removeEventListener(evStart, Page._fnStart)
			document.removeEventListener(end, Page._fnEnd)

			document.addEventListener(evStart, Page._fnStart)
			document.addEventListener(end, Page._fnEnd)	
		},

		// 初始化
		init: function (type){
			var $app = document.getElementById('app')
			Page.$pages = $app.querySelectorAll('.page')
			Page.len = Page.$pages.length
			
			// 处理滑动方向
			if(type!=='horizon')type = 'vertical'
			Page.type = type
			$app.className = Page.type

			Page._bind()
			
			Page.go(1)
		},
	}

	return {
		init: Page.init,
		go: Page.go,
		next: Page.next,
		prev: Page.prev,
	}
})(window)
