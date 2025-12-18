-- Load bridge
if Config.Framework == 'auto' or Config.Framework == 'QB' then
    require 'bridge.server.qb'
end

if Config.Framework == 'auto' or Config.Framework == 'QBOX' then
    require 'bridge.server.qbox'
end

local Inventory = require 'modules.inventory'

-- Stock storage (resets on script restart)
local StockData = {}

-- Initialize stock on resource start
CreateThread(function()
    Wait(500) -- Small wait for everything to initialize
    
    -- Initialize/reset stock for all shops (always reset to default on restart)
    for shopName, shopItems in pairs(ShopItems) do
        StockData[shopName] = {}
        for _, item in ipairs(shopItems) do
            -- Always reset to default stock on script restart
            StockData[shopName][item.name] = item.defaultStock or 100
        end
    end
    
    print('[SHOP] Stock initialized - all stocks reset to default')
end)

-- Function to get stock for an item
local function GetItemStock(shopName, itemName)
    if not StockData[shopName] then
        return 0
    end
    return StockData[shopName][itemName] or 0
end

-- Function to set stock for an item
local function SetItemStock(shopName, itemName, stock)
    if not StockData[shopName] then
        StockData[shopName] = {}
    end
    StockData[shopName][itemName] = stock
    
    -- Sync to all clients
    TriggerClientEvent('shop:updateStock', -1, shopName, itemName, stock)
end

-- Function to decrease stock for an item
local function DecreaseItemStock(shopName, itemName, quantity)
    local currentStock = GetItemStock(shopName, itemName)
    local newStock = math.max(0, currentStock - quantity)
    SetItemStock(shopName, itemName, newStock)
    return newStock
end

-- Function to get categories from shop items
local function GetCategories(shopName)
    local categories = {}
    local items = ShopItems[shopName]
    
    if not items then return categories end
    
    for _, item in ipairs(items) do
        if item.category and not categories[item.category] then
            categories[item.category] = true
        end
    end
    
    -- Convert to array
    local categoryList = {}
    for category, _ in pairs(categories) do
        table.insert(categoryList, category)
    end
    
    table.sort(categoryList)
    return categoryList
end

-- Function to get shop items with current stock
local function GetShopItemsWithStock(shopName)
    local items = ShopItems[shopName]
    if not items then return nil end
    
    local itemsWithStock = {}
    for _, item in ipairs(items) do
        local stock = GetItemStock(shopName, item.name)
        table.insert(itemsWithStock, {
            name = item.name,
            price = item.price,
            stock = stock,
            defaultStock = item.defaultStock or 100,
            category = item.category
        })
    end
    
    return itemsWithStock
end

-- Purchase items handler
RegisterNetEvent('shop:purchaseItems', function(data)
    local source = source
    local shopName = data.shopName
    local cart = data.cart
    local paymentMethod = data.paymentMethod
    
    if not shopName or not cart or #cart == 0 then
        TriggerClientEvent('shop:purchaseResponse', source, false, 'Invalid purchase data')
        return
    end
    
    local shopItems = ShopItems[shopName]
    if not shopItems then
        TriggerClientEvent('shop:purchaseResponse', source, false, 'Shop not found')
        return
    end
    
    -- Calculate total and check stock
    local total = 0
    local purchaseItems = {}
    
    for _, cartItem in ipairs(cart) do
        local itemFound = false
        for _, shopItem in ipairs(shopItems) do
            if shopItem.name == cartItem.itemName then
                itemFound = true
                
                -- Check stock availability
                local currentStock = GetItemStock(shopName, cartItem.itemName)
                if currentStock < cartItem.quantity then
                    TriggerClientEvent('shop:purchaseResponse', source, false, 'Not enough stock for ' .. cartItem.itemName .. '. Available: ' .. currentStock)
                    return
                end
                
                local itemTotal = shopItem.price * cartItem.quantity
                total = total + itemTotal
                
                table.insert(purchaseItems, {
                    name = shopItem.name,
                    quantity = cartItem.quantity,
                    price = shopItem.price
                })
                break
            end
        end
        
        if not itemFound then
            TriggerClientEvent('shop:purchaseResponse', source, false, 'Item not found: ' .. cartItem.itemName)
            return
        end
    end
    
    -- Check if player has enough money
    if not Bridge or not Bridge.GetMoney then
        TriggerClientEvent('shop:purchaseResponse', source, false, 'Framework not initialized')
        return
    end
    
    local playerMoney = Bridge.GetMoney(source, paymentMethod)
    if playerMoney < total then
        TriggerClientEvent('shop:purchaseResponse', source, false, 'Insufficient funds')
        return
    end
    
    -- Check if player can carry items
    for _, purchaseItem in ipairs(purchaseItems) do
        if not Inventory.CanCarryItem(source, purchaseItem.name, purchaseItem.quantity) then
            TriggerClientEvent('shop:purchaseResponse', source, false, 'Cannot carry item: ' .. purchaseItem.name)
            return
        end
    end
    
    -- Remove money
    if not Bridge.RemoveMoney(source, paymentMethod, total) then
        TriggerClientEvent('shop:purchaseResponse', source, false, 'Failed to remove money')
        return
    end
    
    -- Add items to inventory and decrease stock
    for _, purchaseItem in ipairs(purchaseItems) do
        if not Inventory.AddItem(source, purchaseItem.name, purchaseItem.quantity) then
            -- Refund money if item addition fails
            if Bridge.AddMoney then
                Bridge.AddMoney(source, paymentMethod, total)
            end
            TriggerClientEvent('shop:purchaseResponse', source, false, 'Failed to add item: ' .. purchaseItem.name)
            return
        end
        
        -- Decrease stock after successful item addition
        DecreaseItemStock(shopName, purchaseItem.name, purchaseItem.quantity)
    end
    
    -- Success
    if Bridge.Notify then
        Bridge.Notify(source, 'Purchase successful! Total: $' .. total, 'success')
    end
    TriggerClientEvent('shop:purchaseResponse', source, true, 'Purchase successful!')
end)

-- Server event to get shop data
RegisterNetEvent('shop:getShopData', function(shopName)
    local source = source
    local itemsWithStock = GetShopItemsWithStock(shopName)
    local categories = GetCategories(shopName)
    
    if not itemsWithStock then
        TriggerClientEvent('shop:shopDataResponse', source, false, 'Shop not found')
        return
    end
    
    TriggerClientEvent('shop:shopDataResponse', source, true, {
        shopName = shopName,
        items = itemsWithStock,
        categories = categories
    })
end)

