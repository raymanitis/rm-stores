local Inventory = {}

-- Initialize Bridge if not exists
if not Bridge then
    Bridge = {}
end

-- Auto-detect inventory system
if Config.Inventory == 'auto' then
    if GetResourceState('ox_inventory') == 'started' then
        Config.Inventory = 'ox_inventory'
    elseif GetResourceState('qb-inventory') == 'started' then
        Config.Inventory = 'qb-inventory'
    end
end

if Config.Inventory == 'ox_inventory' then
    -- OX Inventory Functions
    function Inventory.AddItem(source, item, count, metadata)
        return exports.ox_inventory:AddItem(source, item, count, metadata)
    end
    
    function Inventory.CanCarryItem(source, item, count)
        return exports.ox_inventory:CanCarryItem(source, item, count)
    end
    
    function Inventory.GetItem(source, item)
        return exports.ox_inventory:GetItem(source, item, false)
    end
    
    function Inventory.GetItemCount(source, item)
        local itemData = exports.ox_inventory:GetItem(source, item, false)
        return itemData and itemData.count or 0
    end
    
    function Inventory.RemoveItem(source, item, count, metadata)
        return exports.ox_inventory:RemoveItem(source, item, count, metadata)
    end
    
    function Inventory.Search(source, search, count)
        return exports.ox_inventory:Search(source, search, count)
    end
    
elseif Config.Inventory == 'qb-inventory' then
    -- QB Inventory Functions
    function Inventory.AddItem(source, item, count, metadata)
        local Player = Bridge.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.AddItem(item, count, false, metadata or {})
    end
    
    function Inventory.CanCarryItem(source, item, count)
        local Player = Bridge.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.CanCarryItem(item, count)
    end
    
    function Inventory.GetItem(source, item)
        local Player = Bridge.GetPlayer(source)
        if not Player then return nil end
        return Player.Functions.GetItemByName(item)
    end
    
    function Inventory.GetItemCount(source, item)
        local itemData = Inventory.GetItem(source, item)
        return itemData and itemData.amount or 0
    end
    
    function Inventory.RemoveItem(source, item, count, metadata)
        local Player = Bridge.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.RemoveItem(item, count, false, metadata or {})
    end
    
    function Inventory.Search(source, search, count)
        local Player = Bridge.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.GetItemsByName(search)
    end
end

return Inventory

