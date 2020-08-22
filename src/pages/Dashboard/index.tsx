import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  ErrorMessage,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

interface Category {
  id: number;
  title: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchValue, setSearchValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const navigation = useNavigation();

  const loadCategories = async (): Promise<void> => {
    try {
      const { data } = await api.get(`categories`);

      setErrors(state => [...state.filter(err => err !== 'categories')]);

      setCategories(data);
    } catch (err) {
      setErrors(state => [...state, 'categories']);
    }
  };

  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('FoodDetails', { id });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFoods = async (): Promise<void> => {
      try {
        const { data } = await api.get(
          `foods?${
            selectedCategory
              ? `category_like=${selectedCategory}`
              : `name_like=${searchValue}`
          }`,
        );

        setErrors(state => [...state.filter(err => err !== 'foods')]);

        setFoods(data);
      } catch (error) {
        setErrors(state => [...state, 'foods']);
      }
    };

    loadFoods();
  }, [selectedCategory, searchValue]);

  function handleSelectCategory(id: number): void {
    setSelectedCategory(state => {
      if (state === id) return undefined;
      return id;
    });
  }

  function handleTextChange(text: string): void {
    !!selectedCategory && setSelectedCategory(undefined);
    setSearchValue(text);
  }

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={handleTextChange}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          {errors.includes('categories') ? (
            <ErrorMessage>Oops... falha ao carregar as categorias</ErrorMessage>
          ) : (
            <CategorySlider
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories.map(category => (
                <CategoryItem
                  key={category.id}
                  isSelected={category.id === selectedCategory}
                  onPress={() => handleSelectCategory(category.id)}
                  activeOpacity={0.6}
                  testID={`category-${category.id}`}
                >
                  <Image
                    style={{ width: 56, height: 56 }}
                    source={{ uri: category.image_url }}
                  />
                  <CategoryItemTitle>{category.title}</CategoryItemTitle>
                </CategoryItem>
              ))}
            </CategorySlider>
          )}
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          {errors.includes('foods') ? (
            <ErrorMessage>Oops... falha ao carregar os pratos</ErrorMessage>
          ) : (
            <FoodList>
              {foods.map(food => (
                <Food
                  key={food.id}
                  onPress={() => handleNavigate(food.id)}
                  activeOpacity={0.6}
                  testID={`food-${food.id}`}
                >
                  <FoodImageContainer>
                    <Image
                      style={{ width: 88, height: 88 }}
                      source={{ uri: food.thumbnail_url }}
                    />
                  </FoodImageContainer>
                  <FoodContent>
                    <FoodTitle>{food.name}</FoodTitle>
                    <FoodDescription>{food.description}</FoodDescription>
                    <FoodPricing>{food.formattedPrice}</FoodPricing>
                  </FoodContent>
                </Food>
              ))}
            </FoodList>
          )}
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
