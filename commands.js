const commands = [
    {
        category: "プレイヤー",
        name: "God",
        command: "cheat God",
        description: "無敵状態になります。",
        example: "cheat God"
    },
    {
        category: "プレイヤー",
        name: "Fly",
        command: "cheat Fly",
        description: "飛行モードになります。",
        example: "cheat Fly"
    },
    {
        category: "プレイヤー",
        name: "Walk",
        command: "cheat Walk",
        description: "飛行モードを解除します。",
        example: "cheat Walk"
    },
    {
        category: "テイム",
        name: "DoTame",
        command: "cheat DoTame",
        description: "対象生物を強制テイムします。",
        example: "cheat ForceTame"
    },
    {
        category: "テレポート",
        name: "Teleport",
        command: "cheat Teleport",
        description: "見ている場所へ移動します。",
        example: "cheat Teleport"
    },
    {
        category: "便利",
        name: "SetImprintQuality",
        command: "cheat SetImprintQuality 1",
        description: "対象生物の刷り込み（インプリント）品質を100%（1）に設定します。",
        example: "cheat SetImprintQuality 1"
    },
    {
        category: "便利",
        name: "SetBabyAge",
        command: "cheat SetBabyAge 1",
        description: "対象生物の成長度を100%（1・成体）に設定します。",
        example: "cheat SetBabyAge 1"
    },
    {
        category: "便利",
        name: "SetTargetDinoColor",
        command: "cheat SetTargetDinoColor 0 72",
        description: "対象生物の指定部位（例: 部位0）をカラーID（例: 72）に変更します。",
        example: "cheat SetTargetDinoColor 0 72"
    },
    {
        category: "便利",
        name: "ForceCompleteActiveMission",
        command: "cheat ForceCompleteActiveMission 0",
        description: "現在アクティブなミッションを強制完了します。",
        example: "cheat ForceCompleteActiveMission 0"
    },
    {
        category: "便利",
        name: "GiveExpToTarget",
        command: "cheat GiveExpToTarget 10000000 0 0",
        description: "見ている対象（生物・建造物など）に経験値を与えます。",
        example: "cheat GiveExpToTarget 10000000 0 0"
    },
    {
        category: "便利",
        name: "DestroyWildDinos",
        command: "cheat DestroyWildDinos",
        description: "マップ上の野生生物をすべて削除し、リスポーンを促します。",
        example: "cheat DestroyWildDinos"
    }
];
