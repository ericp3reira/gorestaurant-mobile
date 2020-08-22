import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
  ErrorMessage,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [error, setError] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const loadFood = async (): Promise<void> => {
      try {
        const { data } = await api.get(`foods/${routeParams.id}`);

        setError(false);

        setFood(data);
        setExtras(data.extras.map((item: Extra) => ({ ...item, quantity: 0 })));
      } catch (err) {
        setError(true);
      }
    };

    loadFood();
  }, [routeParams]);

  function handleIncrementExtra(id: number): void {
    setExtras(state => {
      return state.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }

  function handleDecrementExtra(id: number): void {
    setExtras(state => {
      return state.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 }
          : item,
      );
    });
  }

  function handleIncrementFood(): void {
    setFoodQuantity(state => state + 1);
  }

  function handleDecrementFood(): void {
    if (foodQuantity > 1) {
      setFoodQuantity(state => state - 1);
    }
  }

  const toggleFavorite = useCallback(() => {
    // Toggle if food is favorite or not
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    const extrasPrice = extras.reduce(
      (sum, item) => sum + item.value * item.quantity,
      0,
    );
    return formatValue(foodQuantity * (food.price + extrasPrice));
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    // Finish the order and save on the API
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        {error ? (
          <ErrorMessage>Oops... falha ao buscar o prato</ErrorMessage>
        ) : (
          <>
            <FoodsContainer>
              <Food>
                <FoodImageContainer>
                  <Image
                    style={{ width: 327, height: 183 }}
                    source={{
                      uri: food.image_url,
                    }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            </FoodsContainer>
            <AdditionalsContainer>
              <Title>Adicionais</Title>
              {extras.map(extra => (
                <AdittionalItem key={extra.id}>
                  <AdittionalItemText>{extra.name}</AdittionalItemText>
                  <AdittionalQuantity>
                    <Icon
                      size={15}
                      color="#6C6C80"
                      name="minus"
                      onPress={() => handleDecrementExtra(extra.id)}
                      testID={`decrement-extra-${extra.id}`}
                    />
                    <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                      {extra.quantity}
                    </AdittionalItemText>
                    <Icon
                      size={15}
                      color="#6C6C80"
                      name="plus"
                      onPress={() => handleIncrementExtra(extra.id)}
                      testID={`increment-extra-${extra.id}`}
                    />
                  </AdittionalQuantity>
                </AdittionalItem>
              ))}
            </AdditionalsContainer>
            <TotalContainer>
              <Title>Total do pedido</Title>
              <PriceButtonContainer>
                <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
                <QuantityContainer>
                  <Icon
                    size={15}
                    color="#6C6C80"
                    name="minus"
                    onPress={handleDecrementFood}
                    testID="decrement-food"
                  />
                  <AdittionalItemText testID="food-quantity">
                    {foodQuantity}
                  </AdittionalItemText>
                  <Icon
                    size={15}
                    color="#6C6C80"
                    name="plus"
                    onPress={handleIncrementFood}
                    testID="increment-food"
                  />
                </QuantityContainer>
              </PriceButtonContainer>

              <FinishOrderButton onPress={() => handleFinishOrder()}>
                <ButtonText>Confirmar pedido</ButtonText>
                <IconContainer>
                  <Icon name="check-square" size={24} color="#fff" />
                </IconContainer>
              </FinishOrderButton>
            </TotalContainer>
          </>
        )}
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
