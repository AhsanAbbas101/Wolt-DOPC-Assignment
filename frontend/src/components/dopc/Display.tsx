import { IDopcOut } from "../../types"
import { DOPCError } from "../../utils/errors"

import idleImage from '../../assets/idle.png'
import distanceImage from '../../assets/distance.png'
import unknownImage from '../../assets/unknown.png'
import reachedImage from '../../assets/done.png'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import React from "react"

interface Props {
    price: IDopcOut | null
    error: DOPCError | null
}

const Display = ({ price, error }: Props) => {

    const errorElement = (src: string, msg: string, caption: string): React.JSX.Element => {
        return (
            <Stack direction="column" sx={{ textAlign: 'center' }} gap={1}>
                <Typography variant="h4">Oops!</Typography>
                <img width={400} height={400} src={src} alt="logo" />
                <Typography variant="h5" data-test-id="error.message">{msg}</Typography>
                <Typography variant="caption">{caption}</Typography>
            </Stack>
        )
    }

    const formatCurrency = (amount: number): string => {
        return (amount / 100).toFixed(2).replace('.', ',')
    }


    if (error) {
        switch (error.name) {
            case 'DISTANCE_ERROR':
                return errorElement(distanceImage, 'Delivery not possible.', 'Delivery distance is too long.')

            case 'URL_ERROR':
                return errorElement(distanceImage, 'Unable to find the venue!', 'Make sure the venue url slug is correct.')


            case 'SERVER_ERROR':
                return errorElement(unknownImage, 'An unexpected error occurred.', 'Please try again later.')

            case 'VALUE_ERROR':
                return errorElement(unknownImage, error.message, 'Please try again later.')

        }
    }

    if (!price)
        return <img width={300} height={300} src={idleImage} alt="logo" />

    return (
        <Stack gap={2}>
            <img width={400} height={300} src={reachedImage} alt="logo" />
            <Stack>
                <Box sx={BoxStyle}>
                    <span>Cart Value:</span>
                    <span data-raw-value={price.cartValue}>{formatCurrency(price.cartValue)} €</span>
                </Box>
                <Box sx={BoxStyle}>
                    <span>Delivery fee:</span>
                    <span data-test-id="deliveryFee" data-raw-value={price.deliveryFee}>{formatCurrency(price.deliveryFee)} €</span>
                </Box>
                <Box sx={BoxStyle}>
                    <span>Delivery distance:</span>
                    <span data-test-id="deliveryDistance" data-raw-value={price.deliveryDistance}>{price.deliveryDistance} m</span>
                </Box>
                <Box sx={BoxStyle}>
                    <span>Small order surcharge:</span>
                    <span data-test-id="smallOrderSurcharge" data-raw-value={price.smallOrderSurcharge}>{formatCurrency(price.smallOrderSurcharge)} €</span>
                </Box>
                <Box sx={SummaryBoxStyle}>
                    <span>Total price:</span>
                    <span data-test-id="totalPrice" data-raw-value={price.totalPrice}>{formatCurrency(price.totalPrice)} €</span>
                </Box>
            </Stack>
        </Stack>
    )
}


// Styling

const BoxStyle = {
    display: 'flex', justifyContent: 'space-between', marginBottom: 1
}
const SummaryBoxStyle = {
    ...BoxStyle,
    marginBottom: 2,
    fontWeight: 'bold',
    fontSize: '20px',
    marginTop: '15px',
    borderTop: '2px solid #ccc',
    paddingTop: '10px'
}
export default Display