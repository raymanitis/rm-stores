-- Initialize Bridge if not exists
if not Bridge then
    Bridge = {}
end

-- Check if QBCore exists and should be used
if Config.Framework == 'auto' or Config.Framework == 'QB' then
    if GetResourceState('qb-core') == 'started' then
        local QBCore = exports['qb-core']:GetCoreObject()
        
        Bridge.Framework = 'QB'
        
        -- Get Player by Source
        function Bridge.GetPlayer(source)
            return QBCore.Functions.GetPlayer(source)
        end
        
        -- Remove Money from Player
        function Bridge.RemoveMoney(source, moneyType, amount)
            local Player = QBCore.Functions.GetPlayer(source)
            if not Player then return false end
            
            if moneyType == 'cash' then
                return Player.Functions.RemoveMoney(moneyType, amount)
            elseif moneyType == 'bank' then
                return Player.Functions.RemoveMoney(moneyType, amount)
            end
            return false
        end
        
        -- Get Player Money
        function Bridge.GetMoney(source, moneyType)
            local Player = QBCore.Functions.GetPlayer(source)
            if not Player then return 0 end
            
            if moneyType == 'cash' then
                return Player.PlayerData.money.cash or 0
            elseif moneyType == 'bank' then
                return Player.PlayerData.money.bank or 0
            end
            return 0
        end
        
        -- Notify Player
        function Bridge.Notify(source, message, type, duration)
            TriggerClientEvent('QBCore:Notify', source, message, type, duration or 5000)
        end
        
        -- Add Money to Player
        function Bridge.AddMoney(source, moneyType, amount)
            local Player = QBCore.Functions.GetPlayer(source)
            if not Player then return false end
            
            if moneyType == 'cash' then
                return Player.Functions.AddMoney(moneyType, amount)
            elseif moneyType == 'bank' then
                return Player.Functions.AddMoney(moneyType, amount)
            end
            return false
        end
        
        Config.Framework = 'QB'
    end
end
