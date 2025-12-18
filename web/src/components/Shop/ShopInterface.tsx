import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Group, 
  TextInput, 
  Select, 
  ActionIcon, 
  Stack,
  useMantineTheme,
  Grid,
  ScrollArea,
  Card,
  Button,
  Badge,
  SegmentedControl
} from '@mantine/core';
import {
  ShoppingCart, 
  Search, 
  ChevronDown,
  Heart,
  Plus,
  Minus,
  Trash2,
  X
} from 'lucide-react';
import { IconPackage } from '@tabler/icons-react';
import { useShopStore } from '../../stores/shopStore';
import { fetchNui } from '../../utils/fetchNui';
import useAppVisibilityStore from '../../stores/appVisibilityStore';

export function ShopInterface() {
  const theme = useMantineTheme();
  const { hide } = useAppVisibilityStore();
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    getFilteredItems,
    items,
    categories,
    cart,
    paymentMethod,
    setPaymentMethod,
    cashBalance,
    bankBalance,
    shopName,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    toggleFavorite,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useShopStore();

  const handleClose = () => {
    clearCart(); // Clear cart when closing shop
    fetchNui('hideApp');
    hide();
  };

  const categoriesList = ['All Items', ...categories];
  const currentBalance = paymentMethod === 'cash' ? cashBalance : bankBalance;
  const cartTotal = getCartTotal();
  const cartItemCount = getCartItemCount();

  const filteredItems = getFilteredItems();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    const cartData = cart.map(cartItem => ({
      itemName: cartItem.item.name,
      quantity: cartItem.quantity,
    }));

    try {
      await fetchNui('purchaseItems', {
        shopName: shopName,
        cart: cartData,
        paymentMethod: paymentMethod,
        total: cartTotal,
      });
      
      clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div style={{ 
      width: '76vw', 
      height: '80vh', 
      margin: '0 auto',
      padding: '8px',
      overflow: 'hidden'
    }}>
      <Paper 
        p="sm" 
        style={{ 
          height: '100%',
          width: '100%',
          backgroundColor: theme.colors.dark[8],
          borderRadius: theme.radius.md,
          border: `2px solid ${theme.colors.dark[6]}`,
          overflow: 'hidden'
        }}
      >
        <Stack gap="xs" style={{ height: '100%' }}>
          {/* Header */}
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ShoppingCart size={20} color={theme.colors.blue[4]} />
              <Title order={3} c="white">24/7 Store</Title>
            </Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={handleClose}
              style={{
                color: theme.colors.dark[2],
                '&:hover': {
                  backgroundColor: theme.colors.dark[6],
                  color: 'white',
                },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </Group>
          
          <Text size="xs" c="blue.4">• Open 24/7 • Fast Service</Text>

          {/* Search and Filters */}
          <Group gap="sm" wrap="nowrap">
            <TextInput
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<Search size={16} />}
              style={{ flex: 1 }}
              styles={{
                input: {
                  backgroundColor: theme.colors.dark[6],
                  borderColor: theme.colors.dark[5],
                  color: 'white',
                  '&::placeholder': {
                    color: theme.colors.dark[3],
                  },
                },
              }}
            />
            
            <Select
              value={
                sortBy === 'name' ? 'Name (A-Z)' : 
                sortBy === 'price-high' ? 'Price (High-Low)' : 
                'Price (Low-High)'
              }
              onChange={(value) => {
                if (value === 'Name (A-Z)') {
                  setSortBy('name');
                } else if (value === 'Price (High-Low)') {
                  setSortBy('price-high');
                } else {
                  setSortBy('price');
                }
              }}
              data={['Name (A-Z)', 'Price (Low-High)', 'Price (High-Low)']}
              rightSection={<ChevronDown size={16} />}
              styles={{
                input: {
                  backgroundColor: theme.colors.dark[6],
                  borderColor: theme.colors.dark[5],
                  color: 'white',
                },
              }}
            />
            
            <Select
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value || 'All Items')}
              data={categoriesList}
              rightSection={<ChevronDown size={16} />}
              styles={{
                input: {
                  backgroundColor: theme.colors.dark[6],
                  borderColor: theme.colors.dark[5],
                  color: 'white',
                },
              }}
            />
          </Group>

          {/* Main Content Area */}
          <div style={{ height: 'calc(100% - 160px)', overflow: 'hidden', display: 'flex', marginTop: '12px', marginBottom: '4px' }}>
            <Grid gutter="md" style={{ height: '100%', width: '100%', margin: 0, display: 'flex' }}>
              {/* Items List */}
              <Grid.Col span={6} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card
                  p="sm"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.dark[5]}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ 
                    height: '100%',
                    flex: 1,
                    overflow: 'hidden',
                    backgroundColor: theme.colors.dark[7],
                    borderRadius: theme.radius.sm,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <ScrollArea 
                      h="100%"
                      scrollbarSize={6} 
                      offsetScrollbars
                      styles={{
                        root: {
                          height: '100%',
                        },
                        viewport: {
                          backgroundColor: theme.colors.dark[7],
                          height: '100%',
                        },
                        scrollbar: {
                          marginRight: '-1px',
                        },
                        thumb: {
                          backgroundColor: theme.colors.dark[1],
                          '&:hover': {
                            backgroundColor: theme.colors.dark[1],
                          },
                        },
                      }}
                    >
                    <Grid gutter="sm" style={{ padding: '8px 12px 4px 8px' }}>
                      {filteredItems.map((item) => (
                        <Grid.Col span={3} key={item.id}>
                        <Card
                          p={0}
                          style={{
                            backgroundColor: theme.colors.dark[6],
                            borderRadius: theme.radius.sm,
                            height: '280px',
                            width: '100%',
                            border: `1px solid ${theme.colors.dark[4]}`,
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: theme.colors.dark[5],
                              border: `1px solid ${theme.colors.blue[4]}`,
                              transform: 'translateY(-1px)',
                            },
                          }}
                          onClick={() => addToCart(item)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.dark[5];
                            e.currentTarget.style.border = `1px solid ${theme.colors.blue[4]}`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.dark[6];
                            e.currentTarget.style.border = `1px solid ${theme.colors.dark[4]}`;
                            e.currentTarget.style.transform = 'translateY(0px)';
                          }}
                        >
                          {/* Item Image - Full Width Top */}
                          <div style={{
                            width: '100%',
                            height: '120px',
                            backgroundColor: theme.colors.dark[7],
                            borderRadius: `${theme.radius.sm} ${theme.radius.sm} 0 0`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px',
                          }}>
                            <img 
                              src={`nui://ox_inventory/web/images/${item.name}.png`}
                              alt={item.name}
                              style={{
                                maxWidth: '80px',
                                maxHeight: '80px',
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                const currentSrc = e.currentTarget.src;
                                const itemNameLower = item.name.toLowerCase();
                                const itemNameUnderscore = itemNameLower.replace(/\s+/g, '_');
                                
                                // Try 1: underscore version with .png (if not already tried)
                                if (currentSrc.includes(item.name) && !currentSrc.includes('_')) {
                                  e.currentTarget.src = `nui://ox_inventory/web/images/${itemNameUnderscore}.png`;
                                  return;
                                }
                                // Try 2: .webp extension with original name
                                if (currentSrc.includes('.png') && currentSrc.includes(item.name)) {
                                  e.currentTarget.src = `nui://ox_inventory/web/images/${item.name}.webp`;
                                  return;
                                }
                                // Try 3: underscore version with .webp
                                if (currentSrc.includes('.webp') && currentSrc.includes(item.name) && !currentSrc.includes('_')) {
                                  e.currentTarget.src = `nui://ox_inventory/web/images/${itemNameUnderscore}.webp`;
                                  return;
                                }
                                // If all fail, show fallback
                                e.currentTarget.style.display = 'none';
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'block';
                                }
                              }}
                            />
                            <div style={{ 
                              display: 'none',
                              fontSize: '48px',
                              color: theme.colors.dark[3],
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              📦
                            </div>
                          </div>

                          {/* Item Details Section */}
                          <div style={{
                            padding: '10px',
                            height: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}>
                            {/* Item Name - Left Bottom of Image */}
                            <div>
                              <Text fw={600} c="white" size="md" mb="4px">
                                {item.name}
                              </Text>
                              <Text 
                                size="xs" 
                                c="dimmed" 
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  lineHeight: '1.3',
                                }}
                              >
                                {item.description}
                              </Text>
                            </div>

                            {/* Price */}
                            <div style={{
                              marginTop: '8px',
                            }}>
                              <Text fw={600} c="white" size="sm">
                                ${item.price}
                              </Text>
                            </div>
                          </div>

                          {/* Stock Indicator - Bottom Right */}
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            padding: '3px 6px',
                            borderRadius: '3px',
                          }}>
                            <IconPackage size={14} color="white" stroke={2} />
                            <Text fw={500} c="white" size="xs">
                              {item.stock}
                            </Text>
                          </div>
                        </Card>
                      </Grid.Col>
                    ))}
                    </Grid>
                    </ScrollArea>
                  </div>
                </Card>
              </Grid.Col>

              {/* Shopping Cart */}
              <Grid.Col span={6} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card
                  p="sm"
                  style={{
                    height: '100%',
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.dark[5]}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack gap="xs" style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Title order={4} c="white" style={{ flexShrink: 0, marginBottom: '4px' }}>Shopping Cart</Title>

                    {/* Cart Content - Flexible Area */}
                    <div style={{ 
                      flex: 1,
                      overflow: 'hidden',
                      minHeight: 0,
                      backgroundColor: theme.colors.dark[7],
                      borderRadius: theme.radius.sm,
                    }}>
                      {cart.length === 0 ? (
                        <Stack align="center" justify="center" style={{ height: '100%' }}>
                          <ShoppingCart size={40} color={theme.colors.dark[4]} />
                          <Text c="white" fw={500} size="sm">Your cart is empty</Text>
                          <Text size="xs" c="dimmed">Add items from the store</Text>
                        </Stack>
                      ) : (
                        <ScrollArea 
                          h="100%" 
                          scrollbarSize={6}
                          styles={{
                            scrollbar: {
                              marginRight: '-1px',
                            },
                            thumb: {
                              backgroundColor: theme.colors.dark[1],
                              '&:hover': {
                                backgroundColor: theme.colors.dark[1],
                              },
                            },
                          }}
                        >
                          <Stack gap="xs" p="xs" style={{ minHeight: '100%', justifyContent: 'flex-end' }}>
                            {cart.map((cartItem) => (
                              <Card
                                key={cartItem.item.id}
                                p="sm"
                                style={{
                                  backgroundColor: theme.colors.dark[6],
                                  borderRadius: theme.radius.sm,
                                  border: `1px solid ${theme.colors.dark[4]}`,
                                }}
                              >
                                <Group justify="space-between" align="center">
                                  <Group gap="sm" style={{ flex: 1 }}>
                                    <div style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '4px',
                                      backgroundColor: theme.colors.dark[5],
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: `1px solid ${theme.colors.dark[4]}`,
                                    }}>
                                      <img 
                                        src={`nui://ox_inventory/web/images/${cartItem.item.name}.png`}
                                        alt={cartItem.item.name}
                                        style={{
                                          width: '20px',
                                          height: '20px',
                                          objectFit: 'contain'
                                        }}
                                        onError={(e) => {
                                          const currentSrc = e.currentTarget.src;
                                          const itemName = cartItem.item.name;
                                          const itemNameLower = itemName.toLowerCase();
                                          const itemNameUnderscore = itemNameLower.replace(/\s+/g, '_');
                                          
                                          // Try 1: underscore version with .png (if not already tried)
                                          if (currentSrc.includes(itemName) && !currentSrc.includes('_')) {
                                            e.currentTarget.src = `nui://ox_inventory/web/images/${itemNameUnderscore}.png`;
                                            return;
                                          }
                                          // Try 2: .webp extension with original name
                                          if (currentSrc.includes('.png') && currentSrc.includes(itemName)) {
                                            e.currentTarget.src = `nui://ox_inventory/web/images/${itemName}.webp`;
                                            return;
                                          }
                                          // Try 3: underscore version with .webp
                                          if (currentSrc.includes('.webp') && currentSrc.includes(itemName) && !currentSrc.includes('_')) {
                                            e.currentTarget.src = `nui://ox_inventory/web/images/${itemNameUnderscore}.webp`;
                                            return;
                                          }
                                          // If all fail, show fallback
                                          e.currentTarget.style.display = 'none';
                                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (nextElement) {
                                            nextElement.style.display = 'block';
                                          }
                                        }}
                                      />
                                      <Text size="sm" style={{ display: 'none' }}>
                                        📦
                                      </Text>
                                    </div>
                                    <Stack gap={2} style={{ flex: 1 }}>
                                      <Text fw={500} c="white" size="sm">{cartItem.item.name}</Text>
                                      <Text size="xs" c="dimmed">${cartItem.item.price} each</Text>
                                    </Stack>
                                  </Group>
                                  
                                  <Group gap="xs" align="center">
                                    <ActionIcon
                                      variant="filled"
                                      color="blue"
                                      size="sm"
                                      onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                      style={{
                                        backgroundColor: theme.colors.blue[6],
                                        border: `1px solid ${theme.colors.blue[5]}`,
                                      }}
                                    >
                                      <Minus size={12} />
                                    </ActionIcon>
                                    
                                    <TextInput
                                      value={cartItem.quantity.toString()}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value > 0) {
                                          updateCartQuantity(cartItem.item.id, value);
                                        } else if (e.target.value === '') {
                                          // Allow empty for editing
                                        }
                                      }}
                                      onBlur={(e) => {
                                        if (e.target.value === '' || parseInt(e.target.value) <= 0) {
                                          updateCartQuantity(cartItem.item.id, 1);
                                        }
                                      }}
                                      size="xs"
                                      styles={{
                                        input: {
                                          width: '45px',
                                          minWidth: '45px',
                                          textAlign: 'center',
                                          padding: '4px',
                                          backgroundColor: theme.colors.dark[6],
                                          borderColor: theme.colors.dark[4],
                                          color: 'white',
                                          fontWeight: 500,
                                          '&:focus': {
                                            borderColor: theme.colors.blue[4],
                                          },
                                        },
                                      }}
                                    />
                                    
                                    <ActionIcon
                                      variant="filled"
                                      color="blue"
                                      size="sm"
                                      onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                      style={{
                                        backgroundColor: theme.colors.blue[6],
                                        border: `1px solid ${theme.colors.blue[5]}`,
                                      }}
                                    >
                                      <Plus size={12} />
                                    </ActionIcon>
                                    
                                    <ActionIcon
                                      variant="filled"
                                      color="red"
                                      size="sm"
                                      onClick={() => removeFromCart(cartItem.item.id)}
                                      style={{
                                        backgroundColor: theme.colors.red[6],
                                        border: `1px solid ${theme.colors.red[5]}`,
                                      }}
                                    >
                                      <Trash2 size={12} />
                                    </ActionIcon>
                                  </Group>
                                </Group>
                              </Card>
                            ))}
                          </Stack>
                        </ScrollArea>
                      )}
                    </div>

                    {/* Payment Section - Fixed at Bottom */}
                    <div style={{ 
                      flexShrink: 0,
                      backgroundColor: theme.colors.dark[7],
                      padding: '10px',
                      borderRadius: theme.radius.sm,
                      borderTop: `1px solid ${theme.colors.dark[5]}`,
                      transition: 'all 0.3s ease',
                      marginTop: '4px',
                    }}>
                      <Stack gap="xs">
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Payment Method</Text>
                        
                        <SegmentedControl
                          value={paymentMethod}
                          onChange={(value) => setPaymentMethod(value as 'cash' | 'bank')}
                          data={[
                            { label: 'Cash', value: 'cash' },
                            { label: 'Bank', value: 'bank' },
                          ]}
                          styles={{
                            root: {
                              backgroundColor: theme.colors.dark[6],
                              border: `1px solid ${theme.colors.dark[4]}`,
                            },
                            control: {
                              '&[data-active]': {
                                backgroundColor: theme.colors.blue[6],
                                color: 'white',
                                border: `1px solid ${theme.colors.blue[4]}`,
                              },
                            },
                          }}
                        />
                        
                        <Group justify="space-between">
                          <Text c="white" size="sm">Balance</Text>
                          <Text c="white" size="sm">${currentBalance.toLocaleString()}</Text>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text c="white" fw={600} size="sm">Total</Text>
                          <Text c="white" fw={600} size="sm">${cartTotal}</Text>
                        </Group>
                        
                        <Button
                          fullWidth
                          size="sm"
                          disabled={cart.length === 0}
                          onClick={handleCheckout}
                          color="green"
                          style={{
                            backgroundColor: theme.colors.green[6],
                            color: 'white',
                            border: `1px solid ${theme.colors.green[5]}`,
                            '&:hover': {
                              backgroundColor: theme.colors.green[5],
                            },
                            '&:disabled': {
                              backgroundColor: theme.colors.dark[7],
                              color: theme.colors.dark[3],
                              border: `1px solid ${theme.colors.dark[4]}`,
                            },
                          }}
                        >
                          Checkout
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </div>
        </Stack>
      </Paper>
    </div>
  );
}
