const fs = require('fs')

var list = [
    {"id": "ZOMBIE_KILLER", "name": "ゾンビ特攻", "info": "このアイテムは<info>ゾンビに追加ダメージ</info>を与えます。"},
    {"id": "FLIGHT_KILLER", "name": "飛行特攻", "info": "このアイテムは<info>飛んでいる敵に追加ダメージ</info>を与えます。"},
    {"id": "DRAIN_HP", "name": "HP回復", "info": "このアイテムは攻撃が命中したときに<info>HPを回復</info>します。"},
    {"id": "DRAIN_MANA", "name": "マナ回復", "info": "このアイテムは攻撃が命中したときに<info>マナを回復</info>します。"},
    {"id": "STOP_TIME", "name": "時間停止", "info": "このアイテムは攻撃が命中したときに<info>時を止める</info>ことがあります。"},
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
        j.info = "<good>" + e.name + "Lv:" + i + "</good>"
        json.push(j)
        eoc.effect[0].cases.push(
            { "case": i, "effect": { "set_string_var": j.id, "target_var": { "var_val": "target" } } }
        )
    }
    eocs.push(eoc)
})

var info1 = json.map( e => {
    return { "if": { "npc_has_flag": e.id }, "then": [ {"math": ["_" + e.id, "=", "1"]} ] }
})

var info2 = json.map( e => {
    return { "if": {"math": ["_" + e.id, "==", "1"]}, "then": [ {"npc_set_flag": e.id } ] }
})

fs.writeFileSync("flags.json", JSON.stringify(json, null, "  "))
fs.writeFileSync("lottery/lottery_flags.json", JSON.stringify(eocs, null, "  "))
fs.writeFileSync("tmp.json", JSON.stringify([info1, info2], null, "  "))
