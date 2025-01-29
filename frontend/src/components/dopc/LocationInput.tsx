import { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import useLocation from "../../hooks/useLocation";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';

interface FormValues {
    userLatitude: number;
    userLongitude: number;
}

const LocationInputs = () => {
    const location = useLocation();
    const { setFieldValue } = useFormikContext<FormValues>();

    useEffect(() => {
        const updateFields = async () => {
            if (location.coords) {
                await setFieldValue("userLatitude", Math.round(location.coords.latitude * 1e5) / 1e5);
                await setFieldValue("userLongitude", Math.round(location.coords.longitude * 1e5) / 1e5);
            }
        }
        void updateFields()

    }, [location.coords, setFieldValue]);

    return (
        <>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 6 }} >
                    <Field
                        name="userLatitude"
                        as={TextField}
                        data-test-id="userLatitude"
                        fullWidth
                        variant="outlined"
                        size="medium"
                        placeholder="Latitude"
                        type='number'
                    />

                    <Typography variant="caption" color="textSecondary">
                        Latitude of the your location.
                    </Typography>
                </Grid>
                <Grid size={{ xs: 6 }} >
                    <Field
                        name="userLongitude"
                        data-test-id="userLongitude"
                        as={TextField}
                        fullWidth
                        variant="outlined"
                        size="medium"
                        placeholder="Longitude"
                        type='number'
                    />

                    <Typography variant="caption" color="textSecondary">
                        Longitude of the your location.
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }} textAlign="right">
                    <Button data-test-id="getLocation" variant="outlined" color="secondary" onClick={location.fetch}>
                        Get Coordinates
                    </Button>
                    {location.loading && <Typography>Fetching location...</Typography>}
                    {location.error && <Alert severity="info">{location.error}</Alert>}
                </Grid>
            </Grid>


        </>
    );
};

export default LocationInputs;
