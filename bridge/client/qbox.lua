-- Initialize Bridge if not exists
if not Bridge then
    Bridge = {}
end

-- Check if Qbox exists and should be used
if Config.Framework == 'auto' or Config.Framework == 'QBOX' then
    if GetResourceState('qbx_core') == 'started' then
        local QBX = exports.qbx_core
        
        Bridge.Framework = 'QBOX'
        
        -- Get Player Data
        function Bridge.GetPlayer()
            return QBX:GetPlayer()
        end
        
        -- Get Player Money
        function Bridge.GetMoney(moneyType)
            local Player = QBX:GetPlayer()
            if not Player then return 0 end
            
            if moneyType == 'cash' then
                return Player.PlayerData.money.cash or 0
            elseif moneyType == 'bank' then
                return Player.PlayerData.money.bank or 0
            end
            return 0
        end
        
        -- Remove Money
        function Bridge.RemoveMoney(moneyType, amount)
            local Player = QBX:GetPlayer()
            if not Player then return false end
            
            if moneyType == 'cash' then
                return exports.qbx_core:RemoveMoney(Player.PlayerData.source, moneyType, amount)
            elseif moneyType == 'bank' then
                return exports.qbx_core:RemoveMoney(Player.PlayerData.source, moneyType, amount)
            end
            return false
        end
        
        -- Notify Player
        function Bridge.Notify(message, type, duration)
            exports.qbx_core:Notify(message, type, duration or 5000)
        end
        
        -- Register Usable Item (if needed)
        function Bridge.RegisterUsableItem(itemName, callback)
            exports.qbx_core:CreateUseableItem(itemName, callback)
        end
        
        Config.Framework = 'QBOX'
    end
end
