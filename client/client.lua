local utils = require 'modules.utils'

-- Load bridge
if Config.Framework == 'auto' or Config.Framework == 'QB' then
    require 'bridge.client.qb'
end

if Config.Framework == 'auto' or Config.Framework == 'QBOX' then
    require 'bridge.client.qbox'
end

local Target = require 'modules.target'

local CurrentShop = nil
local ShopPed = {}

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

-- Function to get shop items
local function GetShopItems(shopName)
    return ShopItems[shopName] or {}
end

-- Function to close shop with animation
local function CloseShop()
    if not CurrentShop then return end
    
    -- Send close signal to NUI for animation
    utils.SendReactMessage('UPDATE_VISIBILITY', false)
    
    -- Wait for animation to finish (300ms) before disabling focus
    CreateThread(function()
        Wait(300)
        SetNuiFocus(false, false)
        CurrentShop = nil
    end)
end

-- Function to open shop
local function OpenShop(shopName)
    if not ShopItems[shopName] then
        if Bridge and Bridge.Notify then
            Bridge.Notify('Shop not found', 'error')
        end
        return
    end
    
    CurrentShop = shopName
    
    -- Request shop data with stock from server
    TriggerServerEvent('shop:getShopData', shopName)
end

-- Handle shop data response from server
RegisterNetEvent('shop:shopDataResponse', function(success, data)
    if not success or not data then
        if Bridge and Bridge.Notify then
            Bridge.Notify('Failed to load shop data', 'error')
        end
        return
    end
    
    if CurrentShop ~= data.shopName then return end
    
    -- Get player money
    local cashBalance = 0
    local bankBalance = 0
    if Bridge and Bridge.GetMoney then
        cashBalance = Bridge.GetMoney('cash')
        bankBalance = Bridge.GetMoney('bank')
    end
    
    -- Send data to NUI with stock
    utils.SendReactMessage('SET_SHOP_DATA', {
        shopName = data.shopName,
        items = data.items,
        categories = data.categories,
        cashBalance = cashBalance,
        bankBalance = bankBalance
    })
    
    utils.ShowNUI('UPDATE_VISIBILITY', true)
end)

-- Handle stock updates from server
RegisterNetEvent('shop:updateStock', function(shopName, itemName, stock)
    -- Only update if this shop is currently open
    if CurrentShop == shopName then
        -- Request updated shop data
        TriggerServerEvent('shop:getShopData', shopName)
    end
end)

-- Create shop peds and targets
CreateThread(function()
    -- Wait for player to spawn
    while not NetworkIsPlayerActive(PlayerId()) do
        Wait(100)
    end
    
    -- Wait a bit more for everything to initialize
    Wait(2000)
    
    -- Function to load ped model
    local function LoadPedModel(model)
        if type(model) == "string" then
            model = GetHashKey(model)
        end
        RequestModel(model)
        while not HasModelLoaded(model) do
            Wait(10)
        end
        return model
    end
    
    -- Function to create shop ped
    local function CreateShopPed(model, coord, shopName, shopData)
        local modelHash = LoadPedModel(model)
        if not modelHash then return end
        
        local ped = CreatePed(4, modelHash, coord.x, coord.y, coord.z - 1.0, coord.w, false, true)
        
        if ped and ped ~= 0 then
            FreezeEntityPosition(ped, true)
            SetEntityInvincible(ped, true)
            SetBlockingOfNonTemporaryEvents(ped, true)
            SetPedFleeAttributes(ped, 0, false)
            SetPedCombatAttributes(ped, 17, true)
            
            table.insert(ShopPed, ped)
            
            -- Add blip
            if shopData.bip then
                local blip = AddBlipForCoord(coord.x, coord.y, coord.z)
                SetBlipSprite(blip, shopData.bip.sprite)
                SetBlipColour(blip, shopData.bip.color)
                SetBlipScale(blip, shopData.bip.scale)
                SetBlipAsShortRange(blip, true)
                BeginTextCommandSetBlipName("STRING")
                AddTextComponentString(shopData.label)
                EndTextCommandSetBlipName(blip)
            end
            
            return ped
        end
        return nil
    end
    
    -- Create all shop peds
    for shopName, shopData in pairs(Locations) do
        for _, coord in ipairs(shopData.coords) do
            local ped = CreateShopPed(shopData.model[1], coord, shopName, shopData)
            
            -- Add target option per ped
            if ped and ped ~= 0 and Target and Target.AddLocalEntity then
                Target.AddLocalEntity(ped, {
                    {
                        name = shopName .. '_' .. #ShopPed,
                        label = shopData.label,
                        icon = 'fas fa-shopping-cart',
                        action = function()
                            OpenShop(shopData.shopItems)
                        end,
                    }
                })
            end
        end
    end
    
    print('[SHOP] Initialized ' .. #ShopPed .. ' shop peds')
end)

-- NUI Callbacks
RegisterNuiCallback('hideApp', function(data, cb)
    CloseShop()
    cb(true)
end)

RegisterNuiCallback('getShopData', function(data, cb)
    local shopName = data.shopName or CurrentShop
    if not shopName then
        cb({ success = false, error = 'No shop selected' })
        return
    end
    
    local items = GetShopItems(shopName)
    local categories = GetCategories(shopName)
    local cashBalance = 0
    local bankBalance = 0
    if Bridge and Bridge.GetMoney then
        cashBalance = Bridge.GetMoney('cash')
        bankBalance = Bridge.GetMoney('bank')
    end
    
    cb({
        success = true,
        shopName = shopName,
        items = items,
        categories = categories,
        cashBalance = cashBalance,
        bankBalance = bankBalance
    })
end)

RegisterNuiCallback('purchaseItems', function(data, cb)
    if not data.shopName then
        data.shopName = CurrentShop
    end
    TriggerServerEvent('shop:purchaseItems', data)
    cb(true)
end)

-- Handle purchase response
RegisterNetEvent('shop:purchaseResponse', function(success, message)
    if Bridge and Bridge.Notify then
        if success then
            Bridge.Notify(message or 'Purchase successful!', 'success')
            -- Refresh shop data from server (with updated stock)
            if CurrentShop then
                TriggerServerEvent('shop:getShopData', CurrentShop)
            end
        else
            Bridge.Notify(message or 'Purchase failed!', 'error')
        end
    end
end)

-- Handle ESC key to close shop
CreateThread(function()
    while true do
        Wait(0)
        if CurrentShop then
            if IsControlJustPressed(0, 322) then -- ESC key
                CloseShop()
            end
        else
            Wait(500)
        end
    end
end)
