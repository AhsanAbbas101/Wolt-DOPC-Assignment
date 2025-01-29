import { useState } from "react"

import { IDopcFields } from '../../types'

import DOPCForm from "./Form"
import Display from "./Display"

import Box from '@mui/material/Box';

import { IDopcParamsSchema } from "../../utils/schemas"
import { useDeliveryCalculator } from "../../hooks/useDeliveryCalculator"

// Delivery Order Price Calculator Component.
const DOPC = () => {


    const [fields, setFields] = useState<IDopcFields | null>(null);

    const { deliveryPrice, error } = useDeliveryCalculator(fields);


    const handleCalculate = (inputFields: IDopcFields) => {

        const result = IDopcParamsSchema.safeParse(inputFields);    //validate
        if (result.success) {
            const parsedFields = result.data
            parsedFields.cartValue *= 100; // convert to lowest denomination of EUR currency

            console.log(parsedFields);

            setFields(parsedFields);

        }

    }

    return (
        <Box sx={containerStyles}>
            {/* Form Box */}
            <Box sx={formBoxStyles}>
                <DOPCForm onSubmit={handleCalculate} />
            </Box>

            {/* Display Price Box */}
            <Box sx={boxStyles}>
                <Display price={deliveryPrice} error={error} />
            </Box>
        </Box>


    )
}

// Styling

const containerStyles = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: { xs: 2, sm: 1 }, // Decrease gap on larger screens
    boxSizing: "border-box",
    width: "100%",
    minHeight: "100vh",
    flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens, row on larger screens
};

const boxStyles = {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    minWidth: "300px",
    maxWidth: "600px", // Limit the width to 600px on larger screens
    boxSizing: "border-box",
    mx: { sm: 1, xs: "auto" }, // Reduce horizontal margin on larger screens
};

const formBoxStyles = {
    ...boxStyles,
    border: 5,
    borderRadius: 2,
    borderColor: "#00c2e8",
    boxShadow: 2,
};



export default DOPC