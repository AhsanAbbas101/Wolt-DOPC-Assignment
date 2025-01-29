

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';

import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

import * as Yup from 'yup';
import { ErrorMessage, Field, Formik, Form } from "formik"
import LocationInputs from './LocationInput';
import { IDopcFields } from "../../types";

const FormSchema = Yup.object().shape({
    venueSlug: Yup.string()
        .min(1, 'Too short venue slug!')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid url slug!')
        .required('Required!'),
    cartValue: Yup.number()
        .min(0, 'Invalid cart amount!')
        .required('Required!')
        .typeError('Invalid cart value! Must be a ${type}!'),
    userLatitude: Yup.number()
        .min(-90, 'Latitude range [-90,90].')
        .max(90, 'Latitude range [-90,90].')
        .required('Required!')
        .typeError('Invalid latitude value! Must be a ${type}!'),
    userLongitude: Yup.number()
        .min(-180, 'Longitude range [-180,180).')
        .lessThan(180, 'Longitude range [-180,180).')
        .required('Required!')
        .typeError('Invalid longitude value! Must be a ${type}!')
})

interface Props {
    onSubmit: (fields: IDopcFields) => void
}

const DOPCForm = ({ onSubmit }: Props) => {

    return (
        <Formik
            initialValues={{
                venueSlug: '',
                cartValue: 0,
                userLatitude: 0,
                userLongitude: 0
            }}
            validationSchema={FormSchema}
            onSubmit={onSubmit}
        >
            <Form>
                <Grid container spacing={4}>
                    {/* Header */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h5" gutterBottom align="center" fontWeight="bold" >
                            Delivery Order Price Calculator
                        </Typography>
                    </Grid>

                    {/* Venue Field */}
                    <Grid size={{ xs: 12 }}>
                        <Stack alignItems="center" direction="row" gap={1}>
                            <StoreIcon />
                            <Typography variant="subtitle1" fontWeight="bold">Venue</Typography>
                            <ErrorMessage name="venueSlug" render={msg => <Alert severity="error" data-test-id="error.venueSlug" >{msg}</Alert>} />
                        </Stack>

                        <Field
                            name="venueSlug"
                            data-test-id="venueSlug"
                            as={TextField}
                            fullWidth
                            variant="outlined"
                            size="medium"
                            placeholder="Venue URL Slug"
                            color='white'
                        />


                        <Typography variant="caption" color="textSecondary">
                            Enter the url slug of the venue.
                        </Typography>
                    </Grid>

                    {/* Coordinates Fields */}
                    <Grid size={{ xs: 12 }} >
                        <Stack alignItems="center" direction="row" gap={1}>
                            <PersonPinCircleIcon />
                            <Typography variant="subtitle1" fontWeight="bold">Your Location</Typography>

                        </Stack>
                        <ErrorMessage name="userLatitude" render={msg => <Alert severity="error" data-test-id="error.userLatitude">{msg}</Alert>} />
                        <ErrorMessage name="userLongitude" render={msg => <Alert severity="error" data-test-id="error.userLongitude">{msg}</Alert>} />
                        <LocationInputs />
                    </Grid>

                    {/* Cart Amount Field */}
                    <Grid size={{ xs: 12 }}>
                        <Stack alignItems="center" direction="row" gap={1}>
                            <ShoppingCartIcon />
                            <Typography variant="subtitle1" fontWeight="bold">Cart Amount</Typography>
                            <ErrorMessage name="cartValue" render={msg => <Alert severity="error" data-test-id="error.cartValue">{msg}</Alert>} />
                        </Stack>

                        <Field
                            name="cartValue"
                            data-test-id="cartValue"
                            as={TextField}
                            fullWidth
                            variant="outlined"
                            size="medium"
                            placeholder="Enter cart amount"
                            type="number"
                        />
                        <Typography variant="caption" color="textSecondary">
                            Enter the amount of your cart in Euros.
                        </Typography>


                    </Grid>

                    {/* Calculate Button */}
                    <Grid size={{ xs: 12 }} textAlign="right">
                        <Button variant="contained" color="primary" size="large" type="submit">
                            Calculate
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </Formik>
    );
};

export default DOPCForm;
