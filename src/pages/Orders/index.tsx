import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  ErrorMessage,
} from './styles';

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOrders = async (): Promise<void> => {
      try {
        const { data } = await api.get('orders');

        setError(false);

        setOrders(
          data.map((item: Order) => ({
            ...item,
            formattedPrice: formatValue(item.price),
          })),
        );
      } catch (err) {
        setError(true);
      }
    };

    loadOrders();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      {error ? (
        <ErrorMessage>Oops... falha ao buscar os favoritos</ErrorMessage>
      ) : (
        <FoodsContainer>
          <FoodList
            data={orders}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Food key={item.id} activeOpacity={0.6}>
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: item.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{item.name}</FoodTitle>
                  <FoodDescription>{item.description}</FoodDescription>
                  <FoodPricing>{item.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            )}
          />
        </FoodsContainer>
      )}
    </Container>
  );
};

export default Orders;
