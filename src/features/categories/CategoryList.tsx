import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { GridFilterModel } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "./categorySlice";
import { CategoriesTable } from "./components/CategoryTable";

export const CategoryList = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState([10, 25, 50, 100]);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const options = { perPage, search, page };

  const { data, isFetching } = useGetCategoriesQuery(options);
  const [deleteCategory, deleteCategoryStatus] = useDeleteCategoryMutation();

  const { enqueueSnackbar } = useSnackbar();

  function handleOnPageChange(page: number) {
    setPage(page + 1);
  }

  function handleOnPageSizeChange(perPage: number) {
    setPerPage(perPage);
  }

  function handleFilterChange(filterModel: GridFilterModel) {
    if (filterModel.quickFilterValues?.length) {
      const search = filterModel.quickFilterValues.join("");
      setSearch(search);
    }

    return setSearch("");
  }

  async function handleDelete(id: string) {
    await deleteCategory({ id });
  }

  useEffect(() => {
    if (deleteCategoryStatus.isSuccess) {
      enqueueSnackbar("Category deleted!", { variant: "success" });
    }
    if (deleteCategoryStatus.error) {
      enqueueSnackbar("Category not deleted!", { variant: "error" });
    }
  }, [deleteCategoryStatus, enqueueSnackbar]);

  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent={"flex-end"}>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
          style={{ marginBottom: "1rem" }}
        >
          New Category
        </Button>
      </Box>

      <CategoriesTable
        data={data}
        isFetching={isFetching}
        perPage={perPage}
        rowsPerPage={rowsPerPage}
        handleDelete={handleDelete}
        handleOnPageSizeChange={handleOnPageSizeChange}
        handleOnPageChange={handleOnPageChange}
        handleFilterChange={handleFilterChange}
      />
    </Box>
  );
};
