(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about","chunk-6ae759a4","chunk-2d0cc5aa"],{"4e25":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"at-tabs__pane"},[t._t("default")],2)},s=[],i=(e("b0c0"),{name:"AtTabPane",props:{name:{type:String},label:{type:String},icon:{type:String},disabled:{type:Boolean,default:!1},closable:{type:Boolean,default:!0}},data:function(){return{currentName:this.name,show:!0}},computed:{isClosable:function(){return!!this.closable&&this.$parent.closable}},watch:{name:function(){this.currentName=this.name}},mounted:function(){this.$parent.updateNav()}}),l=i,r=e("2877"),c=Object(r["a"])(l,n,s,!1,null,null,null);a["default"]=c.exports},5795:function(t,a,e){"use strict";var n=e("6868"),s=e.n(n);s.a},6868:function(t,a,e){},"74a9":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"at-tabs",class:{"at-tabs--small":"small"===t.size,"at-tabs--card":"card"===t.type,"at-tabs--scroll":t.scrollable}},[e("div",{staticClass:"at-tabs__header"},[t.$slots.extra?e("div",{staticClass:"at-tabs__extra"},[t._t("extra")],2):t._e(),e("div",{staticClass:"at-tabs__nav"},[t.scrollable?e("span",{staticClass:"at-tabs__prev",class:{"at-tabs__prev--disabled":!t.prevable},on:{click:t.scrollPrev}},[e("i",{staticClass:"icon icon-chevron-left"})]):t._e(),t.scrollable?e("span",{staticClass:"at-tabs__next",class:{"at-tabs__next--disabled":!t.nextable},on:{click:t.scrollNext}},[e("i",{staticClass:"icon icon-chevron-right"})]):t._e(),e("div",{staticClass:"at-tabs__nav-wrap"},[e("div",{ref:"navScroll",staticClass:"at-tabs__nav-scroll"},[e("div",{ref:"nav",staticClass:"at-tabs-nav",style:t.navStyle},t._l(t.navList,(function(a,n){var s;return e("div",{key:n,staticClass:"at-tabs-nav__item",class:{"at-tabs-nav__item--active":n===t.activeIndex,"at-tabs-nav__item--disabled":a.disabled,"at-tabs-nav__item--closable":a.closable},on:{click:function(a){return t.setNavByIndex(n)}}},[a.icon?e("i",{staticClass:"icon at-tabs-nav__icon",class:(s={},s[a.icon]=a.icon,s)}):t._e(),t._v(t._s(a.label)+" "),a.closable?e("span",{staticClass:"at-tabs-nav__close",on:{click:function(a){return a.stopPropagation(),t.removeHandle(n)}}},[e("i",{staticClass:"icon icon-x"})]):t._e()])})),0)])])])]),e("div",{staticClass:"at-tabs__body",style:t.tabsBodyTranslateStyle},[t._t("default")],2)])},s=[],i=(e("4de4"),e("4160"),e("c975"),e("a434"),e("b0c0"),e("159b"),{name:"AtTabs",props:{value:{type:String},type:{type:String,default:"line",validator:function(t){return["line","card"].indexOf(t)>-1}},size:{type:String,default:"default",validator:function(t){return["default","small"].indexOf(t)>-1}},closable:{type:Boolean,default:!1},animated:{type:Boolean,default:!0}},data:function(){return{navList:[],activeKey:this.value,navOffset:0,navStyle:{transform:""},nextable:!1,prevable:!1}},watch:{activeKey:function(){var t=this;this.$emit("on-change",{index:this.activeIndex,name:this.activeKey}),this.$nextTick((function(){t.scrollToActiveTab()}))}},computed:{scrollable:function(){return this.prevable||this.nextable},activeIndex:function(){for(var t=this.navList,a=0,e=t.length;a<e;a++){var n=t[a];if(n.name===this.activeKey)return a}return 0},tabsBodyTranslateStyle:function(){var t=this.activeIndex,a=this.animated?"".concat(100*-t,"%"):0;return{transform:"translate3d(".concat(a,", 0, 0)")}}},methods:{scrollPrev:function(){if(this.prevable){var t=this.$refs.navScroll.offsetWidth,a=this.getCurrentScrollOffset();if(0!==a){var e=a>t?a-t:0;this.setOffset(e)}}},scrollNext:function(){if(this.nextable){var t=this.$refs.navScroll.offsetWidth,a=this.getCurrentScrollOffset(),e=this.$refs.nav.offsetWidth;if(!(e-a<=t)){var n=e-a>2*t?a+t:e-t;this.setOffset(n)}}},scrollToActiveTab:function(){if(this.scrollable){var t=this.$el.querySelector(".at-tabs-nav__item--active"),a=this.$refs.navScroll,e=t.getBoundingClientRect(),n=a.getBoundingClientRect(),s=this.getCurrentScrollOffset(),i=s;e.left<n.left&&(i=s-(n.left-e.left)),e.right>n.right&&(i=s+(e.right-n.right)),this.setOffset(i)}},getCurrentScrollOffset:function(){return this.navOffset},setOffset:function(t){this.navOffset=Math.abs(t),this.navStyle.transform="translate3d(-".concat(this.navOffset,"px, 0, 0)")},getTabs:function(){return this.$children.filter((function(t){return"AtTabPane"===t.$options.name}))},removeHandle:function(t){var a=this,e=this.getTabs(),n=e[t],s="";if(!n.disabled&&(this.navList.splice(t,1),this.$emit("on-tab-remove",{index:t,name:n.currentName}),this.$nextTick((function(){a.updateNav()})),n.currentName===this.activeKey)){var i=this.getTabs();if(i.length){var l=e.filter((function(a,e){return!a.disabled&&e>t})),r=e.filter((function(a,e){return!a.disabled&&e<t}));s=l.length?l[0].currentName:r.length?r[r.length-1].currentName:i[0].currentName}this.activeKey=s}},updateNav:function(){var t=this;this.navList=[],this.getTabs().forEach((function(a,e){t.navList.push({label:a.label,name:a.currentName||e,disabled:a.disabled,icon:a.icon,closable:a.isClosable}),a.currentName||(a.currentName=e),0!==e||t.activeKey||(t.activeKey=a.currentName||e),t.animated||t.switchTabsWithNoAnimated()}))},setNavByIndex:function(t){var a=this.navList[t];a.disabled||(this.activeKey=a.name,this.animated||this.switchTabsWithNoAnimated())},switchTabsWithNoAnimated:function(){var t=this,a=this.getTabs();a.forEach((function(a){a.show=a.currentName===t.activeKey}))},updateHandle:function(){var t=this.$refs.nav.offsetWidth,a=this.$refs.navScroll.offsetWidth,e=this.getCurrentScrollOffset();a<t?(this.prevable=0!==e,this.nextable=e+a<t,t-e<a&&this.setOffset(t-a)):(this.nextable=!1,this.prevable=!1,e>0&&this.setOffset(0))}},mounted:function(){var t=this;window.addEventListener("resize",this.updateHandle,!1),this.updateNav(),setTimeout((function(){t.scrollToActiveTab()}),0)},updated:function(){this.updateHandle()}}),l=i,r=(e("ff04"),e("2877")),c=Object(r["a"])(l,n,s,!1,null,null,null);a["default"]=c.exports},a1b0:function(t,a,e){},f820:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("Popover",{attrs:{trigger:"click"}},[t._v(" 这是一些内容 ")]),e("ToolTip",[t._v(" 这是一些内容 ")]),e("button",{on:{click:function(a){t.modalVisible=!t.modalVisible}}},[t._v("关闭打开")]),e("Modal",{attrs:{visible:t.modalVisible},on:{visibleChange:function(a){return t.modalVisible=a}}}),e("at-tabs",[e("at-tab-pane",{attrs:{label:"Tab1",name:"name1"}},[e("p",[t._v("Content of Tab Pane 1")])]),e("at-tab-pane",{attrs:{label:"Tab2",name:"name2"}},[e("p",[t._v("Content of Tab Pane 2")])]),e("at-tab-pane",{attrs:{label:"Tab3",name:"name3"}},[e("p",[t._v("Content of Tab Pane 3")])]),e("div",{attrs:{slot:"extra"},slot:"extra"},[e("button",[t._v("额外内容")])])],1)],1)},s=[],i=e("267e"),l=e("fd6e"),r=e("cb15"),c=e("74a9"),o=e("4e25"),u=[{title:"Tab 1",value:"tab1"},{title:"Tab 2",value:"tab2"},{title:"Disabled Tab",value:"tab3",disabled:!0},{title:"Tab 4",value:"tab4"}],f={name:"About",components:{Popover:i["a"],ToolTip:l["a"],Modal:r["a"],AtTabs:c["default"],AtTabPane:o["default"]},data:function(){return{modalVisible:!1,tabs:u,currentTab:"tab1"}},methods:{handleClick:function(t){this.currentTab=t}}},b=f,v=(e("5795"),e("2877")),d=Object(v["a"])(b,n,s,!1,null,null,null);a["default"]=d.exports},ff04:function(t,a,e){"use strict";var n=e("a1b0"),s=e.n(n);s.a}}]);
//# sourceMappingURL=about.d3e72fd0.js.map