import {
  Category,
  CategoryParams,
  Result,
  Results,
} from "./../../types/Category";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

const category: Category = {
  id: "1",
  name: "Category 1",
  description: "Category 1 description",
  is_active: true,
  deleted_at: null,
  created_at: "2020-01-01",
  updated_at: "2020-01-01",
};

const endpointUrl: string = "/categories";

function parseQueryParams(params: CategoryParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.append("page", params.page.toString());
  }

  if (params.perPage) {
    query.append("per_page", params.perPage.toString());
  }

  if (params.search) {
    query.append("per_page", params.search);
  }

  if (params.isActive) {
    query.append("is_active", params.isActive.toString());
  }

  return query.toString();
}

function getCategories({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search, isActive: true };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function deleteCategoryMutation(category: Category) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "DELETE",
  };
}

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getCategories: query<Results, CategoryParams>({
      query: getCategories,
      providesTags: ["Categories"],
    }),
    deleteCategory: mutation<Result, { id: string }>({
      query: deleteCategoryMutation,
      invalidatesTags: ["Categories"],
    }),
  }),
});

const categories: Category[] = [
  category,
  {
    ...category,
    id: "2",
    description: "Category 2 description",
    name: "Category 2",
  },
  {
    ...category,
    id: "3",
    description: "Category 3 description",
    name: "Category 3",
  },
  {
    ...category,
    id: "4",
    description: "Category 4 description",
    name: "Category 4",
  },
];

export const initalState = categories;

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initalState,
  reducers: {
    createCategory(state, action) {
      state.push(action.payload);
    },
    updateCategory(state, action) {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      );
      state[index] = action.payload;
    },
    deleteCategory(state, action) {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      );
      state.splice(index, 1);
    },
  },
});

export const selectCategories = (state: RootState) => state.categories;

export const selectCategoryById = (state: RootState, id: string) => {
  const category = state.categories.find((category) => category.id === id);
  return (
    category || {
      id: "",
      name: "",
      description: "",
      is_active: false,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    }
  );
};

export default categoriesSlice.reducer;
export const { createCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;

export const { useGetCategoriesQuery, useDeleteCategoryMutation } =
  categoriesApiSlice;
