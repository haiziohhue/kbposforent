import { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { CrudFilters, getDefaultFilter, useList } from "@refinedev/core";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { ICategory } from "../../interfaces";

type ProductItemProps = {
  setFilters: (filters: CrudFilters) => void;
  filters: CrudFilters;
};

export const CategoryFilter: React.FC<ProductItemProps> = ({
  setFilters,
  filters,
}) => {
  const [filterCategories, setFilterCategories] = useState<string>(
    getDefaultFilter("categorie.id", filters, "in")?.[0] || ""
  );

  const { data: categories, isLoading } = useList<ICategory>({
    resource: "categories",
  });

  useEffect(() => {
    setFilters?.([
      {
        field: "categorie.id",
        operator: "in",
        value: filterCategories.length > 0 ? filterCategories : undefined,
      },
    ]);
  }, [filterCategories]);

  const toggleFilterCategory = (clickedCategory: string) => {
    setFilterCategories((category) =>
      category === clickedCategory ? "" : clickedCategory
    );
  };

  return (
    <Stack>
      <Grid container columns={6} marginTop="10px">
        <Grid item p={0.5}>
          <LoadingButton
            onClick={() => setFilterCategories("")}
            variant={filterCategories.length === 0 ? "contained" : "outlined"}
            size="small"
            loading={isLoading}
            sx={{
              borderRadius: "50px",
            }}
          >
            Tout
          </LoadingButton>
        </Grid>
        {categories?.data.map((category: ICategory) => (
          <Grid item key={category.id} p={0.5}>
            <LoadingButton
              variant={
                filterCategories.includes(category.id.toString())
                  ? "contained"
                  : "outlined"
              }
              size="small"
              loading={isLoading}
              sx={{
                borderRadius: "50px",
              }}
              onClick={() => toggleFilterCategory(category.id.toString())}
            >
              {category.nom}
            </LoadingButton>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
