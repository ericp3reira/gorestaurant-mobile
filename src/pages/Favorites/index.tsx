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

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const { data } = await api.get('favorites');

        setError(false);

        setFavorites(
          data.map((item: Food) => ({
            ...item,
            formattedPrice: formatValue(item.price),
          })),
        );
      } catch (err) {
        setError(true);
      }
    };

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      {error ? (
        <ErrorMessage>Oops... falha ao buscar os favoritos</ErrorMessage>
      ) : (
        <FoodsContainer>
          <FoodList
            data={favorites}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Food activeOpacity={0.6}>
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

export default Favorites;
