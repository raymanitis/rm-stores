-- Initialize Bridge if not exists
if not Bridge then
    Bridge = {}
end

-- Check if Qbox exists and should be used
if Config.Framework == 'auto' or Config.Framework == 'QBOX' then
    if GetResourceState('qbx_core') == 'started' then
        local QBX = exports.qbx_core
        
        Bridge.Framework = 'QBOX'
        
        -- Get Player by Source
        function Bridge.GetPlayer(source)
            return QBX:GetPlayer(source)
        end
        
        -- Remove Money from Player
        function Bridge.RemoveMoney(source, moneyType, amount)
            return QBX:RemoveMoney(source, moneyType, amount)
        end
        
        -- Get Player Money
        function Bridge.GetMoney(source, moneyType)
            local Player = QBX:GetPlayer(source)
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
            exports.qbx_core:Notify(message, type, duration or 5000)
        end
        
        -- Add Money to Player
        function Bridge.AddMoney(source, moneyType, amount)
            return QBX:AddMoney(source, moneyType, amount)
        end
        
        Config.Framework = 'QBOX'
    end
end
