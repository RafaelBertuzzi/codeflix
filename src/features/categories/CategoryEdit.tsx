import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category } from "../../types/Category";
import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "./categorySlice";
import { CategoryForm } from "./components/CategoryForm";

export const CategoryEdit = () => {
  const id = useParams().id || "";
  const { data: category, isFetching } = useGetCategoryQuery({ id });
  const [updateCategory, status] = useUpdateCategoryMutation();
  const [categoryState, setCategoryState] = useState<Category>({
    id: "",
    name: "",
    description: "",
    created_at: "",
    deleted_at: "",
    updated_at: "",
    is_active: false,
  });
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateCategory(categoryState);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryState({ ...categoryState, [name]: value });
  };

  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCategoryState({ ...categoryState, [name]: checked });
  };

  useEffect(() => {
    if (category) {
      setCategoryState(category.data);
    }
  }, [category]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
    }
    if (status.error) {
      enqueueSnackbar("Category not updated!", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Category</Typography>
          </Box>
        </Box>

        <CategoryForm
          category={categoryState}
          handleToggle={handleToggle}
          isDisabled={status.isLoading}
          isLoading={false}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
};
