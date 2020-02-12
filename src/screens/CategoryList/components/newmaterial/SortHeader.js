import React from 'react';
import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Columns from './columns';
import Popover from '@material-ui/core/Popover';


const useStyles = makeStyles(theme => ({
    button: {
        color:"#06847B",
        border: "1px solid #7bbcb7",
        '&:hover':{
            backgroundColor: "rgba(6, 132, 123, 0.1)",
            border: "1px solid #06847B",
        }
      },

}));

function SortHeader(){
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
 
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(false);
      };
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;
    
     
        return(
            <Grid lg={12} md={12} sm={11} xs={12} style={{display:"flex",justifyContent:"space-between",marginBottom:"17px",marginTop:"25px"}}>
                <Grid xl={8} lg={9} md={8} sm={7} xs={6}>
                     <h2 style={{fontSize:"24px",fontWeight:"400"}}>Products</h2>   
                </Grid>
                <Grid xl={4} lg={3} md={4} sm={5} xs={6} lassName="column" style={{display:"flex",justifyContent:"space-between"}}>
                    <Grid lg={5} md={4} sm={5} xs={4}>
                        <Button color="primary" backgroundColor="secondary"  onClick={handleClick} variant="outlined" size="large" color="primary" style={{fontSize:"15px",padding:"6px 6px"}}>
                            COLUMNS<ArrowDownwardIcon fontSize="inherit" />
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <Columns columnclose={handleClose}/>
                        </Popover>



                    </Grid>
                    <Grid lg={7} md={7} sm={7} xs={8}>
                        <Button  className="product" variant="contained" size="large" color="primary" backgroundColor="secondary">
                        CREATE PRODUCT
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        ) 

}
export default SortHeader