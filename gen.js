const fs = require('fs')

var list = [
    {"id": "ZOMBIE_KILLER", "name": "ゾンビ特攻", "info": "このアイテムは<info>ゾンビに追加ダメージ</info>を与えます。"},
    {"id": "FLIGHT_KILLER", "name": "飛行特攻", "info": "このアイテムは<info>飛んでいる敵に追加ダメージ</info>を与えます。"},
    {"id": "STOP_TIME", "name": "時間停止", "info": "このアイテムは<info>時を止める</info>ことがあります。"},
]

var json = []
var eocs = []

list.forEach( e => {
    var eoc = {
        "type": "effect_on_condition",
        "effect": [
        {
          "switch": { "math": [ "_rank" ] },
          "cases": [
          ]
        }
    ]}
    eoc.id = "EOC_random_enchant_lottery[" + e.id + "]"
    for(var i = 1; i < 4; i++ ) {
        var j = {}
        j.id = "random_enchant_" + e.id + "_" + i
        j.type = "json_flag"
        j.info = "<good>" + e.name + "</good>"
        json.push(j)
        eoc.effect[0].cases.push(
            { "case": i, "effect": { "set_string_var": j.id, "target_var": { "var_val": "target" } } }
        )
    }
    eocs.push(eoc)
})

fs.writeFileSync("flags.json", JSON.stringify(json, null, "  "))
fs.writeFileSync("lottery/lottery_flags.json", JSON.stringify(eocs, null, "  "))
