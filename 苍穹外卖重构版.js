let 订单数组;//先声明 不给值
let Bdata = localStorage.getItem("订单数组");//去仓库拿钥匙

if (Bdata !==null){
    订单数组 = JSON.parse(Bdata);//不是空就还原成数组
}
else {
    订单数组 = [];//为空防止后面报错
}
更新数据看板();更新销量排行();

let 购物车;
let Adata = localStorage.getItem("购物车");

if(Adata !== null) {
    购物车 = JSON.parse(Adata);
    let 总价 = 0;
    let 总数量 = 0;

    购物车.forEach(function(item) {
        总数量 += item.数量;
        总价 += item.价格 * item.数量;
    })

    document.querySelector("#数量徽标").textContent = 总数量;
    document.querySelector("#总价").textContent = "¥" + 总价;
}
else {
    购物车 = [];
}
/*===============================================================*/
let 菜单数组 = [
    {菜名: '汉堡', 价格: 10, 分类: '主食', 图片: '🍔',加号:"➕"},
    {菜名: '鸡腿堡', 价格: 9, 分类: '主食', 图片: '🍗',加号:"➕"},
    {菜名: '薯条', 价格: 6, 分类: '小吃', 图片: '🍟',加号:"➕"},
    {菜名: '可乐', 价格: 5, 分类: '饮品', 图片: '🥤',加号:"➕"},
    {菜名: '雪碧', 价格: 5, 分类: '饮品', 图片: '🧊',加号:"➕"},
    {菜名: '矿泉水', 价格: 2, 分类: '饮品', 图片: '💧',加号:"➕"},
    {菜名: '炒饭', 价格: 15, 分类: '主食', 图片: '🍚',加号:"➕"},
    {菜名: '冰淇淋', 价格: 8, 分类: '小吃', 图片: '🍦',加号:"➕"},
];

let 菜单 = document.querySelector("#菜单");

function 渲染菜单(菜单数组) {
    let 菜单盒子 = "";
菜单数组.forEach(function(菜) {
    菜单盒子 +=`
    <div class="卡片">
        <div class="菜名">${菜.菜名}</div>
        <div class="价格">${菜.价格}</div>
        <div class="分类">${菜.分类}</div>
        <div class="图片">${菜.图片}</div>
        <button class="加号" data-菜名="${菜.菜名}" data-价格="${菜.价格}">${菜.加号}</button>
    </div>
        `
});
菜单.innerHTML = 菜单盒子;
}
渲染菜单(菜单数组);

/*==============================================*/
菜单.addEventListener("click", function(e) {
    if (e.target.classList.contains("加号")) {
        let 菜名 = e.target.dataset.菜名;
        let 价格 = Number(e.target.dataset.价格);

        let 找到的菜 = 购物车.find(function(item) {
            return item.菜名 === 菜名;
        });
        if (找到的菜) {
            找到的菜.数量 += 1;
        } else {
            购物车.push({
                菜名: 菜名,
                价格: 价格,
                数量: 1
            });
        }
            localStorage.setItem("购物车", JSON.stringify(购物车));

        let 总数量 = 0;
        let 总价 = 0;
        购物车.forEach(function(item) {
            总数量 += item.数量;
            总价 += item.价格 * item.数量;
        });
        document.querySelector("#数量徽标").textContent = 总数量;
        document.querySelector("#总价").textContent = "￥" + 总价;
    } else if (e.target.closest(".卡片")) {
        let 卡片 = e.target.closest(".卡片");
       let 图片 = 卡片.querySelector(".图片").textContent;
       let 菜名 = 卡片.querySelector(".菜名").textContent;
       let 价格 = 卡片.querySelector(".价格").textContent;
       let 分类 = 卡片.querySelector(".分类").textContent;

        let 遮罩层 = document.createElement("div");
        let 弹窗内容 = document.createElement("div");
        let 关闭按钮 = document.createElement("button");
            关闭按钮.textContent = "✕"; 
            关闭按钮.addEventListener("click", function() {
                遮罩层.remove();
            })

        遮罩层.classList.add("遮罩层");
        弹窗内容.classList.add("弹窗内容");
        关闭按钮.classList.add("关闭按钮");

        弹窗内容.innerHTML = `
        <div class="弹窗图片">${图片}</div>
        <div class="弹窗菜名">${菜名}</div>
        <div class="弹窗价格">￥${价格}</div>
        <div class="弹窗分类">${分类}</div>
        `;
        弹窗内容.appendChild(关闭按钮);

        遮罩层.appendChild(弹窗内容);
        弹窗内容.addEventListener("click", function(e) {
            e.stopPropagation();
        });
        遮罩层.addEventListener("click",function(){
            遮罩层.remove();
        })
        document.body.appendChild(遮罩层);
    }
});
/*============================================*/
let 分类栏 = document.querySelector(".分类栏");

