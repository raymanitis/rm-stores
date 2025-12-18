import { useEffect } from 'react';
import { Transition, Flex, useMantineTheme } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import useAppVisibilityStore from '../../stores/appVisibilityStore';
import { ShopInterface } from '../Shop/ShopInterface';
import { useShopStore } from '../../stores/shopStore';
import { fetchNui } from '../../utils/fetchNui';

export function UI() {
  const theme = useMantineTheme();
  const { showApp, setVisibility, hide } = useAppVisibilityStore();
  const { setShopData, clearCart } = useShopStore();

  // Handle ESC key to close UI
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showApp) {
        fetchNui('hideApp');
        hide();
      }
    };

    if (showApp) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showApp, hide]);

  useNuiEvent<boolean>('UPDATE_VISIBILITY', (data) => {
    setVisibility(data);
    // Clear cart when shop is closed
    if (!data) {
      clearCart();
    }
  });
  
  // Also clear cart when component unmounts or shop closes
  useEffect(() => {
    if (!showApp) {
      clearCart();
    }
  }, [showApp, clearCart]);

  useNuiEvent<{
    shopName: string;
    items: any[];
    categories: string[];
    cashBalance: number;
    bankBalance: number;
  }>('SET_SHOP_DATA', (data) => {
    // Clear cart when opening shop (fresh start)
    clearCart();
    
    // Convert items from config format to UI format
    const formattedItems = data.items.map((item, index) => ({
      id: `${item.name}-${index}`,
      name: item.name,
      description: item.description || `A ${item.name}`,
      price: item.price,
      // Preserve zero stock; only fall back when value is null/undefined
      stock: item.stock ?? item.defaultStock ?? 0,
      icon: '📦',
      category: item.category || 'Misc',
    }));
    
    setShopData({
      items: formattedItems,
      categories: data.categories || [],
      cashBalance: data.cashBalance || 0,
      bankBalance: data.bankBalance || 0,
      shopName: data.shopName,
    });
  });
  
  return (
    <Transition 
      mounted={showApp} 
      transition="slide-down"
      duration={300}
      timingFunction="ease-out"
    >
      {(transStyles) => (
        <Flex
          pos="fixed"
          w="100vw"
          h="100vh"
          style={{
            pointerEvents: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            ...transStyles,
          }}
        >
          <div>
            <ShopInterface />
          </div>
        </Flex>
      )}
    </Transition>
  );
}