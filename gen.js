const fs = require('fs')

var list = [
    {"id": "ZOMBIE_KILLER", "name": "ゾンビ特攻", "info": "このアイテムは<info>ゾンビに追加ダメージ</info>を与えます。"},
    {"id": "PLANT_KILLER", "name": "植物特攻", "info": "このアイテムは<info>植物に追加ダメージ</info>を与えます。"},
    {"id": "INSECT_KILLER", "name": "虫特攻", "info": "このアイテムは<info>虫に追加ダメージ</info>を与えます。"},
    {"id": "FLIGHT_KILLER", "name": "飛行特攻", "info": "このアイテムは<info>飛んでいる敵に追加ダメージ</info>を与えます。"},
    {"id": "DRAIN_HP", "name": "HP回復", "info": "このアイテムは攻撃が命中したときに<info>HPを回復</info>します。"},
    {"id": "DRAIN_MANA", "name": "マナ回復", "info": "このアイテムは攻撃が命中したときに<info>マナを回復</info>します。"},
    {"id": "STOP_TIME", "name": "時間停止", "info": "このアイテムは攻撃が命中したときに<info>時を止める</info>ことがあります。"},
    {"id": "DEBUG_DEATH", "name": "即死(デバッグ)", "info": "このアイテムは攻撃が命中したときに<info>敵を即死</info>させます。"},
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
        j.info = "[<good>" + e.name + "Lv:" + i + "</good>]" + e.info
        json.push(j)
        eoc.effect[0].cases.push(
            { "case": i, "effect": { "npc_set_flag": j.id } }
        )
    }
    eocs.push(eoc)
})

var eff1 = json.map( e => {
    return { "if": { "npc_has_flag": e.id }, "then": [{"math": ["u_" + e.id, "=", "1"] }], "else": [{"math": ["u_" + e.id, "=", "0"] }] }
})
var eff2 = json.map( e => {
    return { "if": {"math": ["u_" + e.id, "==", "1"] }, "then": [{"npc_set_flag":  e.id }] }
})

//eocs.push({
//    "type": "effect_on_condition",
//    "id": "EOC_random_enchant_set_flag_before",
//    "effect": eff1
//})
//eocs.push({
//    "type": "effect_on_condition",
//    "id": "EOC_random_enchant_set_flag_after",
//    "effect": eff2
//})

fs.writeFileSync("flags.json", JSON.stringify(json, null, "  "))
fs.writeFileSync("lottery/flags_eoc.json", JSON.stringify(eocs, null, "  "))