分类栏.addEventListener("click", function(e) {
    if (e.target.classList.contains("分类按钮")) {
        let x = e.target.textContent;

        if (x === "全部") {
            渲染菜单(菜单数组);
        } else {
            let 结果 = 菜单数组.filter(function(item) {
                return item.分类 === x;
            });
            渲染菜单(结果);
        }
         let 按钮 = document.querySelectorAll(".分类按钮");

    按钮.forEach(function(btn) {
        btn.classList.remove("active");
    });
    e.target.classList.add("active");
    }
})

let 搜索框 = document.querySelector("#搜索框");

搜索框.addEventListener("input", function(e) {
    let 关键词 = e.target.value;
    let end = 菜单数组.filter(function(item) {
        return item.菜名.includes(关键词)||item.分类.includes(关键词);
    })
    渲染菜单(end);
})
/*=============================================*/
let 结算按钮 = document.querySelector(".endbtn");

结算按钮.addEventListener("click", function(e) {
     if (购物车.length === 0) {
        alert("购物车为空");
     }else {
        let 遮罩 = document.createElement("div");
        let 弹窗 = document.createElement("div");
        遮罩.classList.add("遮罩层");
        弹窗.classList.add("弹窗内容");

        let 弹窗盒子 = `<div>确认订单</div>`
        let now = new Date().toLocaleString();
            弹窗盒子 += `<div>下单时间：${now}</div>`;

        let 总价 = 0;
        购物车.forEach(function(item) {
            总价 += item.价格 * item.数量;
            弹窗盒子 += `<div>${item.菜名} × ${item.数量} ￥${item.价格 * item.数量}`;})
            弹窗盒子 +=`<div>合计:￥${总价}</div>`
            弹窗盒子 +=`<button class="确认下单">确认下单</button>`;
            弹窗盒子 +=`<button class="取消下单">取消下单</button>`;

            弹窗.innerHTML = 弹窗盒子;

            弹窗.querySelector(".确认下单").addEventListener("click",function() {
                let 订单号 ="DD" + Math.random().toString(36).slice(2,9).toUpperCase();
                
                订单数组.push({
                    订单号: 订单号,
                    菜品: 购物车,
                    总价: 总价
                });

                localStorage.setItem("订单数组",JSON.stringify(订单数组));//(钥匙，JSON.strlingify(数组))

                购物车 = [];
                localStorage.setItem("购物车",JSON.stringify(购物车));
                let 总数量 = 0;
                document.querySelector("#数量徽标").textContent = 总数量;
                document.querySelector("#总价").textContent = "¥0";
                alert("下单成功!订单号：" + 订单号);
                更新数据看板();更新销量排行();
                遮罩.remove();
            });
            弹窗.querySelector(".取消下单").addEventListener("click",function() {
                alert("取消下单成功");
                遮罩.remove();
            });

            遮罩.appendChild(弹窗);
            document.body.appendChild(遮罩);

            弹窗.addEventListener('click',function(e) {
               e.stopPropagation(); 
            });
            遮罩.addEventListener("click",function() {
                遮罩.remove();
            });
        }});

        function 更新数据看板() {
            let 订单数 = 订单数组.length;
            let 累计金额 = 0
            订单数组.forEach(function(订单) {
                累计金额 += 订单.总价;
            });
            document.querySelector("#累计订单数").textContent = 订单数;
            document.querySelector("#累计金额").textContent = "¥" + 累计金额;
        }
/*========================================================*/
function 更新销量排行() {
let 排行数据 = [];
订单数组.forEach(function(订单) {
    订单.菜品.forEach(function(菜) {
        let Cdata = 排行数据.find(function(item) {
            return item.菜名 === 菜.菜名
        });
        if (Cdata) {
            Cdata.销量 += 菜.数量;
        } else {
            排行数据.push({
                菜名: 菜.菜名,
                销量: 菜.数量
            })
        }
    })
})
排行数据.sort(function(a,b) {
         return b.销量 - a.销量;
})
let Firstfour = 排行数据.slice(0,4);

let topbox = "";

Firstfour.forEach(function(item,i) {
    topbox +=`
    <div class="排行项">
        <span class="名次">${i+1}</span>
        <span class="菜名">${item.菜名}</span>
        <span class="销量">${item.销量}份</span>
    </div>
    `;
})

document.querySelector("#排行列表").innerHTML = topbox;
} 
/*========================================================*/

