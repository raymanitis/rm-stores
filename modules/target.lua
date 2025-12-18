local Target = {}

-- Auto-detect target system
if Config.Target == 'auto' then
    if GetResourceState('ox_target') == 'started' then
        Config.Target = 'ox_target'
    elseif GetResourceState('qb-target') == 'started' then
        Config.Target = 'qb-target'
    end
end

-- Initialize Target if not detected
if not Config.Target or Config.Target == 'auto' then
    print('[SHOP] Warning: No target system detected!')
end

if Config.Target == 'ox_target' then
    -- OX Target Functions
    function Target.AddModel(models, options)
        -- Convert options format for ox_target
        local formattedOptions = {}
        for _, option in ipairs(options) do
            table.insert(formattedOptions, {
                name = option.name,
                label = option.label,
                icon = option.icon or 'fas fa-circle',
                onSelect = option.action or function() end,
            })
        end
        exports.ox_target:addModel(models, formattedOptions)
    end
    
    function Target.AddLocalEntity(entity, options)
        -- Convert options format for ox_target
        local formattedOptions = {}
        for _, option in ipairs(options) do
            table.insert(formattedOptions, {
                name = option.name,
                label = option.label,
                icon = option.icon or 'fas fa-circle',
                onSelect = option.action or function() end,
            })
        end
        exports.ox_target:addLocalEntity(entity, formattedOptions)
    end
    
    function Target.AddZone(name, coords, size, options)
        local formattedOptions = {}
        for _, option in ipairs(options) do
            table.insert(formattedOptions, {
                name = option.name,
                label = option.label,
                icon = option.icon or 'fas fa-circle',
                onSelect = option.action or function() end,
            })
        end
        exports.ox_target:addSphereZone(name, coords, size, formattedOptions)
    end
    
elseif Config.Target == 'qb-target' then
    -- QB Target Functions
    function Target.AddModel(models, options)
        exports['qb-target']:AddTargetModel(models, {
            options = options,
            distance = 2.0
        })
    end
    
    function Target.AddLocalEntity(entity, options)
        exports['qb-target']:AddTargetEntity(entity, {
            options = options,
            distance = 2.0
        })
    end
    
    function Target.AddZone(name, coords, size, options)
        exports['qb-target']:AddCircleZone(name, coords, size, {
            name = name,
            debugPoly = false,
            useZ = true,
        }, {
            options = options,
            distance = 2.0
        })
    end
end

return Target

