const fs = require('fs')

var list = [
    {"id": "ZOMBIE_KILLER", "name": "ゾンビ特攻", "info": "このアイテムは<info>ゾンビに追加ダメージ</info>を与えます。"},
    {"id": "PLANT_KILLER", "name": "植物特攻", "info": "このアイテムは<info>植物に追加ダメージ</info>を与えます。"},
    {"id": "INSECT_KILLER", "name": "虫特攻", "info": "このアイテムは<info>虫に追加ダメージ</info>を与えます。"},
    {"id": "FLIGHT_KILLER", "name": "飛行特攻", "info": "このアイテムは<info>飛んでいる敵に追加ダメージ</info>を与えます。"},
    {"id": "BLEED", "name": "出血", "info": "このアイテムは攻撃が命中したときに<info>敵を出血</info>させます"},
    {"id": "DRAIN_HP", "name": "HP回復", "info": "このアイテムは攻撃が命中したときに<info>HPを回復</info>します。"},
    {"id": "DRAIN_MANA", "name": "マナ回復", "info": "このアイテムは攻撃が命中したときに<info>マナを回復</info>します。"},
    {"id": "DRAIN_STAMINA", "name": "スタミナ回復", "info": "このアイテムは攻撃が命中したときに<info>スタミナを回復</info>します。"},
    {"id": "LIFT", "name": "重量挙げ", "info": "このアイテムは装備している間、<info>所持重量を増加</info>させます。"},
    {"id": "MORALE", "name": "気分屋", "info": "このアイテムの攻撃力は<info>意欲に依存</info>します。"},
    {"id": "STOP_TIME", "name": "時間停止", "info": "このアイテムは攻撃が命中したときに<info>時を止める</info>ことがあります。"},
    {"id": "ELEC", "name": "電撃攻撃", "info": "このアイテムは<info>電撃の追加ダメージ</info>を与えます。"},
    {"id": "HEAT", "name": "熱攻撃", "info": "このアイテムは<info>熱の追加ダメージ</info>を与えます。"},
    {"id": "COLD", "name": "冷気攻撃", "info": "このアイテムは<info>冷気の追加ダメージ</info>を与えます。"},
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
    var tmp = []
    for(var i = 1; i < 4; i++ ) {
        var j = {}
        j.id = "random_enchant_" + e.id + "_" + i
        j.type = "json_flag"
        j.info = "[<good>" + e.name + "Lv:" + i + "</good>]" + e.info
        json.push(j)
        eoc.effect[0].cases.push(
            { "case": i, "effect": [{ "npc_set_flag": j.id }] }
        )
        tmp.push(j.id)
    }
    eoc["condition"] = {"not": {"or": tmp.map(id => {return {"npc_has_flag": id}}) }}
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

var items_debug = list.map( e => {
    return {
        "id": "enchant_crystal_debug_[" + e.id + "]",
        "type": "TOOL",
        "copy-from": "enchant_crystal",
        "name": { "str": "エンチャント・クリスタル(" + e.name + ")" },
        "flags": [ "random_enchant_" + e.id + "_3"]
      }
})

fs.writeFileSync("flags.json", JSON.stringify(json, null, "  "))
fs.writeFileSync("lottery/flags_eoc.json", JSON.stringify(eocs, null, "  "))
fs.writeFileSync("items_debug.json", JSON.stringify(items_debug, null, "  "))
