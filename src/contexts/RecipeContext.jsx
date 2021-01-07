import { createContext, useContext } from 'react';
import { useAxios } from '../hooks/useAxios';

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
  const resultCount = 1;
  // prettier-ignore
  const { loading, error, response, data } = useAxios(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&limitLicense=true&number=${resultCount}`);

  return (
    <RecipeContext.Provider
      value={{ loading, error, response, recipes: data?.recipes }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContextProvider;

export const useRecipes = () => useContext(RecipeContext);
