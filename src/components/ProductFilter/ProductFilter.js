import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { Search, Filter } from "./components";

import { CSVLink } from "react-csv";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  search: {
    flexGrow: 1,
    maxWidth: 480,
    flexBasis: 480,
  },
  filterButton: {
    marginLeft: "auto",
  },
  filterIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ProductFilter = (props) => {
  const { onFilter, onSearch, masters, dataCSV, className, ...rest } = props;

  const classes = useStyles();

  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterOpen = () => {
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid item>
        <Search className={classes.search} onSearch={onSearch} />
      </Grid>

      <Grid item>
        {window.location.pathname === "/productlist" ? (
          <>
            {" "}
            <CSVLink
              header={dataCSV.keyCSV}
              data={dataCSV.valueCSV}
              filename={"ProductDetails.csv"}
              style={{ textDecoration: "none " }}
            >
              <Button
                color="primary"
                style={{ marginRight: "8px" }}
                size="small"
                variant="outlined"
              >
                Download CSV
              </Button>
            </CSVLink>
          </>
        ) : (
          ""
        )}

        <Button
          className={classes.filterButton}
          color="primary"
          onClick={handleFilterOpen}
          size="small"
          variant="outlined"
        >
          <FilterListIcon className={classes.filterIcon} /> Filter
        </Button>
      </Grid>

      <Filter
        onClose={handleFilterClose}
        onFilter={onFilter}
        open={openFilter}
        masters={masters}
      />
    </Grid>
  );
};

ProductFilter.propTypes = {
  className: PropTypes.string,
  onFilter: PropTypes.func,
  onSearch: PropTypes.func,
  masters: PropTypes.object,
};

export default ProductFilter;
