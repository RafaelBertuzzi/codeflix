import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Category } from "../../types/Category";
import { useCreateCategoryMutation } from "./categorySlice";
import { CategoryForm } from "./components/CategoryForm";

export const CategoryCreate = () => {
  const [createCategory, status] = useCreateCategoryMutation();
  const [isDisabled, setIsDisabled] = useState(false);
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
    await createCategory(categoryState);
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
    if (status.isSuccess) {
      enqueueSnackbar("Category created successfully!", { variant: "success" });
      setIsDisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("Category not created!", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Category</Typography>
          </Box>
        </Box>

        <CategoryForm
          category={categoryState}
          handleToggle={handleToggle}
          isDisabled={isDisabled}
          isLoading={false}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
};
