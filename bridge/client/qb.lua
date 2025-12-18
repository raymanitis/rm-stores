-- Initialize Bridge if not exists
if not Bridge then
    Bridge = {}
end

-- Check if QBCore exists and should be used
if Config.Framework == 'auto' or Config.Framework == 'QB' then
    if GetResourceState('qb-core') == 'started' then
        local QBCore = exports['qb-core']:GetCoreObject()
        
        Bridge.Framework = 'QB'
        
        -- Get Player Data
        function Bridge.GetPlayer()
            return QBCore.Functions.GetPlayerData()
        end
        
        -- Get Player Money
        function Bridge.GetMoney(moneyType)
            local PlayerData = QBCore.Functions.GetPlayerData()
            if moneyType == 'cash' then
                return PlayerData.money.cash or 0
            elseif moneyType == 'bank' then
                return PlayerData.money.bank or 0
            end
            return 0
        end
        
        -- Remove Money
        function Bridge.RemoveMoney(moneyType, amount)
            TriggerServerEvent('QBCore:Server:RemoveMoney', moneyType, amount)
        end
        
        -- Notify Player
        function Bridge.Notify(message, type, duration)
            QBCore.Functions.Notify(message, type, duration or 5000)
        end
        
        -- Register Usable Item (if needed)
        function Bridge.RegisterUsableItem(itemName, callback)
            QBCore.Functions.CreateUseableItem(itemName, callback)
        end
        
        Config.Framework = 'QB'
    end
end
