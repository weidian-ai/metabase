/**
 * 书写的模版，added，fixed是可选字段。title和description是必填字段
 * {
        title:"修改了一些bug",
        description: "修改了前端的一些bug",
        added:[
            "添加了埋点纪录的功能",
            "添加了国际化功能",
            "添加了impala支持"
        ],
        fixed:[
            "优化了加载性能",
            "fixed了safari加载的问题",
            "修复了页面加载缓慢的问题"
        ]
    }
 */

 
/**
 * 小提示:
    为了便于发版的查看，建议标题中带有时间，建议格式为：月/日 时(AM或者PM)
    如：
        title: "08/21 14PM--添加看板和问题页面的权限"
*/
const changeLog = []

export default changeLog.reverse()