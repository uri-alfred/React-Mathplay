import { Grid } from "@mui/material";
import React from "react";
import { PacmanLoader } from "react-spinners";


const Loading = () => {
    return (
        <div className="loading">
            <Grid container spacing={2}>
                <Grid xs={3}></Grid>
                <Grid xs={6}>
                    <PacmanLoader color="var(--azul-oscuro)" size={150} loading={true} />
                </Grid>
                <Grid xs={3}></Grid>
            </Grid>
        </div>
    );
};

export default Loading;
